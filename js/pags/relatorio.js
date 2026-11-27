/* Página Relatórios — participantes por competição e relatório geral (abas) */
import CompView from "../views/compView.js";
import { carregarSistema, contarInscritos } from "../script.js";

const view = new CompView();
let dados;
let atletaControl;
let compControl;

// Aba "Por competição": monta a lista de participantes da competição escolhida
function mostrarParticipantes() {
  const id = Number(view.lerValor("#relCompeticao"));
  const comp = compControl.buscarCompeticao(id);
  const participantes = dados.inscricoes
    .filter((i) => Number(i.competicaoId) === id)
    .map((i) => atletaControl.buscarAtleta(Number(i.atletaId)))
    .filter(Boolean);
  view.mostrarParticipantes(participantes);
  view.mostrarResumoCompeticao(comp, contarInscritos(dados.inscricoes, id));
}

// Aba "Relatório Geral": totais e tabela de competições com nº de inscritos
function mostrarGeral() {
  const itens = compControl.vetCompeticoes.map((c) => ({
    id: c.id,
    nome: c.nome,
    modalidade: view.rotuloTipo(c),
    inscritos: contarInscritos(dados.inscricoes, c.id),
  }));
  view.mostrarRelatorioGeral(itens, {
    competicoes: compControl.vetCompeticoes.length,
    atletas: atletaControl.vetAtletas.length,
    inscricoes: dados.inscricoes.length,
  });
}

// Alterna entre as duas abas
function trocarAba(competicao) {
  view.alternarClasse("#abaCompeticao", "ativa", competicao);
  view.alternarClasse("#abaGeral", "ativa", !competicao);
  if (competicao) {
    view.exibir("#painelCompeticao");
    view.ocultar("#painelGeral");
  } else {
    view.ocultar("#painelCompeticao");
    view.exibir("#painelGeral");
    mostrarGeral();
  }
}

async function iniciar() {
  const sistema = await carregarSistema("../data/dados.json");
  dados = sistema.dados;
  atletaControl = sistema.atletaControl;
  compControl = sistema.compControl;

  view.preencherSelectDeObjetos("#relCompeticao", compControl.vetCompeticoes, "Selecione a competição");
  view.ligar("#relCompeticao", "change", mostrarParticipantes);
  view.ligar("#abaCompeticao", "click", () => trocarAba(true));
  view.ligar("#abaGeral", "click", () => trocarAba(false));
  mostrarParticipantes();
}

iniciar();
