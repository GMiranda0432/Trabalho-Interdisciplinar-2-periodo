/* Model Maratona — SUBCLASSE de Competicao (herança).
   Tem os dados comuns da competição (via "super") + os campos exclusivos da maratona. */
import Competicao from "./comp.js";

class Maratona extends Competicao {
  // Campos exclusivos da maratona (privados)
  #objetivo;
  #fechamentoVias;
  #pontosHidratacao;

  // Recebe tudo; os 7 primeiros dados vão para a superclasse via super(...)
  // e os 3 últimos ficam só na maratona
  constructor(id, horario, data, nome, local, distancia, altimetria, objetivo, fechamentoVias, pontosHidratacao) {
    // super(...) chama o construtor de Competicao para guardar os dados comuns
    super(id, horario, data, nome, local, distancia, altimetria);
    this.#objetivo = objetivo;
    this.#fechamentoVias = fechamentoVias;
    this.#pontosHidratacao = pontosHidratacao;
  }

  // Devolve o objetivo da prova
  get objetivo() {
    return this.#objetivo;
  }

  // Troca o objetivo
  set objetivo(valor) {
    this.#objetivo = valor;
  }

  // Devolve o horário de fechamento das vias
  get fechamentoVias() {
    return this.#fechamentoVias;
  }

  // Troca o fechamento das vias
  set fechamentoVias(valor) {
    this.#fechamentoVias = valor;
  }

  // Devolve a quantidade de pontos de hidratação
  get pontosHidratacao() {
    return this.#pontosHidratacao;
  }

  // Troca os pontos de hidratação
  set pontosHidratacao(valor) {
    this.#pontosHidratacao = valor;
  }

  // Junta os campos comuns (super.toJSON()) com os exclusivos da maratona
  toJSON() {
    return {
      ...super.toJSON(),
      tipo: "Maratona",
      objetivo: this.#objetivo,
      fechamentoVias: this.#fechamentoVias,
      pontosHidratacao: this.#pontosHidratacao,
    };
  }

  // Reaproveita o texto da superclasse (super.toString()) e acrescenta os campos próprios
  toString() {
    return `Maratona{${super.toString()}, objetivo='${this.#objetivo}', fechamentoVias='${this.#fechamentoVias}', pontosHidratacao=${this.#pontosHidratacao}}`;
  }
}

export default Maratona;
