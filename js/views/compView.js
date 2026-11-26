class View {
  // Lê o id da competição usado nas operações de buscar, atualizar e remover
  lerIdCompeticao() {
    return Number(document.querySelector("#compId").value);
  }
  // Lê os campos da competição e devolve um objeto literal
  lerCompeticao() {
    return {
      tipo: this.lerTipo(),
      horario: document.querySelector("#compHorario").value,
      data: document.querySelector("#compData").value,
      nome: document.querySelector("#compNome").value,
      local: document.querySelector("#compLocal").value,
      distancia: Number(document.querySelector("#compDistancia").value),
      altimetria: Number(document.querySelector("#compAltimetria").value),
      objetivo: document.querySelector("#compObjetivo").value,
      fechamentoVias: document.querySelector("#compFechamentoVias").value,
      pontosHidratacao: Number(document.querySelector("#compPontosHidratacao").value),
      checkPoint: document.querySelector("#compCheckPoint").value,
      grauDificuldade: document.querySelector("#compGrauDificuldade").value,
      climaEsperado: document.querySelector("#compClimaEsperado").value,
    };
  }
  // Lê o tipo usado no filtro de competições
  lerTipo() {
    return document.querySelector("#tipo").value;
  }
  // Mostra um texto na área de saída e no console
  mostrar(texto) {
    document.querySelector("#saida").textContent = texto;
    console.log(texto);
  }
  // Mostra uma lista de objetos usando o toString() de cada um
  mostrarLista(lista) {
    this.mostrar(lista.map((item) => item.toString()).join("\n"));
  }
}
export default View;
