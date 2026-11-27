/* Model Atleta — representa um atleta.
   Usa encapsulamento: os campos são privados (#) e só podem ser lidos/alterados
   pelos getters e setters. Este arquivo é só dados/regras: NÃO mexe no HTML. */
class Atleta {
  // Campos privados: o "#" faz o JavaScript impedir acesso direto de fora da classe
  #id;
  #idade;
  #cpf;
  #nome;
  #email;
  #modalidade;
  #peso;

  // Recebe todos os dados de uma vez e guarda cada um no seu campo privado
  constructor(id, idade, cpf, nome, email, modalidade, peso) {
    this.#id = id;
    this.#idade = idade;
    this.#cpf = cpf;
    this.#nome = nome;
    this.#email = email;
    this.#modalidade = modalidade;
    this.#peso = peso;
  }

  // Devolve o id guardado
  get id() {
    return this.#id;
  }

  // Troca o id pelo valor recebido
  set id(valor) {
    this.#id = valor;
  }

  // Devolve a idade guardada
  get idade() {
    return this.#idade;
  }

  // Troca a idade
  set idade(valor) {
    this.#idade = valor;
  }

  // Devolve o CPF guardado
  get cpf() {
    return this.#cpf;
  }

  // Troca o CPF
  set cpf(valor) {
    this.#cpf = valor;
  }

  // Devolve o nome guardado
  get nome() {
    return this.#nome;
  }

  // Troca o nome
  set nome(valor) {
    this.#nome = valor;
  }

  // Devolve o e-mail guardado
  get email() {
    return this.#email;
  }

  // Troca o e-mail
  set email(valor) {
    this.#email = valor;
  }

  // Devolve a modalidade (Maratona ou Trail Running)
  get modalidade() {
    return this.#modalidade;
  }

  // Troca a modalidade
  set modalidade(valor) {
    this.#modalidade = valor;
  }

  // Devolve o peso guardado
  get peso() {
    return this.#peso;
  }

  // Troca o peso
  set peso(valor) {
    this.#peso = valor;
  }

  // Monta o objeto que será gravado no localStorage (JSON não guarda campos privados,
  // por isso copiamos cada um para chaves com o mesmo nome)
  toJSON() {
    return {
      id: this.#id,
      idade: this.#idade,
      cpf: this.#cpf,
      nome: this.#nome,
      email: this.#email,
      modalidade: this.#modalidade,
      peso: this.#peso,
    };
  }

  // Texto para exibir o atleta (usado em logs/testes)
  toString() {
    return `Atleta{id=${this.#id}, idade=${this.#idade}, cpf='${this.#cpf}', nome='${this.#nome}', email='${this.#email}', modalidade='${this.#modalidade}', peso=${this.#peso}}`;
  }
}

export default Atleta;
