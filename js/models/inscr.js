class Inscricao {
  #atleta;
  #competicao;
  #numCamisaAtleta;
  #dataInscricao;
  #status;
  #valor;

  constructor(atleta, competicao, numCamisaAtleta, dataInscricao, status, valor) {
    this.#atleta = atleta;
    this.#competicao = competicao;
    this.#numCamisaAtleta = numCamisaAtleta;
    this.#dataInscricao = dataInscricao;
    this.#status = status;
    this.#valor = valor;
  }

  inscrever(atleta, competicao) {
    this.#atleta = atleta;
    this.#competicao = competicao;
    this.#status = "Confirmada";
  }

  get atleta() {
    return this.#atleta;
  }

  set atleta(valor) {
    this.#atleta = valor;
  }

  get competicao() {
    return this.#competicao;
  }

  set competicao(valor) {
    this.#competicao = valor;
  }

  get numCamisaAtleta() {
    return this.#numCamisaAtleta;
  }

  set numCamisaAtleta(valor) {
    this.#numCamisaAtleta = valor;
  }

  get dataInscricao() {
    return this.#dataInscricao;
  }

  set dataInscricao(valor) {
    this.#dataInscricao = valor;
  }

  get status() {
    return this.#status;
  }

  set status(valor) {
    this.#status = valor;
  }

  get valor() {
    return this.#valor;
  }

  set valor(valor) {
    this.#valor = valor;
  }

  toString() {
    return `Inscricao{atleta=${this.#atleta}, competicao=${this.#competicao}, numCamisaAtleta=${this.#numCamisaAtleta}, dataInscricao='${this.#dataInscricao}', status='${this.#status}', valor=${this.#valor}}`;
  }
}

export default Inscricao;