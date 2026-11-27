/* Página Edição de Competições — carrega a competição da URL, valida, atualiza e persiste */
// View com os métodos de ler/preencher o formulário de competição
import CompView from "../views/compView.js";
// Funções prontas: carregar, salvar, criar instância, validar e tratar erro
import { carregarSistema, Armazenamento, criarCompeticao, validarCompeticao, tratarErroCarregamento } from "../script.js";

// View única da página
const view = new CompView();

async function iniciar() {
  // Carrega e pega o controlador de competições
  const { compControl } = await carregarSistema("../data/dados.json");
  // Lê o "?id=" da URL e converte para número (id da competição a editar)
  const id = view.lerIdDaUrl();
  // Procura a competição com esse id (undefined se não existir)
  const comp = compControl.buscarCompeticao(id);

  // Se achou, preenche a tela e liga os eventos
  if (comp) {
    // Joga os dados da competição para dentro dos campos do formulário
    view.preencherCompeticao(comp);

    // Trocar o tipo mostra/esconde os campos da subclasse correspondente
    view.ligar("#tipo", "change", () => view.alternarCamposTipo());
    // Escuta o envio do formulário
    view.ligar("#formCompeticao", "submit", (e) => {
      // Impede o navegador de recarregar a página
      e.preventDefault();
      // Lê os campos (já com as mudanças feitas pelo usuário)
      const dados = view.lerCompeticao();
      // Valida; "" = ok, senão mensagem de erro
      const erro = validarCompeticao(dados);
      // Com erro, avisa e não salva
      if (erro) {
        alert(erro);
      } else {
        // Pega o id que estava no campo escondido do formulário
        const idAtual = view.lerIdCompeticao();
        // Substitui a competição antiga (mesmo id) pela nova montada com os dados lidos
        compControl.atualizarCompeticao(idAtual, criarCompeticao({ ...dados, id: idAtual }));
        // Grava a lista atualizada no localStorage
        Armazenamento.salvar({ competicoes: compControl.vetCompeticoes });
        // Volta para a listagem
        window.location.href = "comps.html";
      }
    });
  } else {
    // Não achou a competição: avisa e volta para a listagem
    alert("Competição não encontrada.");
    window.location.href = "comps.html";
  }
}

// Roda o "iniciar" e trata erro de carregamento
iniciar().catch(tratarErroCarregamento);
