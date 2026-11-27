/* Página Atletas — liga a AtletaView ao AtletaController (listagem + modal de exclusão) */
import AtletaView from "../views/atletaView.js";
import { carregarSistema, Armazenamento } from "../script.js";

const view = new AtletaView();
let atletaControl;
let inscricoes = [];
let idExclusao = null;

// Aplica busca por ID + filtro de modalidade e atualiza a tabela
function listar() {
  const busca = view.lerBusca();
  const modalidade = view.lerModalidade();
  let lista = modalidade ? atletaControl.filtrarPorModalidade(modalidade) : atletaControl.vetAtletas;
  if (busca) lista = lista.filter((a) => String(a.id).includes(busca));
  view.mostrarTabela(lista);
  view.mostrarResumo(lista.length, atletaControl.vetAtletas.length);
}

// Remove o atleta escolhido (e suas inscrições), persiste e re-renderiza
function excluir() {
  atletaControl.removerAtleta(idExclusao);
  inscricoes = inscricoes.filter((i) => Number(i.atletaId) !== idExclusao);
  Armazenamento.salvar({ atletas: atletaControl.vetAtletas, inscricoes });
  view.fecharModal("#modalAtleta");
  listar();
}

async function iniciar() {
  const sistema = await carregarSistema("../data/dados.json");
  atletaControl = sistema.atletaControl;
  inscricoes = sistema.dados.inscricoes ?? [];
  listar();

  view.ligar("#buscaId", "input", listar);
  view.ligar("#filtroModalidade", "change", listar);
  view.delegar("#listaAtletas", "click", ".acao-excluir", (botao) => {
    idExclusao = Number(view.dado(botao, "id"));
    view.confirmarExclusao(view.dado(botao, "nome"));
  });
  view.ligar("#cancelarExclusao", "click", () => view.fecharModal("#modalAtleta"));
  view.ligar("#confirmarExclusao", "click", excluir);
}

iniciar();
