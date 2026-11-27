/* Página Atletas — liga a AtletaView ao AtletaController (listagem + modal de exclusão) */
// Traz a "moldura" da tela de atletas (quem desenha a tabela e o modal no HTML)
import AtletaView from "../views/atletaView.js";
// Traz as funções prontas: carregarSistema (lê JSON/localStorage), Armazenamento (salvar) e tratamento de erro
import { carregarSistema, Armazenamento, tratarErroCarregamento } from "../script.js";

// Cria a view uma vez só; todo o acesso ao HTML desta página passa por ela
const view = new AtletaView();
// Variável que vai receber o controlador de atletas quando os dados forem carregados
let atletaControl;
// Lista de inscrições (pares atleta/competição); começa vazia e é preenchida ao carregar
let inscricoes = [];
// Guarda o id do atleta que o usuário clicou para excluir; começa nulo porque ainda ninguém escolheu
let idExclusao = null;

// Aplica busca por ID + filtro de modalidade e atualiza a tabela
function listar() {
  // Pega o texto digitado no campo de busca (por id)
  const busca = view.lerBusca();
  // Pega a modalidade escolhida no filtro ("" = todas)
  const modalidade = view.lerModalidade();
  // Se escolheu modalidade, pega só os atletas dela; senão pega a lista inteira
  let lista = modalidade ? atletaControl.filtrarPorModalidade(modalidade) : atletaControl.vetAtletas;
  // Se tem algo digitado na busca, mantém só os atletas cujo id contém o texto buscado
  if (busca) lista = lista.filter((a) => String(a.id).includes(busca));
  // Manda a lista filtrada para a view montar as linhas da tabela
  view.mostrarTabela(lista);
  // Escreve "Exibindo X de Y" (filtrados de total)
  view.mostrarResumo(lista.length, atletaControl.vetAtletas.length);
}

// Remove o atleta escolhido (e suas inscrições), persiste e re-renderiza
function excluir() {
  // Pede ao controlador para tirar o atleta do vetor pelo id guardado
  atletaControl.removerAtleta(idExclusao);
  // Recria a lista de inscrições sem aquelas que pertenciam ao atleta excluído
  inscricoes = inscricoes.filter((i) => Number(i.atletaId) !== idExclusao);
  // Grava no localStorage a lista de atletas atualizada e as inscrições sem o atleta
  Armazenamento.salvar({ atletas: atletaControl.vetAtletas, inscricoes });
  // Fecha o modal de confirmação
  view.fecharModal("#modalAtleta");
  // Redesenha a tabela já sem o atleta
  listar();
}

async function iniciar() {
  // Carrega os dados (JSON no primeiro acesso, localStorage depois) e espera terminar
  const sistema = await carregarSistema("../data/dados.json");
  // Guarda o controlador de atletas que veio no carregamento
  atletaControl = sistema.atletaControl;
  // Guarda as inscrições; se não vier nada no arquivo, usa lista vazia para não quebrar
  inscricoes = sistema.dados.inscricoes ?? [];
  // Desenha a tabela pela primeira vez
  listar();

  // Quando o usuário digita no campo de busca, roda "listar" de novo
  view.ligar("#buscaId", "input", listar);
  // Quando troca a modalidade no filtro, roda "listar" de novo
  view.ligar("#filtroModalidade", "change", listar);
  // Clique em qualquer botão com classe "acao-excluir" dentro da lista: guarda o id
  // do botão e abre o modal pedindo confirmação com o nome do atleta
  view.delegar("#listaAtletas", "click", ".acao-excluir", (botao) => {
    idExclusao = Number(view.dado(botao, "id"));
    view.confirmarExclusao(view.dado(botao, "nome"));
  });
  // Botão "cancelar" do modal: só fecha o modal, sem excluir nada
  view.ligar("#cancelarExclusao", "click", () => view.fecharModal("#modalAtleta"));
  // Botão "confirmar" do modal: chama a função excluir
  view.ligar("#confirmarExclusao", "click", excluir);
}

// Roda o "iniciar"; se der erro ao carregar, mostra a mensagem pro usuário
iniciar().catch(tratarErroCarregamento);
