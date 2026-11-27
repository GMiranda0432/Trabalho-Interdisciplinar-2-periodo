/* ============================================================
   script.js — núcleo compartilhado + entry point (Visão Geral)

   Arquitetura MVC:
   - Model  -> js/models/*        (regras e dados; nunca toca no DOM)
   - View   -> aqui (classe base) + js/views/*  (única camada que toca no DOM)
   - Control-> js/controllers/*   (regras de negócio; nunca toca no DOM)
   - Páginas-> js/pags/*          (ligam View + Controller para cada tela)

   Toda a manipulação de DOM acontece exclusivamente na camada de
   visualização (classe View abaixo e suas subclasses em js/views).
   ============================================================ */

import Atleta from "./models/atleta.js";
import Competicao from "./models/comp.js";
import Maratona from "./models/marat.js";
import TrailRunning from "./models/trail.js";
import Inscricao from "./models/inscricao.js";
import AtletaController from "./controllers/atletaControl.js";
import CompeticaoController from "./controllers/compControl.js";

/* ============================================================
   VIEW BASE — única camada autorizada a manipular o DOM
   ============================================================ */
export class View {
    constructor(raiz = document) {
        this.raiz = raiz;
    }

    elemento(seletor) {
        return this.raiz.querySelector(seletor);
    }

    elementos(seletor) {
        return Array.from(this.raiz.querySelectorAll(seletor));
    }

    lerValor(seletor) {
        const el = this.elemento(seletor);
        return el ? el.value.trim() : "";
    }

    definirValor(seletor, valor) {
        const el = this.elemento(seletor);
        if (el) el.value = valor ?? "";
    }

    escrever(seletor, texto) {
        const el = this.elemento(seletor);
        if (el) el.textContent = texto;
    }

    exibir(seletor) {
        const el = this.elemento(seletor);
        if (el) el.classList.remove("oculto");
    }

    ocultar(seletor) {
        const el = this.elemento(seletor);
        if (el) el.classList.add("oculto");
    }

    // Liga/desliga uma classe de estado (ex.: aba ativa)
    alternarClasse(seletor, classe, ativo) {
        const el = this.elemento(seletor);
        if (el) el.classList.toggle(classe, ativo);
    }

    // Modal — controlado por classe, mantendo o DOM só na View
    abrirModal(seletor) {
        this.alternarClasse(seletor, "aberto", true);
    }

    fecharModal(seletor) {
        this.alternarClasse(seletor, "aberto", false);
    }

    // Registra um listener em um elemento
    ligar(seletor, evento, tratador) {
        const el = this.elemento(seletor);
        if (el) el.addEventListener(evento, tratador);
    }

    // Delegação de eventos: o tratador recebe apenas o alvo que casa com o seletor
    delegar(seletor, evento, seletorAlvo, tratador) {
        const raiz = this.elemento(seletor);
        if (raiz) {
            raiz.addEventListener(evento, (e) => {
                const alvo = e.target.closest(seletorAlvo);
                if (alvo) tratador(alvo);
            });
        }
    }

    // Lê um atributo data-* de um elemento
    dado(elemento, chave) {
        return elemento.dataset[chave];
    }

    // Lê o id passado pela URL (?id=)
    lerIdDaUrl() {
        return Number(new URLSearchParams(window.location.search).get("id"));
    }

    // Protege textos antes de injetá-los no HTML
    escapar(texto) {
        const mapa = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
        return String(texto ?? "").replace(/[&<>"']/g, (c) => mapa[c]);
    }

    // Preenche um <select>; parametro opcional insere a primeira opção neutra
    preencherSelect(seletor, itens, opcaoNeutra) {
        const select = this.elemento(seletor);
        if (select) {
            const opcoes = [];
            if (opcaoNeutra) opcoes.push(`<option value="">${this.escapar(opcaoNeutra)}</option>`);
            itens.forEach((item) => opcoes.push(item));
            select.innerHTML = opcoes.join("");
        }
    }

    // Preenche um <select> a partir de objetos que tenham id e nome
    preencherSelectDeObjetos(seletor, itens, opcaoNeutra) {
        const opcoes = itens.map((item) => `<option value="${this.escapar(item.id)}">${this.escapar(item.nome)}</option>`);
        this.preencherSelect(seletor, opcoes, opcaoNeutra);
    }

    // Preenche o <tbody> de uma tabela; "criarLinha" monta o HTML de cada item.
    // Quando a lista está vazia, mostra uma linha única com "mensagemVazia".
    preencherTabela(seletor, itens, criarLinha, colspan, mensagemVazia) {
        const corpo = this.elemento(seletor);
        if (corpo) {
            if (!itens.length) {
                corpo.innerHTML = `<tr><td class="tabela-vazia" colspan="${colspan}">${this.escapar(mensagemVazia)}</td></tr>`;
            } else {
                corpo.innerHTML = itens.map(criarLinha).join("");
            }
        }
    }
}

/* ============================================================
   FÁBRICAS — convertem objetos simples em instâncias de Model
   ============================================================ */
// Verifica se a data (aaaa-mm-dd) veio completa e representa um dia real do calendário
export function dataCompleta(dataIso) {
    // O input type="date" só devolve valor quando dia, mês e ano estão preenchidos
    let completa = false;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dataIso ?? "")) {
        const [ano, mes, dia] = dataIso.split("-").map(Number);
        const data = new Date(ano, mes - 1, dia);
        // Ao criar a data, o JavaScript "corrige" dias inválidos (ex.: 31/02 vira 03/03);
        // por isso comparamos de volta os três componentes
        if (data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia) {
            completa = true;
        }
    }
    return completa;
}

// Calcula a idade (em anos completos) a partir da data de nascimento e da data atual
export function calcularIdade(dataNascimento) {
    let idade = 0;
    // Só calcula quando a data está completa e é válida
    if (dataCompleta(dataNascimento)) {
        const [ano, mes, dia] = dataNascimento.split("-").map(Number);
        const nascimento = new Date(ano, mes - 1, dia);
        const hoje = new Date();
        idade = hoje.getFullYear() - nascimento.getFullYear();
        const diferencaMeses = hoje.getMonth() - nascimento.getMonth();
        // Ainda não fez aniversário neste ano
        if (diferencaMeses < 0) {
            idade--;
        } else if (diferencaMeses === 0) {
            if (hoje.getDate() < nascimento.getDate()) {
                idade--;
            }
        }
    }
    return idade;
}

// Data (yyyy-mm-dd) usada para pré-preencher o formulário a partir da idade
export function dataAproximada(idade) {
    return `${new Date().getFullYear() - Number(idade)}-01-01`;
}

// Verifica se o texto tem apenas letras e espaços (bloqueia números e símbolos)
export function somenteLetrasEEspacos(valor) {
    const texto = String(valor ?? "").trim();
    let valido = false;
    if (texto !== "" && /^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/.test(texto)) {
        valido = true;
    }
    return valido;
}

// Verifica se o texto tem formato de e-mail (algo@dominio.ext)
export function emailValido(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(valor ?? "").trim());
}

// Aplica a máscara de CPF (000.000.000-00) a partir de qualquer texto digitado
export function mascararCpf(valor) {
    // Mantém apenas os dígitos e limita a 11 caracteres numéricos
    const digitos = String(valor ?? "").replace(/\D/g, "").slice(0, 11);
    let formatado = digitos;
    if (digitos.length > 9) {
        formatado = `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-${digitos.slice(9)}`;
    } else if (digitos.length > 6) {
        formatado = `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6)}`;
    } else if (digitos.length > 3) {
        formatado = `${digitos.slice(0, 3)}.${digitos.slice(3)}`;
    }
    return formatado;
}

// Valida os dados de um atleta e devolve a mensagem de erro (string vazia = tudo certo)
export function validarAtleta(dados) {
    let erro = "";
    // 1) Nome: obrigatório e só com letras e espaços (sem números)
    if (!dados.nome) {
        erro = "Informe o nome do atleta.";
    } else if (!somenteLetrasEEspacos(dados.nome)) {
        erro = "O nome deve conter apenas letras e espaços (sem números).";
    }
    // 2) CPF: exatamente 11 números no formato 000.000.000-00
    else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(dados.cpf)) {
        erro = "Informe um CPF com 11 números no formato 000.000.000-00.";
    }
    // 3) Data de nascimento: precisa vir completa (dia, mês e ano)
    else if (!dataCompleta(dados.nascimento)) {
        erro = "Informe a data de nascimento completa (dia, mês e ano).";
    }
    // 4) Idade: precisa ser maior que 18 e menor que 100 anos
    else if (dados.idade < 18 || dados.idade > 100) {
        erro = "O ano de nascimento deve resultar em maior que 18 e menor que 100 anos.";
    }
    // 5) Modalidade, e-mail e peso
    else if (!dados.modalidade) {
        erro = "Selecione a modalidade.";
    } else if (!dados.email) {
        erro = "Informe o e-mail.";
    } else if (!emailValido(dados.email)) {
        erro = "Informe um e-mail válido (ex.: nome@dominio.com).";
    } else if (!(dados.peso > 0)) {
        erro = "O peso deve ser um valor positivo.";
    }
    return erro;
}

// Valida os dados de uma competição e devolve a mensagem de erro (string vazia = tudo certo)
export function validarCompeticao(dados) {
    let erro = "";
    if (!dados.nome) {
        erro = "Informe o nome da competição.";
    }
    // A data é lida no formato dd/mm/aaaa; exige dia, mês e ano completos
    else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dados.data)) {
        erro = "Informe a data da competição completa (dia, mês e ano).";
    }
    // Horário: o final é opcional, mas quando informado o inicial é obrigatório
    // e o término precisa ser maior que o início (o formato HH:MM é comparável como texto)
    else if (dados.horarioFim && !dados.horarioInicio) {
        erro = "Informe o horário inicial da competição.";
    } else if (dados.horarioFim && dados.horarioFim <= dados.horarioInicio) {
        erro = "O horário final deve ser maior que o horário inicial.";
    } else if (!dados.local) {
        erro = "Informe o local da competição.";
    } else if (!dados.tipo) {
        erro = "Selecione o tipo de corrida.";
    }
    // Distância é obrigatória e deve ser positiva
    else if (!(dados.distancia > 0)) {
        erro = "A distância deve ser um valor positivo.";
    }
    // Altimetria é opcional, mas quando informada precisa ser positiva
    else if (dados.altimetriaInformada && !(dados.altimetria > 0)) {
        erro = "A altimetria deve ser um valor positivo.";
    }
    // Pontos de hidratação não podem ser negativos
    else if (dados.pontosHidratacao < 0) {
        erro = "Os pontos de hidratação não podem ser negativos.";
    }
    return erro;
}

// Converte a data do formulário (aaaa-mm-dd) para o formato exibido (dd/mm/aaaa)
export function paraDataBr(iso) {
    if (!iso || !iso.includes("-")) return iso ?? "";
    const [ano, mes, dia] = iso.split("-");
    return `${dia}/${mes}/${ano}`;
}

// Converte a data exibida (dd/mm/aaaa) para o formato do formulário (aaaa-mm-dd)
export function paraDataIso(br) {
    if (!br || !br.includes("/")) return br ?? "";
    const [dia, mes, ano] = br.split("/");
    return `${ano}-${mes}-${dia}`;
}

// Gera o próximo id a partir do maior id já existente
export function proximoId(itens) {
    return itens.reduce((maior, item) => Math.max(maior, Number(item.id) || 0), 0) + 1;
}

export function criarAtleta(dados) {
    const idade = dados.idade ?? calcularIdade(dados.dataNascimento);
    return new Atleta(
        dados.id,
        Number(idade),
        dados.cpf,
        dados.nome,
        dados.email,
        dados.modalidade,
        Number(dados.peso)
    );
}

export function criarCompeticao(dados) {
    // O segundo critério mantém compatibilidade com trails já salvos sem o campo "tipo".
    if (dados.tipo === "TrailRunning" || "checkPoint" in dados) {
        return new TrailRunning(
            dados.id, dados.horario, dados.data, dados.nome, dados.local,
            Number(dados.distancia), Number(dados.altimetria),
            dados.checkPoint, dados.grauDificuldade, dados.climaEsperado
        );
    }
    return new Maratona(
        dados.id, dados.horario, dados.data, dados.nome, dados.local,
        Number(dados.distancia), Number(dados.altimetria),
        dados.objetivo, dados.fechamentoVias, Number(dados.pontosHidratacao)
    );
}

// Converte cada item { competicaoId, atletaId } (vindo do JSON/localStorage)
// em uma instância de Inscricao, mantendo o código orientado a objetos.
export function hidratarInscricoes(inscricoes) {
    return (inscricoes ?? []).map((i) => new Inscricao(i.competicaoId, i.atletaId));
}

// Cria uma inscrição (associação Atleta x Competição)
export function criarInscricao(competicaoId, atletaId) {
    return new Inscricao(competicaoId, atletaId);
}

// Carrega as instâncias nos controladores informados.
// Usa "?? []" para que a ausência de uma lista no JSON não quebre a página.
export function hidratar(controladorAtleta, controladorCompeticao, dados) {
    if (controladorAtleta) {
        (dados.atletas ?? []).forEach((a) => controladorAtleta.cadastrarAtleta(criarAtleta(a)));
    }
    if (controladorCompeticao) {
        (dados.competicoes ?? []).forEach((c) => controladorCompeticao.cadastrarCompeticao(criarCompeticao(c)));
    }
}

// Reúne o carregamento + hidratação usados por todas as páginas (evita repetição).
// Se o arquivo JSON não puder ser lido (ex.: servidor desligado), lança um erro
// com mensagem clara para a página avisar o usuário.
export async function carregarSistema(caminhoJson) {
    let dados;
    try {
        dados = await Armazenamento.carregar(caminhoJson);
    } catch (erro) {
        throw new Error(`Não foi possível carregar os dados (${caminhoJson}). Verifique se o servidor está em execução.`, { cause: erro });
    }
    const atletaControl = new AtletaController();
    const compControl = new CompeticaoController();
    hidratar(atletaControl, compControl, dados);
    // As inscrições passam a ser instâncias de Inscricao (e não objetos literais)
    dados.inscricoes = hidratarInscricoes(dados.inscricoes);
    return { dados, atletaControl, compControl };
}

// Tratamento padrão de falha na inicialização das páginas.
// É passado direto para iniciar().catch(...) em cada página.
export function tratarErroCarregamento(erro) {
    console.error("Falha ao inicializar a página:", erro);
    alert(erro?.message ?? "Falha ao carregar os dados. Recarregue a página.");
}

// Conta quantas inscrições pertencem a uma competição (usado nos relatórios)
export function contarInscritos(inscricoes, competicaoId) {
    return inscricoes.filter((i) => Number(i.competicaoId) === Number(competicaoId)).length;
}

/* ============================================================
   PERSISTÊNCIA — localStorage com carga inicial de data/dados.json
   ============================================================ */
export const Armazenamento = {
    // Atualiza apenas as chaves informadas, preservando as demais
    salvar(dados) {
        if (dados.atletas !== undefined) localStorage.setItem("atletas", JSON.stringify(dados.atletas));
        if (dados.competicoes !== undefined) localStorage.setItem("competicoes", JSON.stringify(dados.competicoes));
        if (dados.inscricoes !== undefined) localStorage.setItem("inscricoes", JSON.stringify(dados.inscricoes));
    },

    ler() {
        const atletas = localStorage.getItem("atletas");
        if (!atletas) return null;
        return {
            atletas: JSON.parse(atletas),
            competicoes: JSON.parse(localStorage.getItem("competicoes") ?? "[]"),
            inscricoes: JSON.parse(localStorage.getItem("inscricoes") ?? "[]"),
        };
    },

    // Devolve os dados salvos; na primeira execução carrega o JSON e persiste
    async carregar(caminhoJson) {
        const salvo = this.ler();
        if (salvo) return salvo;
        const resposta = await fetch(caminhoJson);
        const dados = await resposta.json();
        dados.inscricoes = dados.inscricoes ?? [];
        this.salvar(dados);
        return dados;
    },
};

/* ============================================================
   ENTRY POINT — Visão Geral (index.html)
   Executado apenas quando a página possui os contadores.
   ============================================================ */
async function iniciarVisaoGeral() {
    const view = new View();
    try {
        // Reutiliza o mesmo carregamento das demais páginas (evita lógica duplicada)
        const { atletaControl, compControl } = await carregarSistema("data/dados.json");
        view.escrever("#quantidadeAtletas", atletaControl.vetAtletas.length);
        view.escrever("#quantidadeCompeticoes", compControl.vetCompeticoes.length);
    } catch (erro) {
        console.error("Falha ao carregar os dados:", erro);
        view.escrever("#quantidadeAtletas", "0");
        view.escrever("#quantidadeCompeticoes", "0");
    }
}

if (document.querySelector("#quantidadeAtletas")) {
    iniciarVisaoGeral();
}
