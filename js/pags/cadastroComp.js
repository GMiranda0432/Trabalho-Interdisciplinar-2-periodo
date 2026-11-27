/* Página Nova Competição — lê o formulário, valida, cria e persiste a competição */
// View com os métodos de ler formulário e alternar campos conforme o tipo
import CompView from "../views/compView.js";
// Funções prontas: carregar, salvar, próximo id, criar instância, validar e tratar erro
import { carregarSistema, Armazenamento, proximoId, criarCompeticao, validarCompeticao, tratarErroCarregamento } from "../script.js";

// View única da página
const view = new CompView();

async function iniciar() {
  // Carrega e pega só o controlador de competições
  const { compControl } = await carregarSistema("../data/dados.json");
  // Mostra os campos certos de cara (Maratona por padrão, pois nenhum tipo foi escolhido)
  view.alternarCamposTipo();

  // Quando troca o tipo, mostra/esconde os campos da subclasse correspondente
  view.ligar("#tipo", "change", () => view.alternarCamposTipo());
  // Escuta o envio do formulário
  view.ligar("#formCompeticao", "submit", (e) => {
    // Impede o navegador de recarregar a página
    e.preventDefault();
    // Lê os campos do formulário e devolve um objeto de competição
    const dados = view.lerCompeticao();
    // Valida; "" = tudo certo, senão a mensagem de erro
    const erro = validarCompeticao(dados);
    // Com erro, avisa e não cadastra
    if (erro) {
      alert(erro);
    } else {
      // Pega o próximo id livre (maior id + 1) e cria a competição (Maratona ou TrailRunning)
      const comp = criarCompeticao({ ...dados, id: proximoId(compControl.vetCompeticoes) });
      // Adiciona no controlador
      compControl.cadastrarCompeticao(comp);
      // Salva a lista atualizada no localStorage
      Armazenamento.salvar({ competicoes: compControl.vetCompeticoes });
      // Volta para a listagem de competições
      window.location.href = "comps.html";
    }
  });
}

// Roda o "iniciar" e trata erro de carregamento
iniciar().catch(tratarErroCarregamento);
