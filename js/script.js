// Ponto de entrada: liga a View aos Controllers e cuida do JSON e do localStorage
import Atleta from "./models/atleta.js";
import Maratona from "./models/marat.js";
import TrailRunning from "./models/trail.js";
import AtletaController from "./controllers/atletaControl.js";
import CompeticaoController from "./controllers/compControl.js";
import View from "./views/view.js";

const view = new View();
const atletaController = new AtletaController();
const competicaoController = new CompeticaoController();

// Cria um Atleta a partir de um objeto literal
function montarAtleta(d) {
  return new Atleta(d.id, d.idade, d.cpf, d.nome, d.contato, d.modalidade, d.peso);
}

// Cria uma Maratona ou um TrailRunning conforme o tipo do objeto literal
function montarCompeticao(d) {
  if (d.tipo === "Maratona") {
    return new Maratona(d.id, d.horario, d.data, d.nome, d.local, d.distancia, d.altimetria, d.objetivo, d.fechamentoVias, d.pontosHidratacao);
  }
  return new TrailRunning(d.id, d.horario, d.data, d.nome, d.local, d.distancia, d.altimetria, d.checkPoint, d.grauDificuldade, d.climaEsperado);
}

// Verifica se já existe um registro com o id informado
function idRepetido(vetor, id) {
  return vetor.some((item) => item.id === id);
}

// Verifica se o cpf já pertence a outro atleta, ignorando o próprio id na edição
function cpfRepetido(cpf, id) {
  return atletaController.vetAtletas.some((atleta) => atleta.cpf === cpf && atleta.id !== id);
}

// Valida os dados do atleta e devolve a mensagem de erro, ou "" se estiver tudo certo
function validarAtleta(dados, id) {
  let erro = "";
  if (dados.nome.trim() === "") {
    erro = "O nome do atleta é obrigatório";
  } else if (/\d/.test(dados.nome)) {
    erro = "O nome do atleta não pode conter números";
  } else if (Number.isNaN(dados.idade) || dados.idade < 0) {
    erro = "A idade não pode ser negativa";
  } else if (dados.peso < 0) {
    erro = "O peso não pode ser negativo";
  } else if (dados.cpf.trim() === "") {
    erro = "O CPF é obrigatório";
  } else if (cpfRepetido(dados.cpf, id)) {
    erro = "Já existe um atleta com esse CPF";
  }
  return erro;
}

// Valida os dados da competição e devolve a mensagem de erro, ou "" se estiver tudo certo
function validarCompeticao(dados) {
  let erro = "";
  if (dados.nome.trim() === "") {
    erro = "O nome da competição é obrigatório";
  } else if (Number.isNaN(dados.distancia) || dados.distancia < 0) {
    erro = "A distância não pode ser negativa";
  } else if (dados.altimetria < 0) {
    erro = "A altimetria não pode ser negativa";
  } else if (dados.tipo === "Maratona" && dados.pontosHidratacao < 0) {
    erro = "Os pontos de hidratação não podem ser negativos";
  }
  return erro;
}

// Grava os dois arrays no localStorage
function salvar() {
  localStorage.setItem("atletas", JSON.stringify(atletaController.vetAtletas));
  const competicoes = competicaoController.vetCompeticoes.map((c) => ({ tipo: c.constructor.name, ...c.toJSON() }));
  localStorage.setItem("competicoes", JSON.stringify(competicoes));
}

// Lê o dados.json na primeira execução e o localStorage nas seguintes
async function carregar() {
  const salvo = localStorage.getItem("atletas");
  if (salvo) {
    JSON.parse(salvo).forEach((d) => atletaController.cadastrarAtleta(montarAtleta(d)));
    JSON.parse(localStorage.getItem("competicoes")).forEach((d) => competicaoController.cadastrarCompeticao(montarCompeticao(d)));
  } else {
    const resposta = await fetch("./data/dados.json");
    const dados = await resposta.json();
    dados.atletas.forEach((d) => atletaController.cadastrarAtleta(montarAtleta(d)));
    dados.competicoes.forEach((d) => competicaoController.cadastrarCompeticao(montarCompeticao(d)));
    salvar();
  }
  view.mostrar(`Carregados ${atletaController.vetAtletas.length} atletas e ${competicaoController.vetCompeticoes.length} competições`);
}

// Impede o formulário de recarregar a página
document.querySelector("#form").addEventListener("submit", (evento) => evento.preventDefault());

// Cada botão abaixo chama o método correspondente do controller e mostra o resultado

document.querySelector("#cadastrarAtleta").addEventListener("click", () => {
  const dados = view.lerAtleta();
  const id = Date.now();
  const erro = validarAtleta(dados, id);
  if (erro) {
    view.mostrar(erro);
  } else if (idRepetido(atletaController.vetAtletas, id)) {
    view.mostrar("Já existe um atleta com esse id");
  } else {
    atletaController.cadastrarAtleta(montarAtleta({ ...dados, id }));
    salvar();
    view.mostrarLista(atletaController.vetAtletas);
  }
});

document.querySelector("#buscarAtleta").addEventListener("click", () => {
  const atleta = atletaController.buscarAtleta(view.lerIdAtleta());
  view.mostrar(atleta ? atleta.toString() : "Atleta não encontrado");
});

document.querySelector("#atualizarAtleta").addEventListener("click", () => {
  const id = view.lerIdAtleta();
  const dados = view.lerAtleta();
  const erro = validarAtleta(dados, id);
  if (erro) {
    view.mostrar(erro);
  } else if (!atletaController.buscarAtleta(id)) {
    view.mostrar("Atleta não encontrado");
  } else {
    atletaController.atualizarAtleta(id, montarAtleta({ ...dados, id }));
    salvar();
    view.mostrarLista(atletaController.vetAtletas);
  }
});

document.querySelector("#removerAtleta").addEventListener("click", () => {
  atletaController.removerAtleta(view.lerIdAtleta());
  salvar();
  view.mostrarLista(atletaController.vetAtletas);
});

document.querySelector("#filtrarAtletas").addEventListener("click", () => {
  view.mostrarLista(atletaController.filtrarPorModalidade(view.lerModalidade()));
});

document.querySelector("#listarAtletas").addEventListener("click", () => {
  view.mostrar(atletaController.toString());
});

document.querySelector("#cadastrarCompeticao").addEventListener("click", () => {
  const dados = view.lerCompeticao();
  const id = Date.now();
  const erro = validarCompeticao(dados);
  if (erro) {
    view.mostrar(erro);
  } else if (idRepetido(competicaoController.vetCompeticoes, id)) {
    view.mostrar("Já existe uma competição com esse id");
  } else {
    competicaoController.cadastrarCompeticao(montarCompeticao({ ...dados, id }));
    salvar();
    view.mostrarLista(competicaoController.vetCompeticoes);
  }
});

document.querySelector("#buscarCompeticao").addEventListener("click", () => {
  const competicao = competicaoController.buscarCompeticao(view.lerIdCompeticao());
  view.mostrar(competicao ? competicao.toString() : "Competição não encontrada");
});

document.querySelector("#atualizarCompeticao").addEventListener("click", () => {
  const id = view.lerIdCompeticao();
  const dados = view.lerCompeticao();
  const erro = validarCompeticao(dados);
  if (erro) {
    view.mostrar(erro);
  } else if (!competicaoController.buscarCompeticao(id)) {
    view.mostrar("Competição não encontrada");
  } else {
    competicaoController.atualizarCompeticao(id, montarCompeticao({ ...dados, id }));
    salvar();
    view.mostrarLista(competicaoController.vetCompeticoes);
  }
});

document.querySelector("#removerCompeticao").addEventListener("click", () => {
  competicaoController.removerCompeticao(view.lerIdCompeticao());
  salvar();
  view.mostrarLista(competicaoController.vetCompeticoes);
});

document.querySelector("#filtrarCompeticoes").addEventListener("click", () => {
  view.mostrarLista(competicaoController.filtrarPorTipo(view.lerTipo()));
});

document.querySelector("#listarCompeticoes").addEventListener("click", () => {
  view.mostrar(competicaoController.toString());
});

carregar();
