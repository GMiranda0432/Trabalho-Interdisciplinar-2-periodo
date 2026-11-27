import { View, calcularIdade, dataAproximada } from "../script.js";

/* View do Atleta — herda a base compartilhada (script.js) e só cuida do DOM */
class AtletaView extends View {
  // Lê o id do atleta (input oculto usado na edição)
  lerIdAtleta() {
    return Number(this.lerValor("#atletaId"));
  }

  // Lê os campos do formulário e devolve um objeto no formato do Model
  lerAtleta() {
    return {
      idade: calcularIdade(this.lerValor("#atletaNascimento")),
      cpf: this.lerValor("#atletaCpf"),
      nome: this.lerValor("#atletaNome"),
      contato: this.lerValor("#atletaContato"),
      modalidade: this.lerValor("#atletaModalidade"),
      peso: Number(this.lerValor("#atletaPeso")),
    };
  }

  // Filtros da listagem
  lerBusca() {
    return this.lerValor("#buscaId");
  }

  lerModalidade() {
    return this.lerValor("#filtroModalidade");
  }

  // Preenche o formulário de edição a partir de um atleta
  preencherAtleta(atleta) {
    this.definirValor("#atletaId", atleta.id);
    this.definirValor("#atletaNome", atleta.nome);
    this.definirValor("#atletaCpf", atleta.cpf);
    this.definirValor("#atletaNascimento", dataAproximada(atleta.idade));
    this.definirValor("#atletaContato", atleta.contato);
    this.definirValor("#atletaModalidade", atleta.modalidade);
    this.definirValor("#atletaPeso", atleta.peso);
  }

  // Monta as linhas da tabela de atletas
  mostrarTabela(atletas) {
    const corpo = this.elemento("#listaAtletas");
    if (!corpo) return;
    if (!atletas.length) {
      corpo.innerHTML = `<tr><td class="tabela-vazia" colspan="6">Nenhum atleta encontrado.</td></tr>`;
      return;
    }
    corpo.innerHTML = atletas.map((a) => `
      <tr>
        <td>${this.escapar(a.id)}</td>
        <td>${this.escapar(a.nome)}</td>
        <td>${this.escapar(a.cpf)}</td>
        <td>${this.escapar(a.idade)}</td>
        <td>${this.escapar(a.modalidade)}</td>
        <td>
          <div class="col-acoes">
            <a class="acao acao-editar" href="editAtleta.html?id=${encodeURIComponent(a.id)}">Editar</a>
            <button class="acao acao-excluir" type="button" data-id="${this.escapar(a.id)}" data-nome="${this.escapar(a.nome)}">Excluir</button>
          </div>
        </td>
      </tr>`).join("");
  }

  mostrarResumo(exibidos, total) {
    this.escrever("#resumoAtletas", `Exibindo ${exibidos} de ${total} atletas`);
  }

  // Abre o modal de exclusão com o nome do atleta
  confirmarExclusao(nome) {
    this.escrever("#mensagemExclusao", `Deseja realmente excluir ${nome}?`);
    this.abrirModal("#modalAtleta");
  }
}

export default AtletaView;
