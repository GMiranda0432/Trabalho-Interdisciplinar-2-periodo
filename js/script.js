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
        if (!raiz) return;
        raiz.addEventListener(evento, (e) => {
            const alvo = e.target.closest(seletorAlvo);
            if (alvo) tratador(alvo);
        });
    }

    // Lê um atributo data-* de um elemento
    dado(elemento, chave) {
        return elemento.dataset[chave];
    }

    // Lê o id passado pela URL (?id=)
    lerIdDaUrl() {
        return Number(new URLSearchParams(window.location.search).get("id"));
    }

    // Mostra um texto na área de saída e no console
    mostrar(texto) {
        const saida = this.elemento("#saida");
        if (saida) saida.textContent = texto;
        console.log(texto);
    }

    // Mostra uma lista de objetos usando o toString() de cada um
    mostrarLista(lista) {
        this.mostrar(lista.map((item) => item.toString()).join("\n"));
    }

    // Protege textos antes de injetá-los no HTML
    escapar(texto) {
        const mapa = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
        return String(texto ?? "").replace(/[&<>"']/g, (c) => mapa[c]);
    }

    // Preenche um <select>; parametro opcional insere a primeira opção neutra
    preencherSelect(seletor, itens, opcaoNeutra) {
        const select = this.elemento(seletor);
        if (!select) return;
        const opcoes = [];
        if (opcaoNeutra) opcoes.push(`<option value="">${this.escapar(opcaoNeutra)}</option>`);
        itens.forEach((item) => opcoes.push(item));
        select.innerHTML = opcoes.join("");
    }

    // Preenche um <select> a partir de objetos que tenham id e nome
    preencherSelectDeObjetos(seletor, itens, opcaoNeutra) {
        const opcoes = itens.map((item) => `<option value="${this.escapar(item.id)}">${this.escapar(item.nome)}</option>`);
        this.preencherSelect(seletor, opcoes, opcaoNeutra);
    }
}

/* ============================================================
   FÁBRICAS — convertem objetos simples em instâncias de Model
   ============================================================ */
export function calcularIdade(dataNascimento) {
    if (!dataNascimento) return 0;
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const meses = hoje.getMonth() - nascimento.getMonth();
    if (meses < 0 || (meses === 0 && hoje.getDate() < nascimento.getDate())) idade--;
    return idade;
}

// Data (yyyy-mm-dd) usada para pré-preencher o formulário a partir da idade
export function dataAproximada(idade) {
    return `${new Date().getFullYear() - Number(idade)}-01-01`;
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
        dados.contato,
        dados.modalidade,
        Number(dados.peso)
    );
}

export function criarCompeticao(dados) {
    if (dados.tipo === "TrailRunning") {
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

// Carrega as instâncias nos controladores informados
export function hidratar(controladorAtleta, controladorCompeticao, dados) {
    if (controladorAtleta) {
        dados.atletas.forEach((a) => controladorAtleta.cadastrarAtleta(criarAtleta(a)));
    }
    if (controladorCompeticao) {
        dados.competicoes.forEach((c) => controladorCompeticao.cadastrarCompeticao(criarCompeticao(c)));
    }
}

// Reúne o carregamento + hidratação usados por todas as páginas (evita repetição)
export async function carregarSistema(caminhoJson) {
    const dados = await Armazenamento.carregar(caminhoJson);
    const atletaControl = new AtletaController();
    const compControl = new CompeticaoController();
    hidratar(atletaControl, compControl, dados);
    return { dados, atletaControl, compControl };
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
    const atletaControl = new AtletaController();
    const compControl = new CompeticaoController();
    try {
        const dados = await Armazenamento.carregar("data/dados.json");
        hidratar(atletaControl, compControl, dados);
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
