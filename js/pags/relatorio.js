/* Página Relatórios — participantes por competição e relatório geral (abas) */
// View de competição (reaproveitada aqui só para escrever tabelas e resumos)
import CompView from "../views/compView.js";
// Funções prontas: carregar dados, contar inscritos de uma competição e tratar erro
import { carregarSistema, contarInscritos, tratarErroCarregamento } from "../script.js";

// View única da página
const view = new CompView();
// Vão guardar os dados e os controladores depois do carregamento
let dados;
let atletaControl;
let compControl;

// Aba "Por competição": monta a lista de participantes da competição escolhida
function mostrarParticipantes() {
  // Pega o id da competição escolhida no select (número)
  const id = Number(view.lerValor("#relCompeticao"));
  // Busca a competição (serve para mostrar a modalidade dela no resumo)
  const comp = compControl.buscarCompeticao(id);
  // Das inscrições, mantém as dessa competição, troca cada atletaId pelo objeto atleta
  // (buscarAtleta) e joga fora eventuais nulos com o filter(Boolean)
  const participantes = dados.inscricoes
    .filter((i) => Number(i.competicaoId) === id)
    .map((i) => atletaControl.buscarAtleta(Number(i.atletaId)))
    .filter(Boolean);
  // Desenha a tabela de participantes
  view.mostrarParticipantes(participantes);
  // Mostra no resumo a modalidade escolhida e quantos inscritos há na competição
  view.mostrarResumoCompeticao(comp, contarInscritos(dados.inscricoes, id));
}

// Aba "Relatório Geral": totais e tabela de competições com nº de inscritos
function mostrarGeral() {
  // Monta um item por competição com: id, nome, modalidade e quantos inscritos tem
  const itens = compControl.vetCompeticoes.map((c) => ({
    id: c.id,
    nome: c.nome,
    modalidade: c.modalidade,
    inscritos: contarInscritos(dados.inscricoes, c.id),
  }));
  // Desenha os totais e a tabela geral passando os itens e os números totais
  view.mostrarRelatorioGeral(itens, {
    competicoes: compControl.vetCompeticoes.length,
    atletas: atletaControl.vetAtletas.length,
    inscricoes: dados.inscricoes.length,
  });
}

// Alterna entre as duas abas
function trocarAba(competicao) {
  // Marca a aba clicada como ativa e apaga a outra
  view.alternarClasse("#abaCompeticao", "ativa", competicao);
  view.alternarClasse("#abaGeral", "ativa", !competicao);
  // Mostra o painel escolhido e esconde o outro
  if (competicao) {
    view.exibir("#painelCompeticao");
    view.ocultar("#painelGeral");
  } else {
    view.ocultar("#painelCompeticao");
    view.exibir("#painelGeral");
    // Ao abrir o painel geral, recalcula os totais (sempre atualizados)
    mostrarGeral();
  }
}

async function iniciar() {
  // Carrega os dados e separa o que precisamos (dados, controladores)
  const sistema = await carregarSistema("../data/dados.json");
  dados = sistema.dados;
  atletaControl = sistema.atletaControl;
  compControl = sistema.compControl;

  // Preenche o select de competições com todas (primeira opção é o texto neutro)
  view.preencherSelectDeObjetos("#relCompeticao", compControl.vetCompeticoes, "Selecione a competição");
  // Trocar a competição no select atualiza a tabela de participantes
  view.ligar("#relCompeticao", "change", mostrarParticipantes);
  // Clicar nas abas chama trocarAba (true = aba competição, false = aba geral)
  view.ligar("#abaCompeticao", "click", () => trocarAba(true));
  view.ligar("#abaGeral", "click", () => trocarAba(false));
  // Mostra a aba de participantes já ao abrir a página
  mostrarParticipantes();
}

// Roda o "iniciar" e trata erro de carregamento
iniciar().catch(tratarErroCarregamento);
