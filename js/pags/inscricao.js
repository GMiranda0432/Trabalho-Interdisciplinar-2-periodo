/* Página Nova Inscrição — associa um ou vários atletas a uma competição.
   Fluxo da tela:
   1) A seção de atletas começa DESATIVADA; o usuário precisa escolher uma competição.
   2) Ao escolher a competição, mostramos apenas os atletas da modalidade dela.
   3) O usuário marca vários atletas (checkbox) e clica em "Realizar Inscrição" (em lote).
   A relação é gravada em localStorage na chave "inscricoes" como { competicaoId, atletaId }. */

// View com os métodos de montar o select, desenhar a lista de atletas e ler os marcados
import InscricaoView from "../views/inscricaoView.js";
// Funções prontas: carregar dados, salvar, criar uma inscrição e tratar erro
import { carregarSistema, Armazenamento, criarInscricao, tratarErroCarregamento } from "../script.js";

// View única da página
const view = new InscricaoView();

// Guardamos o sistema carregado e a lista de inscrições já existentes
let atletaControl;   // controlador de atletas
let compControl;     // controlador de competições
let inscricoes = []; // pares { competicaoId, atletaId } já existentes

// Estado inicial (e estado "sem competição escolhida"): seção desativada,
// mensagem de instrução e botão de inscrição bloqueado
function mostrarEstadoVazio() {
  // Adiciona a classe "desativada" na seção de atletas (deixa ela apagada/sem clique)
  view.ativarSecao(false);
  // Coloca uma linha de aviso no lugar da lista de atletas
  view.mostrarMensagemAtletas("Selecione uma competição para ver os atletas disponíveis.");
  // Deixa o botão de inscrever desabilitado
  view.ativarBotao(false);
}

// Mostra a lista de atletas da modalidade da competição escolhida
function mostrarAtletasDaCompeticao() {
  // Lê o id escolhido no select ("" = nenhuma competição escolhida)
  const competicaoId = Number(view.lerValor("#competicao"));
  // Busca a competição escolhida (fica indefinida se o id não existir)
  const competicao = compControl.buscarCompeticao(competicaoId);

  if (!competicao) {
    // Nenhuma competição escolhida: volta ao estado inicial
    mostrarEstadoVazio();
  } else {
    // A própria competição informa sua modalidade (polimorfismo)
    const modalidade = competicao.modalidade;

    // Filtra apenas os atletas que têm a modalidade correspondente à competição
    const atletasFiltrados = atletaControl.filtrarPorModalidade(modalidade);

    // Ativa a seção e desenha a lista no mesmo formato da página atletas.html
    view.ativarSecao(true);
    view.mostrarAtletas(atletasFiltrados);
    view.ativarBotao(true);
  }
}

// Executa a inscrição em lote dos atletas marcados
function realizarInscricao(evento) {
  // Impede o navegador de recarregar a página ao enviar o formulário
  evento.preventDefault();

  // Id da competição escolhida e lista de ids dos atletas com a checkbox marcada
  const competicaoId = Number(view.lerValor("#competicao"));
  const atletasSelecionados = view.lerAtletasSelecionados();

  // Sem competição escolhida, avisa e para aqui
  if (!competicaoId) {
    alert("Selecione uma competição.");
  } else if (atletasSelecionados.length === 0) {
    // Nenhum atleta marcado, avisa e para aqui
    alert("Selecione pelo menos um atleta para inscrever.");
  } else {
    // Conta quantas inscrições são novas e quantas já existiam (duplicadas)
    let novas = 0;
    let repetidas = 0;

    // Passa por cada atleta marcado
    atletasSelecionados.forEach((atletaId) => {
      // Verifica se este atleta já está inscrito nesta mesma competição
      const duplicada = inscricoes.some(
        (i) => Number(i.competicaoId) === competicaoId && Number(i.atletaId) === atletaId
      );
      if (duplicada) {
        // Já existia: só aumenta o contador de repetidas
        repetidas++;
      } else {
        // Empilha a nova inscrição (instância de Inscricao) na lista e conta como nova
        inscricoes.push(criarInscricao(competicaoId, atletaId));
        novas++;
      }
    });

    // Salva apenas as inscrições, preservando atletas e competições
    Armazenamento.salvar({ inscricoes: inscricoes });

    // Monta a mensagem de retorno conforme o resultado
    let mensagem = `${novas} atleta(s) inscrito(s) com sucesso.`;
    // Se houve duplicadas, completa a mensagem com esse aviso
    if (repetidas > 0) {
      mensagem += ` ${repetidas} já estava(m) inscrito(s) e foi(ram) ignorado(s).`;
    }
    alert(mensagem);

    // Ao final, leva o usuário para o relatório
    window.location.href = "relatorio.html";
  }
}

async function iniciar() {
  // Carrega os dados (JSON no primeiro acesso / localStorage depois)
  const sistema = await carregarSistema("../data/dados.json");
  // Guarda os controladores e as inscrições que vieram no carregamento
  atletaControl = sistema.atletaControl;
  compControl = sistema.compControl;
  inscricoes = sistema.dados.inscricoes ?? [];

  // Preenche o select de competições com todas as cadastradas
  view.preencherCompeticoes(compControl.vetCompeticoes);

  // Estado inicial: seção de atletas desativada e botão bloqueado
  mostrarEstadoVazio();

  // Ao trocar a competição, atualiza a lista de atletas
  view.ligar("#competicao", "change", mostrarAtletasDaCompeticao);
  // Ao enviar o formulário, faz a inscrição em lote
  view.ligar("#formInscricao", "submit", realizarInscricao);
}

// Roda o "iniciar" e trata erro de carregamento
iniciar().catch(tratarErroCarregamento);
