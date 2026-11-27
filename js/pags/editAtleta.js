/* Página Editar Atleta — carrega o atleta da URL, valida, atualiza e persiste */
// View com os métodos de ler/preencher o formulário de atleta
import AtletaView from "../views/atletaView.js";
// Funções prontas: carregar dados, salvar, criar instância, validar e tratar erro
import { carregarSistema, Armazenamento, criarAtleta, validarAtleta, tratarErroCarregamento } from "../script.js";

// Instância única da view desta página
const view = new AtletaView();

async function iniciar() {
  // Carrega o sistema e pega o controlador de atletas
  const { atletaControl } = await carregarSistema("../data/dados.json");
  // Lê o "?id=" da URL e converte para número (id do atleta a editar)
  const id = view.lerIdDaUrl();
  // Procura no controlador o atleta com esse id (fica undefined se não existir)
  const atleta = atletaControl.buscarAtleta(id);

  // Se achou o atleta, preenche a tela e liga os eventos
  if (atleta) {
    // Joga os dados do atleta para dentro dos campos do formulário
    view.preencherAtleta(atleta);
    // Liga a máscara de CPF no campo conforme digita
    view.aplicarMascaraCpf();

    // Escuta o envio do formulário
    view.ligar("#formAtleta", "submit", (e) => {
      // Evita o navegador recarregar a página
      e.preventDefault();
      // Lê os campos (já com as alterações feitas pelo usuário)
      const dados = view.lerAtleta();
      // Valida; devolve "" se ok ou a mensagem de erro
      const erro = validarAtleta(dados);
      // Com erro, avisa e não salva
      if (erro) {
        alert(erro);
      } else {
        // Pega o id que estava no campo escondido do formulário
        const idAtual = view.lerIdAtleta();
        // Substitui o atleta antigo (mesmo id) pela versão nova montada com os dados lidos
        atletaControl.atualizarAtleta(idAtual, criarAtleta({ ...dados, id: idAtual }));
        // Grava a lista atualizada no localStorage
        Armazenamento.salvar({ atletas: atletaControl.vetAtletas });
        // Volta para a listagem
        window.location.href = "atletas.html";
      }
    });
  } else {
    // Não achou o atleta: avisa e volta para a listagem
    alert("Atleta não encontrado.");
    window.location.href = "atletas.html";
  }
}

// Roda o "iniciar"; se der erro ao carregar, mostra a mensagem pro usuário
iniciar().catch(tratarErroCarregamento);
