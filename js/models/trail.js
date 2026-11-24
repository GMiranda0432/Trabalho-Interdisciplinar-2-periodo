import Competicao from "./comp.js";

class TrailRunning extends Competicao {
  #checkPoint;
  #grauDificuldade;
  #climaEsperado;

  constructor(id, horario, data, nome, local, distancia, altimetria, checkPoint, grauDificuldade, climaEsperado) {
    super(id, horario, data, nome, local, distancia, altimetria);
    this.#checkPoint = checkPoint;
    this.#grauDificuldade = grauDificuldade;
    this.#climaEsperado = climaEsperado;
  }

  get checkPoint() {
    return this.#checkPoint;
  }

  set checkPoint(valor) {
    this.#checkPoint = valor;
  }

  get grauDificuldade() {
    return this.#grauDificuldade;
  }

  set grauDificuldade(valor) {
    this.#grauDificuldade = valor;
  }

  get climaEsperado() {
    return this.#climaEsperado;
  }

  set climaEsperado(valor) {
    this.#climaEsperado = valor;
  }
  toJSON() {
    return {
      ...(typeof super.toJSON === "function" ? super.toJSON() : {}),
      checkPoint: this.#checkPoint,
      grauDificuldade: this.#grauDificuldade,
      climaEsperado: this.#climaEsperado,
    };
  }
  toString() {
    return `TrailRunning{${super.toString()}, checkPoint='${this.#checkPoint}', grauDificuldade='${this.#grauDificuldade}', climaEsperado='${this.#climaEsperado}'}`;
  }
}

export default TrailRunning;