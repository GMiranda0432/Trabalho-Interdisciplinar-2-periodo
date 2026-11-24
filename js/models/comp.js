class Competicao {
  #id;
  #horario;
  #data;
  #nome;
  #local;
  #distancia;
  #altimetria;

  constructor(id, horario, data, nome, local, distancia, altimetria) {
    this.#id = id;
    this.#horario = horario;
    this.#data = data;
    this.#nome = nome;
    this.#local = local;
    this.#distancia = distancia;
    this.#altimetria = altimetria;
  }

  get id() {
    return this.#id;
  }

  set id(valor) {
    this.#id = valor;
  }

  get horario() {
    return this.#horario;
  }

  set horario(valor) {
    this.#horario = valor;
  }

  get data() {
    return this.#data;
  }

  set data(valor) {
    this.#data = valor;
  }

  get nome() {
    return this.#nome;
  }

  set nome(valor) {
    this.#nome = valor;
  }

  get local() {
    return this.#local;
  }

  set local(valor) {
    this.#local = valor;
  }

  get distancia() {
    return this.#distancia;
  }

  set distancia(valor) {
    this.#distancia = valor;
  }

  get altimetria() {
    return this.#altimetria;
  }

  set altimetria(valor) {
    this.#altimetria = valor;
  }
 toJSON() {
    return {
      ...(typeof super.toJSON === "function" ? super.toJSON() : {}),
      id: this.#id,
      horario: this.#horario,
      data: this.#data,
      nome: this.#nome,
      local: this.#local,
      distancia: this.#distancia,
      altimetria: this.#altimetria,
    };
  }
  toString() {
    return `Competicao{id=${this.#id}, horario='${this.#horario}', data='${this.#data}', nome='${this.#nome}', local='${this.#local}', distancia=${this.#distancia}, altimetria=${this.#altimetria}}`;
  }
}

export default Competicao;