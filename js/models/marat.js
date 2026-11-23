import Competicao from "./comp.js";

class Maratona extends Competicao {
  #objetivo;
  #fechamentoVias;
  #pontosHidratacao;

  constructor(id, horario, data, nome, local, distancia, altimetria, objetivo, fechamentoVias, pontosHidratacao) {
    super(id, horario, data, nome, local, distancia, altimetria);
    this.#objetivo = objetivo;
    this.#fechamentoVias = fechamentoVias;
    this.#pontosHidratacao = pontosHidratacao;
  }

  get objetivo() {
    return this.#objetivo;
  }

  set objetivo(valor) {
    this.#objetivo = valor;
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
    this.#pontosHidratacao = valor;
  }

  toString() {
    return `Maratona{${super.toString()}, objetivo='${this.#objetivo}', fechamentoVias='${this.#fechamentoVias}', pontosHidratacao=${this.#pontosHidratacao}}`;
  }
}

export default Maratona;