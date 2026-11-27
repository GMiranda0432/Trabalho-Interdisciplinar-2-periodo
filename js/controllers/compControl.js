/* Controller Competicao — guarda a lista de competições e faz o CRUD e o filtro por tipo.
   Camada de regra de negócio: NÃO mexe no HTML. */
class CompeticaoController {
  // Vetor privado que guarda as competições em memória
  #vetCompeticoes = [];

  // Devolve a lista de competições
  get vetCompeticoes() {
    return [...this.#vetCompeticoes];
  }

  // Adiciona uma competição ao fim da lista
  cadastrarCompeticao(comp) {
    this.#vetCompeticoes.push(comp);
  }

  // Recria a lista sem a competição do id informado
  removerCompeticao(id) {
    // filter mantém só as competições cujo id é diferente do que queremos tirar
    this.#vetCompeticoes = this.#vetCompeticoes.filter((comp) => comp.id !== id);
  }

  // Procura e retorna a competição do id informado
  buscarCompeticao(id) {
    // find devolve a primeira com esse id (ou undefined se não achar)
    return this.#vetCompeticoes.find((comp) => comp.id === id);
  }

  // Substitui a competição do id informado pela nova
  atualizarCompeticao(id, comp) {
    // Acha a posição (índice) da competição com esse id
    const edicao = this.#vetCompeticoes.findIndex((comp) => comp.id === id);
    // Se achou (-1 = não achou), troca o conteúdo daquela posição pela competição nova
    if (edicao !== -1) {
      this.#vetCompeticoes[edicao] = comp;
    }
  }

  // Retorna só as competições da subclasse informada (Maratona ou TrailRunning)
  filtrarPorTipo(tipo) {
    // constructor.name devolve o nome da classe ("Maratona"/"TrailRunning"); compara com o tipo pedido
    return this.#vetCompeticoes.filter((comp) => comp.constructor.name === tipo);
  }

  // Monta um texto com todas as competições cadastradas
  toString() {
    // map chama o toString() de cada competição e join junta tudo separado por vírgula
    return `CompeticaoController{competicoes=[${this.#vetCompeticoes.map((comp) => comp.toString()).join(", ")}]}`;
  }
}

export default CompeticaoController;
