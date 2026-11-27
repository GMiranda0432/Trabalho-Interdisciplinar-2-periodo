// Traz a View base (métodos genéricos de DOM) e funções utilitárias de data/CPF
import { View, calcularIdade, dataAproximada, mascararCpf } from "../script.js";

/* View do Atleta — herda a base compartilhada (script.js) e só cuida do DOM.
   Ou seja: é a única camada que lê e escreve no HTML desta tela. */
class AtletaView extends View {
  // Lê o id do atleta (input oculto usado na edição)
  lerIdAtleta() {
    // Pega o valor do campo "#atletaId" e converte para número
    return Number(this.lerValor("#atletaId"));
  }

  // Lê os campos do formulário e devolve um objeto no formato do Model
  lerAtleta() {
    // Guarda a data de nascimento (usada na validação) e já calcula a idade
    const nascimento = this.lerValor("#atletaNascimento");
    return {
      nascimento: nascimento,
      // calcularIdade transforma a data de nascimento na idade em anos
      idade: calcularIdade(nascimento),
      // Aplica a máscara para garantir o formato 000.000.000-00
      cpf: mascararCpf(this.lerValor("#atletaCpf")),
      // Pega o texto digitado e remove espaços das pontas (feito dentro de lerValor)
      nome: this.lerValor("#atletaNome"),
      email: this.lerValor("#atletaEmail"),
      modalidade: this.lerValor("#atletaModalidade"),
      // Converte o texto do campo para número
      peso: Number(this.lerValor("#atletaPeso")),
    };
  }

  // Aplica a máscara de CPF enquanto o usuário digita
  aplicarMascaraCpf() {
    // Fica escutando cada tecla ("input") no campo de CPF
    this.ligar("#atletaCpf", "input", () => {
      // Pega o campo e reescreve o valor já com a máscara
      const campo = this.elemento("#atletaCpf");
      if (campo) campo.value = mascararCpf(campo.value);
    });
  }

  // Filtros da listagem
  lerBusca() {
    // Texto do campo de busca (por id)
    return this.lerValor("#buscaId");
  }

  lerModalidade() {
    // Modalidade escolhida no filtro ("" = todas)
    return this.lerValor("#filtroModalidade");
  }

  // Preenche o formulário de edição a partir de um atleta
  preencherAtleta(atleta) {
    // Joga cada dado do atleta para o campo correspondente do formulário
    this.definirValor("#atletaId", atleta.id);
    this.definirValor("#atletaNome", atleta.nome);
    this.definirValor("#atletaCpf", atleta.cpf);
    // Converte a idade de volta para uma data (início do ano) para o input date
    this.definirValor("#atletaNascimento", dataAproximada(atleta.idade));
    this.definirValor("#atletaEmail", atleta.email);
    this.definirValor("#atletaModalidade", atleta.modalidade);
    this.definirValor("#atletaPeso", atleta.peso);
  }

  // Monta as linhas da tabela de atletas
  mostrarTabela(atletas) {
    // preencherTabela (na View base) gera as <tr> e, se a lista estiver vazia, a linha de aviso
    this.preencherTabela("#listaAtletas", atletas, (a) => `
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
      </tr>`, 6, "Nenhum atleta encontrado.");
  }

  mostrarResumo(exibidos, total) {
    // Escreve o texto "Exibindo X de Y" no elemento de resumo
    this.escrever("#resumoAtletas", `Exibindo ${exibidos} de ${total} atletas`);
  }

  // Abre o modal de exclusão com o nome do atleta
  confirmarExclusao(nome) {
    // Escreve a pergunta dentro do modal
    this.escrever("#mensagemExclusao", `Deseja realmente excluir ${nome}?`);
    // Põe a classe que faz o modal aparecer
    this.abrirModal("#modalAtleta");
  }
}

export default AtletaView;
