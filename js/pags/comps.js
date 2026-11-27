/* Página Competições — liga a CompView ao CompeticaoController (listagem + modal de exclusão) */
// Moldura da tela de competições (desenha tabela e modal)
import CompView from "../views/compView.js";
// Funções prontas: carregar dados, salvar e tratar erro
import { carregarSistema, Armazenamento, tratarErroCarregamento } from "../script.js";

// View única desta página
const view = new CompView();
// Vai receber o controlador de competições depois de carregar os dados
let compControl;
// Lista de inscrições (competição/atleta); vazia até carregar
let inscricoes = [];
// Id da competição que o usuário clicou para excluir; nulo até escolher
let idExclusao = null;

// Aplica busca por ID + filtro de tipo e atualiza a tabela
function listar() {
  // Texto digitado no campo de busca (por id)
  const busca = view.lerBusca();
  // Tipo escolhido no filtro ("" = todos)
  const tipo = view.lerTipoFiltro();
  // Se escolheu tipo, pega só daquele tipo (Maratona/TrailRunning); senão pega tudo
  let lista = tipo ? compControl.filtrarPorTipo(tipo) : compControl.vetCompeticoes;
  // Se tem busca, mantém só as competições cujo id contém o texto digitado
  if (busca) lista = lista.filter((c) => String(c.id).includes(busca));
  // Manda a lista para a view montar as linhas
  view.mostrarTabela(lista);
  // Escreve "Exibindo X de Y"
  view.mostrarResumo(lista.length, compControl.vetCompeticoes.length);
}

// Remove a competição escolhida (e suas inscrições), persiste e re-renderiza
function excluir() {
  // Tira a competição do vetor pelo id guardado
  compControl.removerCompeticao(idExclusao);
  // Recria as inscrições sem as que eram da competição excluída
  inscricoes = inscricoes.filter((i) => Number(i.competicaoId) !== idExclusao);
  // Grava no localStorage a lista de competições e as inscrições atualizadas
  Armazenamento.salvar({ competicoes: compControl.vetCompeticoes, inscricoes });
  // Fecha o modal
  view.fecharModal("#modalCompeticao");
  // Redesenha a tabela
  listar();
}

async function iniciar() {
  // Carrega os dados (JSON na primeira vez, localStorage depois)
  const sistema = await carregarSistema("../data/dados.json");
  // Guarda o controlador de competições
  compControl = sistema.compControl;
  // Guarda as inscrições; se não vier nada, usa lista vazia
  inscricoes = sistema.dados.inscricoes ?? [];
  // Desenha a tabela pela primeira vez
  listar();

  // Digitar na busca roda "listar" de novo
  view.ligar("#buscaId", "input", listar);
  // Trocar o tipo no filtro roda "listar" de novo
  view.ligar("#filtroTipo", "change", listar);
  // Clique em botão "acao-excluir": guarda o id do botão e abre o modal com o nome
  view.delegar("#listaCompeticoes", "click", ".acao-excluir", (botao) => {
    idExclusao = Number(view.dado(botao, "id"));
    view.confirmarExclusao(view.dado(botao, "nome"));
  });
  // Cancelar: só fecha o modal
  view.ligar("#cancelarExclusao", "click", () => view.fecharModal("#modalCompeticao"));
  // Confirmar: chama excluir
  view.ligar("#confirmarExclusao", "click", excluir);
}

// Roda o "iniciar" e, se falhar o carregamento, mostra o erro pro usuário
iniciar().catch(tratarErroCarregamento);
