/* Model Competicao — a SUPERCLASSE das corridas (Maratona e Trail Running herdam dela).
   Guarda só os dados que TODA competição tem. Os campos são privados (encapsulamento)
   e o acesso é só via getters/setters. Não mexe no HTML. */
class Competicao {
  // Campos privados comuns a qualquer competição
  #id;
  #horario;
  #data;
  #nome;
  #local;
  #distancia;
  #altimetria;

  // Recebe os dados comuns e guarda cada um no seu campo privado
  constructor(id, horario, data, nome, local, distancia, altimetria) {
    this.#id = id;
    this.#horario = horario;
    this.#data = data;
    this.#nome = nome;
    this.#local = local;
    this.#distancia = distancia;
    this.#altimetria = altimetria;
  }

  // Devolve o id
  get id() {
    return this.#id;
  }

  // Troca o id
  set id(valor) {
    this.#id = valor;
  }

  // Devolve o horário (ex.: "07:00" ou "07:00 - 12:00")
  get horario() {
    return this.#horario;
  }

  // Troca o horário
  set horario(valor) {
    this.#horario = valor;
  }

  // Devolve a data (formato dd/mm/aaaa)
  get data() {
    return this.#data;
  }

  // Troca a data
  set data(valor) {
    this.#data = valor;
  }

  // Devolve o nome da competição
  get nome() {
    return this.#nome;
  }

  // Troca o nome
  set nome(valor) {
    this.#nome = valor;
  }

  // Devolve o local
  get local() {
    return this.#local;
  }

  // Troca o local
  set local(valor) {
    this.#local = valor;
  }

  // Devolve a distância em km
  get distancia() {
    return this.#distancia;
  }

  // Troca a distância
  set distancia(valor) {
    this.#distancia = valor;
  }

  // Devolve a altimetria em metros
  get altimetria() {
    return this.#altimetria;
  }

  // Troca a altimetria
  set altimetria(valor) {
    this.#altimetria = valor;
  }

  // Modalidade correspondente à competição. A superclasse devolve o padrão
  // e as subclasses sobrescrevem (polimorfismo) sem espalhar comparações por nome de classe.
  get modalidade() {
    return "Maratona";
  }

  // Monta o objeto gravado no localStorage com os campos comuns
  toJSON() {
    return {
      id: this.#id,
      horario: this.#horario,
      data: this.#data,
      nome: this.#nome,
      local: this.#local,
      distancia: this.#distancia,
      altimetria: this.#altimetria,
    };
  }

  // Texto com os dados comuns; as subclasses reaproveitam esse texto (super.toString())
  toString() {
    return `Competicao{id=${this.#id}, horario='${this.#horario}', data='${this.#data}', nome='${this.#nome}', local='${this.#local}', distancia=${this.#distancia}, altimetria=${this.#altimetria}}`;
  }
}

export default Competicao;
