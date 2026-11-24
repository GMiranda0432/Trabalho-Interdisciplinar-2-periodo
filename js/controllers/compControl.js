class CompeticaoController {
  #vetCompeticoes = [];

  // Devolve a lista de competições
  get vetCompeticoes() {
    return this.#vetCompeticoes;
  }

  // Adiciona uma competição ao fim da lista
  cadastrarCompeticao(comp) {
    this.#vetCompeticoes.push(comp);
  }

  // Recria a lista sem a competição do id informado
  removerCompeticao(id) {
    this.#vetCompeticoes = this.#vetCompeticoes.filter((comp) => comp.id !== id);
  }

  // Procura e retorna a competição do id informado
  buscarCompeticao(id) {
    return this.#vetCompeticoes.find((comp) => comp.id === id);
  }

  // Substitui a competição do id informado pela nova
  atualizarCompeticao(id, comp) {
    const edicao = this.#vetCompeticoes.findIndex((comp) => comp.id === id);
    if (edicao !== -1) {
      this.#vetCompeticoes[edicao] = comp;
    }
  }

  // Retorna só as competições da subclasse informada (Maratona ou TrailRunning)
  filtrarPorTipo(tipo) {
    return this.#vetCompeticoes.filter((comp) => comp.constructor.name === tipo);
  }

  // Monta um texto com todas as competições cadastradas
  toString() {
    return `CompeticaoController{competicoes=[${this.#vetCompeticoes.map((comp) => comp.toString()).join(", ")}]}`;
  }
}

export default CompeticaoController;
