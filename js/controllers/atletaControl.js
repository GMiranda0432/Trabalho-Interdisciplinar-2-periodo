/* Controller Atleta — guarda a lista de atletas e faz as operações de CRUD (criar, ler,
   atualizar, remover) e o filtro. É a camada de regra de negócio: NÃO mexe no HTML. */
class AtletaController {
  // Vetor privado que guarda os atletas em memória
  #vetAtletas = [];

  // Devolve a lista de atletas
  get vetAtletas() {
    return [...this.#vetAtletas];
  }

  // Adiciona um atleta ao fim da lista
  cadastrarAtleta(atleta) {
    this.#vetAtletas.push(atleta);
  }

  // Recria a lista sem o atleta do id informado
  removerAtleta(id) {
    // filter mantém só os atletas cujo id é diferente do que queremos tirar
    this.#vetAtletas = this.#vetAtletas.filter((atleta) => atleta.id !== id);
  }

  // Procura e retorna o atleta do id informado
  buscarAtleta(id) {
    // find devolve o primeiro atleta com esse id (ou undefined se não achar)
    return this.#vetAtletas.find((atleta) => atleta.id === id);
  }

  // Substitui o atleta do id informado pelo novo objeto
  atualizarAtleta(id, atleta) {
    // Acha a posição (índice) do atleta com esse id na lista
    const edicao = this.#vetAtletas.findIndex((atleta) => atleta.id === id);
    // Se achou (-1 = não achou), troca o conteúdo daquela posição pelo novo atleta
    if (edicao !== -1) {
      this.#vetAtletas[edicao] = atleta;
    }
  }

  // Retorna só os atletas da modalidade informada
  filtrarPorModalidade(modalidade) {
    // filter mantém só os atletas cuja modalidade é igual à pedida
    return this.#vetAtletas.filter((atleta) => atleta.modalidade === modalidade);
  }

  // Monta um texto com todos os atletas cadastrados
  toString() {
    // map chama o toString() de cada atleta e join junta tudo separado por vírgula
    return `AtletaController{atletas=[${this.#vetAtletas.map((atleta) => atleta.toString()).join(", ")}]}`;
  }
}

export default AtletaController;
