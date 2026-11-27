// Traz a View base (métodos de DOM) e as conversões de data usadas no formulário
import { View, paraDataBr, paraDataIso } from "../script.js";

/* View da Competição — herda a base compartilhada (script.js) e só cuida do DOM */
class CompView extends View {
  // Lê o id da competição (input oculto usado na edição)
  lerIdCompeticao() {
    // Pega o valor do campo "#compId" e converte para número
    return Number(this.lerValor("#compId"));
  }

  // Lê o tipo de corrida (Maratona / TrailRunning)
  lerTipo() {
    // Valor escolhido no <select> de tipo
    return this.lerValor("#tipo");
  }

  // Filtros da listagem
  lerBusca() {
    // Texto digitado na busca (por id)
    return this.lerValor("#buscaId");
  }

  lerTipoFiltro() {
    // Tipo escolhido no filtro ("" = todos)
    return this.lerValor("#filtroTipo");
  }

  // Lê os campos do formulário e devolve um objeto no formato do Model
  lerCompeticao() {
    // Pega o horário inicial e o final (o final é opcional)
    const inicio = this.lerValor("#compHorario");
    const fim = this.lerValor("#compHorarioFim");
    // Guarda se a altimetria foi realmente informada (o campo é opcional)
    const altimetriaInformada = this.lerValor("#compAltimetria") !== "";
    return {
      tipo: this.lerTipo(),
      // Horário inicial e final separados (usados na validação) e o texto exibido
      horarioInicio: inicio,
      horarioFim: fim,
      // Se tem o final, exibe "início - fim"; senão mostra só o início
      horario: fim ? `${inicio} - ${fim}` : inicio,
      // O input date vem como aaaa-mm-dd; converte para dd/mm/aaaa
      data: paraDataBr(this.lerValor("#compData")),
      nome: this.lerValor("#compNome"),
      local: this.lerValor("#compLocal"),
      // Campos numéricos são convertidos de texto para número
      distancia: Number(this.lerValor("#compDistancia")),
      altimetria: Number(this.lerValor("#compAltimetria")),
      altimetriaInformada: altimetriaInformada,
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
    // Se o tipo for "TrailRunning", "maratona" fica false; senão fica true
    const tipo = this.lerTipo();
    const maratona = tipo !== "TrailRunning";
    // Mostra os campos de maratona e esconde os de trail (ou o contrário)
    this.alternarClasse(".campos-maratona", "oculto", !maratona);
    this.alternarClasse(".campos-trail", "oculto", maratona);
  }

  // Preenche o formulário de edição a partir de uma competição
  preencherCompeticao(comp) {
    // Separa o horário guardado ("07:00 - 12:00") em início e fim
    const [inicio, fim] = String(comp.horario ?? "").split(" - ");
    this.definirValor("#compId", comp.id);
    // constructor.name devolve "Maratona" ou "TrailRunning" para marcar o tipo certo
    this.definirValor("#tipo", comp.constructor.name);
    this.definirValor("#compNome", comp.nome);
    // Converte a data exibida (dd/mm/aaaa) para o formato do input date (aaaa-mm-dd)
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
    // Depois de preencher, ajusta quais campos aparecem conforme o tipo
    this.alternarCamposTipo();
  }

  // Monta as linhas da tabela de competições
  mostrarTabela(competicoes) {
    // preencherTabela cria as <tr> (ou a linha de aviso quando a lista está vazia)
    this.preencherTabela("#listaCompeticoes", competicoes, (c) => `
      <tr>
        <td>${this.escapar(c.id)}</td>
        <td>${this.escapar(c.nome)}</td>
        <td>${this.escapar(c.local)}</td>
        <td>${this.escapar(c.data)}</td>
        <td>${this.escapar(c.modalidade)}</td>
        <td>
          <div class="col-acoes">
            <a class="acao acao-editar" href="editComp.html?id=${encodeURIComponent(c.id)}">Editar</a>
            <button class="acao acao-excluir" type="button" data-id="${this.escapar(c.id)}" data-nome="${this.escapar(c.nome)}">Excluir</button>
          </div>
        </td>
      </tr>`, 6, "Nenhuma competição encontrada.");
  }

  mostrarResumo(exibidos, total) {
    // Escreve o texto "Exibindo X de Y" no resumo
    this.escrever("#resumoCompeticoes", `Exibindo ${exibidos} de ${total} competições`);
  }

  confirmarExclusao(nome) {
    // Escreve a pergunta no modal e o abre
    this.escrever("#mensagemExclusao", `Deseja realmente excluir ${nome}?`);
    this.abrirModal("#modalCompeticao");
  }

  // ---- Relatórios ----
  mostrarParticipantes(atletas) {
    // Monta a tabela de atletas inscritos na competição escolhida
    this.preencherTabela("#tabelaParticipantes", atletas, (a) => `
      <tr>
        <td>${this.escapar(a.id)}</td>
        <td>${this.escapar(a.nome)}</td>
        <td>${this.escapar(a.idade)}</td>
        <td>${this.escapar(a.modalidade)}</td>
      </tr>`, 4, "Nenhum atleta inscrito nesta competição.");
  }

  mostrarResumoCompeticao(comp, inscritos) {
    // Mostra os dados da competição (ou "-" se nenhuma) e a quantidade de inscritos
    this.escrever("#relModalidade", comp ? comp.modalidade : "-");
    this.escrever("#relInscritos", inscritos);
    this.escrever("#relData", comp ? comp.data : "-");
    this.escrever("#relDistancia", comp ? `${comp.distancia} km` : "-");
    this.escrever("#relLocal", comp ? comp.local : "-");
  }

  mostrarRelatorioGeral(itens, totais) {
    // Preenche os três números do topo do relatório
    this.escrever("#geralCompeticoes", totais.competicoes);
    this.escrever("#geralAtletas", totais.atletas);
    this.escrever("#geralInscricoes", totais.inscricoes);
    // E monta a tabela geral: uma linha por competição com sua quantidade de inscritos
    this.preencherTabela("#tabelaGeral", itens, (i) => `
      <tr>
        <td>${this.escapar(i.id)}</td>
        <td>${this.escapar(i.nome)}</td>
        <td>${this.escapar(i.modalidade)}</td>
        <td>${this.escapar(i.inscritos)}</td>
      </tr>`, 4, "Nenhuma competição cadastrada.");
  }
}

export default CompView;
