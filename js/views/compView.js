import { View, paraDataBr, paraDataIso } from "../script.js";

/* View da Competição — herda a base compartilhada (script.js) e só cuida do DOM */
class CompView extends View {
  // Lê o id da competição (input oculto usado na edição)
  lerIdCompeticao() {
    return Number(this.lerValor("#compId"));
  }

  // Lê o tipo de corrida (Maratona / TrailRunning)
  lerTipo() {
    return this.lerValor("#tipo");
  }

  // Filtros da listagem
  lerBusca() {
    return this.lerValor("#buscaId");
  }

  lerTipoFiltro() {
    return this.lerValor("#filtroTipo");
  }

  // Nome amigável da subclasse (TrailRunning -> Trail Running)
  rotuloTipo(comp) {
    if (!comp) return "";
    return comp.constructor.name === "TrailRunning" ? "Trail Running" : "Maratona";
  }

  // Lê os campos do formulário e devolve um objeto no formato do Model
  lerCompeticao() {
    const inicio = this.lerValor("#compHorario");
    const fim = this.lerValor("#compHorarioFim");
    return {
      tipo: this.lerTipo(),
      horario: fim ? `${inicio} - ${fim}` : inicio,
      data: paraDataBr(this.lerValor("#compData")),
      nome: this.lerValor("#compNome"),
      local: this.lerValor("#compLocal"),
      distancia: Number(this.lerValor("#compDistancia")),
      altimetria: Number(this.lerValor("#compAltimetria")),
      objetivo: this.lerValor("#compObjetivo"),
      fechamentoVias: this.lerValor("#compFechamentoVias"),
      pontosHidratacao: Number(this.lerValor("#compPontosHidratacao")),
      checkPoint: this.lerValor("#compCheckPoint"),
      grauDificuldade: this.lerValor("#compGrauDificuldade"),
      climaEsperado: this.lerValor("#compClimaEsperado"),
    };
  }

  // Mostra os campos da subclasse conforme o tipo escolhido.
  // Sem tipo selecionado o padrão é Maratona (mesma regra do Model).
  alternarCamposTipo() {
    const tipo = this.lerTipo();
    const maratona = tipo !== "TrailRunning";
    this.alternarClasse(".campos-maratona", "oculto", !maratona);
    this.alternarClasse(".campos-trail", "oculto", maratona);
  }

  // Preenche o formulário de edição a partir de uma competição
  preencherCompeticao(comp) {
    const [inicio, fim] = String(comp.horario ?? "").split(" - ");
    this.definirValor("#compId", comp.id);
    this.definirValor("#tipo", comp.constructor.name);
    this.definirValor("#compNome", comp.nome);
    this.definirValor("#compData", paraDataIso(comp.data));
    this.definirValor("#compLocal", comp.local);
    this.definirValor("#compHorario", inicio ?? "");
    this.definirValor("#compHorarioFim", fim ?? "");
    this.definirValor("#compDistancia", comp.distancia);
    this.definirValor("#compAltimetria", comp.altimetria);
    this.definirValor("#compObjetivo", comp.objetivo ?? "");
    this.definirValor("#compFechamentoVias", comp.fechamentoVias ?? "");
    this.definirValor("#compPontosHidratacao", comp.pontosHidratacao ?? "");
    this.definirValor("#compCheckPoint", comp.checkPoint ?? "");
    this.definirValor("#compGrauDificuldade", comp.grauDificuldade ?? "");
    this.definirValor("#compClimaEsperado", comp.climaEsperado ?? "");
    this.alternarCamposTipo();
  }

  // Monta as linhas da tabela de competições
  mostrarTabela(competicoes) {
    const corpo = this.elemento("#listaCompeticoes");
    if (!corpo) return;
    if (!competicoes.length) {
      corpo.innerHTML = `<tr><td class="tabela-vazia" colspan="6">Nenhuma competição encontrada.</td></tr>`;
      return;
    }
    corpo.innerHTML = competicoes.map((c) => `
      <tr>
        <td>${this.escapar(c.id)}</td>
        <td>${this.escapar(c.nome)}</td>
        <td>${this.escapar(c.local)}</td>
        <td>${this.escapar(c.data)}</td>
        <td>${this.escapar(this.rotuloTipo(c))}</td>
        <td>
          <div class="col-acoes">
            <a class="acao acao-editar" href="editComp.html?id=${encodeURIComponent(c.id)}">Editar</a>
            <button class="acao acao-excluir" type="button" data-id="${this.escapar(c.id)}" data-nome="${this.escapar(c.nome)}">Excluir</button>
          </div>
        </td>
      </tr>`).join("");
  }

  mostrarResumo(exibidos, total) {
    this.escrever("#resumoCompeticoes", `Exibindo ${exibidos} de ${total} competições`);
  }

  confirmarExclusao(nome) {
    this.escrever("#mensagemExclusao", `Deseja realmente excluir ${nome}?`);
    this.abrirModal("#modalCompeticao");
  }

  // ---- Relatórios ----
  mostrarParticipantes(atletas) {
    const corpo = this.elemento("#tabelaParticipantes");
    if (!corpo) return;
    if (!atletas.length) {
      corpo.innerHTML = `<tr><td class="tabela-vazia" colspan="4">Nenhum atleta inscrito nesta competição.</td></tr>`;
      return;
    }
    corpo.innerHTML = atletas.map((a) => `
      <tr>
        <td>${this.escapar(a.id)}</td>
        <td>${this.escapar(a.nome)}</td>
        <td>${this.escapar(a.idade)}</td>
        <td>${this.escapar(a.modalidade)}</td>
      </tr>`).join("");
  }

  mostrarResumoCompeticao(comp, inscritos) {
    this.escrever("#relModalidade", this.rotuloTipo(comp) || "-");
    this.escrever("#relInscritos", inscritos);
  }

  mostrarRelatorioGeral(itens, totais) {
    this.escrever("#geralCompeticoes", totais.competicoes);
    this.escrever("#geralAtletas", totais.atletas);
    this.escrever("#geralInscricoes", totais.inscricoes);
    const corpo = this.elemento("#tabelaGeral");
    if (!corpo) return;
    corpo.innerHTML = itens.map((i) => `
      <tr>
        <td>${this.escapar(i.id)}</td>
        <td>${this.escapar(i.nome)}</td>
        <td>${this.escapar(i.modalidade)}</td>
        <td>${this.escapar(i.inscritos)}</td>
      </tr>`).join("");
  }
}

export default CompView;
