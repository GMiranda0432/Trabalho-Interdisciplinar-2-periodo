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
  atletaController.cadastrarAtleta(montarAtleta({ ...view.lerAtleta(), id: Date.now() }));
  salvar();
  view.mostrarLista(atletaController.vetAtletas);
});

document.querySelector("#buscarAtleta").addEventListener("click", () => {
  const atleta = atletaController.buscarAtleta(view.lerIdAtleta());
  view.mostrar(atleta ? atleta.toString() : "Atleta não encontrado");
});

document.querySelector("#atualizarAtleta").addEventListener("click", () => {
  const id = view.lerIdAtleta();
  atletaController.atualizarAtleta(id, montarAtleta({ ...view.lerAtleta(), id }));
  salvar();
  view.mostrarLista(atletaController.vetAtletas);
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
  competicaoController.cadastrarCompeticao(montarCompeticao({ ...view.lerCompeticao(), id: Date.now() }));
  salvar();
  view.mostrarLista(competicaoController.vetCompeticoes);
});

document.querySelector("#buscarCompeticao").addEventListener("click", () => {
  const competicao = competicaoController.buscarCompeticao(view.lerIdCompeticao());
  view.mostrar(competicao ? competicao.toString() : "Competição não encontrada");
});

document.querySelector("#atualizarCompeticao").addEventListener("click", () => {
  const id = view.lerIdCompeticao();
  competicaoController.atualizarCompeticao(id, montarCompeticao({ ...view.lerCompeticao(), id }));
  salvar();
  view.mostrarLista(competicaoController.vetCompeticoes);
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
