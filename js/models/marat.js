import Competicao from "./comp.js";

class Maratona extends Competicao {
  #objetivo;
  #fechamentoVias;
  #pontosHidratacao;

  constructor(id, horario, data, nome, local, distancia, altimetria, objetivo, fechamentoVias, pontosHidratacao
  ) {
    super(id, horario, data, nome, local, distancia, altimetria);
    this.objetivo = objetivo;
    this.fechamentoVias = fechamentoVias;
    this.pontosHidratacao = pontosHidratacao;
  }

  get objetivo() {
    return this.#objetivo;
  }

  set objetivo(valor) {
    if (typeof valor !== "string" || !valor.trim()) {
      throw new Error("Objetivo deve ser um texto não vazio.");
    }
    this.#objetivo = valor.trim();
  }

  get fechamentoVias() {
    return this.#fechamentoVias;
  }

  set fechamentoVias(valor) {
    this.#fechamentoVias = valor;
  }

  get pontosHidratacao() {
    return this.#pontosHidratacao;
  }

  set pontosHidratacao(valor) {
    const numero = Number(valor);
    if (!Number.isInteger(numero) || numero < 0) {
      throw new Error("Pontos de hidratação deve ser um número inteiro maior ou igual a zero.");
    }
    this.#pontosHidratacao = numero;
  }

  toJSON() {
    return {
      ...(typeof super.toJSON === "function" ? super.toJSON() : {}),
      objetivo: this.#objetivo,
      fechamentoVias: this.#fechamentoVias,
      pontosHidratacao: this.#pontosHidratacao,
    };
  }

  toString() {
    return `Maratona{${super.toString()}, objetivo='${this.#objetivo}', fechamentoVias='${this.#fechamentoVias}', pontosHidratacao=${this.#pontosHidratacao}}`;
  }
}

export default Maratona;