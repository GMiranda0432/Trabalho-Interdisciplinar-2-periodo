/* Model TrailRunning — SUBCLASSE de Competicao (herança).
   Tem os dados comuns da competição + os campos exclusivos do trail.
   Também sobrescreve a modalidade (polimorfismo). */
import Competicao from "./comp.js";

class TrailRunning extends Competicao {
  // Campos exclusivos do trail (privados)
  #checkPoint;
  #grauDificuldade;
  #climaEsperado;

  // Os 7 primeiros dados vão para a superclasse; os 3 últimos ficam aqui
  constructor(id, horario, data, nome, local, distancia, altimetria, checkPoint, grauDificuldade, climaEsperado) {
    // Guarda os dados comuns chamando o construtor de Competicao
    super(id, horario, data, nome, local, distancia, altimetria);
    this.#checkPoint = checkPoint;
    this.#grauDificuldade = grauDificuldade;
    this.#climaEsperado = climaEsperado;
  }

  // Devolve o ponto de controle (checkpoint)
  get checkPoint() {
    return this.#checkPoint;
  }

  // Troca o checkpoint
  set checkPoint(valor) {
    this.#checkPoint = valor;
  }

  // Devolve o grau de dificuldade
  get grauDificuldade() {
    return this.#grauDificuldade;
  }

  // Troca o grau de dificuldade
  set grauDificuldade(valor) {
    this.#grauDificuldade = valor;
  }

  // Devolve o clima esperado
  get climaEsperado() {
    return this.#climaEsperado;
  }

  // Troca o clima esperado
  set climaEsperado(valor) {
    this.#climaEsperado = valor;
  }

  // Sobrescreve a modalidade da superclasse (polimorfismo):
  // quem lê "comp.modalidade" recebe "Trail Running" sem precisar checar o tipo
  get modalidade() {
    return "Trail Running";
  }

  // Junta os campos comuns (super.toJSON()) com os exclusivos do trail
  toJSON() {
    return {
      ...super.toJSON(),
      tipo: "TrailRunning",
      checkPoint: this.#checkPoint,
      grauDificuldade: this.#grauDificuldade,
      climaEsperado: this.#climaEsperado,
    };
  }

  // Reaproveita o texto da superclasse e acrescenta os campos próprios
  toString() {
    return `TrailRunning{${super.toString()}, checkPoint='${this.#checkPoint}', grauDificuldade='${this.#grauDificuldade}', climaEsperado='${this.#climaEsperado}'}`;
  }
}

export default TrailRunning;
