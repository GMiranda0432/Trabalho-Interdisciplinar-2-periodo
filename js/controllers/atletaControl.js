class AtletaController {
  #vetAtletas = [];

  // Devolve a lista de atletas
  get vetAtletas() {
    return this.#vetAtletas;
  }

  // Adiciona um atleta ao fim da lista
  cadastrarAtleta(atleta) {
    this.#vetAtletas.push(atleta);
  }

  // Recria a lista sem o atleta do id informado
  removerAtleta(id) {
    this.#vetAtletas = this.#vetAtletas.filter((atleta) => atleta.id !== id);
  }

  // Procura e retorna o atleta do id informado
  buscarAtleta(id) {
    return this.#vetAtletas.find((atleta) => atleta.id === id);
  }

  // Substitui o atleta do id informado pelo novo objeto
  atualizarAtleta(id, atleta) {
    const edicao = this.#vetAtletas.findIndex((atleta) => atleta.id === id);
    if (edicao !== -1) {
      this.#vetAtletas[edicao] = atleta;
    }
  }

  // Retorna só os atletas da modalidade informada
  filtrarPorModalidade(modalidade) {
    return this.#vetAtletas.filter((atleta) => atleta.modalidade === modalidade);
  }

  // Monta um texto com todos os atletas cadastrados
  toString() {
    return `AtletaController{atletas=[${this.#vetAtletas.map((atleta) => atleta.toString()).join(", ")}]}`;
  }
}

export default AtletaController;
