/* Página Novo Atleta — lê o formulário, valida, cadastra e persiste o atleta */
// View com os métodos que leem/escrevem os campos do formulário de atleta
import AtletaView from "../views/atletaView.js";
// Funções prontas: carregar dados, salvar, gerar o próximo id, criar a instância e validar
import { carregarSistema, Armazenamento, proximoId, criarAtleta, validarAtleta, tratarErroCarregamento } from "../script.js";

// Uma view só para a página inteira
const view = new AtletaView();

async function iniciar() {
  // Carrega o sistema e pega só o controlador de atletas que veio nele
  const { atletaControl } = await carregarSistema("../data/dados.json");
  // Liga a máscara de CPF para o campo já ir formatando conforme o usuário digita
  view.aplicarMascaraCpf();

  // Fica escutando o "enviar" do formulário (o e é o evento de submit)
  view.ligar("#formAtleta", "submit", (e) => {
    // Impede o comportamento padrão do navegador de recarregar a página ao enviar
    e.preventDefault();
    // Lê todos os campos do formulário e devolve um objeto com os dados do atleta
    const dados = view.lerAtleta();
    // Valida os dados; devolve "" se estiver tudo certo ou a mensagem de erro
    const erro = validarAtleta(dados);
    // Se veio mensagem de erro, avisa o usuário e não cadastra
    if (erro) {
      alert(erro);
    } else {
      // Descobre o próximo id livre (pega o maior id já existente e soma 1) e monta o atleta
      const atleta = criarAtleta({ ...dados, id: proximoId(atletaControl.vetAtletas) });
      // Adiciona o atleta novo na lista do controlador
      atletaControl.cadastrarAtleta(atleta);
      // Grava a lista de atletas atualizada no localStorage
      Armazenamento.salvar({ atletas: atletaControl.vetAtletas });
      // Sai da tela de cadastro e volta para a listagem de atletas
      window.location.href = "atletas.html";
    }
  });
}

// Roda o "iniciar"; se der erro ao carregar, mostra a mensagem pro usuário
iniciar().catch(tratarErroCarregamento);
