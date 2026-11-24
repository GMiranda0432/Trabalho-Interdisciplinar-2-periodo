class Atleta {
  #id;
  #idade;
  #cpf;
  #nome;
  #contato;
  #modalidade;
  #peso;

  constructor(id, idade, cpf, nome, contato, modalidade, peso) {
    this.#id = id;
    this.#idade = idade;
    this.#cpf = cpf;
    this.#nome = nome;
    this.#contato = contato;
    this.#modalidade = modalidade;
    this.#peso = peso;
  }

  get id() {
    return this.#id;
  }

  set id(valor) {
    this.#id = valor;
  }

  get idade() {
    return this.#idade;
  }

  set idade(valor) {
    this.#idade = valor;
  }

  get cpf() {
    return this.#cpf;
  }

  set cpf(valor) {
    this.#cpf = valor;
  }

  get nome() {
    return this.#nome;
  }

  set nome(valor) {
    this.#nome = valor;
  }

  get contato() {
    return this.#contato;
  }

  set contato(valor) {
    this.#contato = valor;
  }

  get modalidade() {
    return this.#modalidade;
  }

  set modalidade(valor) {
    this.#modalidade = valor;
  }

  get peso() {
    return this.#peso;
  }

  set peso(valor) {
    this.#peso = valor;
  }
 toJSON() {
    return {
      ...(typeof super.toJSON === "function" ? super.toJSON() : {}),
      id: this.#id,
      idade: this.#idade,
      cpf: this.#cpf,
      nome: this.#nome,
      contato: this.#contato,
      modalidade: this.#modalidade,
      peso: this.#peso,
    };
  }
  toString() {
    return `Atleta{id=${this.#id}, idade=${this.#idade}, cpf='${this.#cpf}', nome='${this.#nome}', contato='${this.#contato}', modalidade='${this.#modalidade}', peso=${this.#peso}}`;
  }
}

export default Atleta;