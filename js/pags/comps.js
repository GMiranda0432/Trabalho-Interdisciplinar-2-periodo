/* Página Competições — liga a CompView ao CompeticaoController (listagem + modal de exclusão) */
import CompView from "../views/compView.js";
import { carregarSistema, Armazenamento } from "../script.js";

const view = new CompView();
let compControl;
let inscricoes = [];
let idExclusao = null;

// Aplica busca por ID + filtro de tipo e atualiza a tabela
function listar() {
  const busca = view.lerBusca();
  const tipo = view.lerTipoFiltro();
  let lista = tipo ? compControl.filtrarPorTipo(tipo) : compControl.vetCompeticoes;
  if (busca) lista = lista.filter((c) => String(c.id).includes(busca));
  view.mostrarTabela(lista);
  view.mostrarResumo(lista.length, compControl.vetCompeticoes.length);
}

// Remove a competição escolhida (e suas inscrições), persiste e re-renderiza
function excluir() {
  compControl.removerCompeticao(idExclusao);
  inscricoes = inscricoes.filter((i) => Number(i.competicaoId) !== idExclusao);
  Armazenamento.salvar({ competicoes: compControl.vetCompeticoes, inscricoes });
  view.fecharModal("#modalCompeticao");
  listar();
}

async function iniciar() {
  const sistema = await carregarSistema("../data/dados.json");
  compControl = sistema.compControl;
  inscricoes = sistema.dados.inscricoes ?? [];
  listar();

  view.ligar("#buscaId", "input", listar);
  view.ligar("#filtroTipo", "change", listar);
  view.delegar("#listaCompeticoes", "click", ".acao-excluir", (botao) => {
    idExclusao = Number(view.dado(botao, "id"));
    view.confirmarExclusao(view.dado(botao, "nome"));
  });
  view.ligar("#cancelarExclusao", "click", () => view.fecharModal("#modalCompeticao"));
  view.ligar("#confirmarExclusao", "click", excluir);
}

iniciar();
