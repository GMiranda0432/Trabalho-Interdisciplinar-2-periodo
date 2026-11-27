// Traz a View base (métodos genéricos de DOM)
import { View } from "../script.js";

/* View da Inscrição — herda a base compartilhada (script.js) e só cuida do DOM.
   Responsável por: montar o select de competições, desenhar a lista de atletas
   com checkbox e ler quais atletas foram marcados. */
class InscricaoView extends View {
  // Preenche o <select> de competições com a primeira opção neutra
  preencherCompeticoes(competicoes) {
    // preencherSelectDeObjetos cria um <option> para cada competição (usando id e nome)
    this.preencherSelectDeObjetos("#competicao", competicoes, "Selecione a competição");
  }

  // Mostra uma mensagem no lugar da lista de atletas (usado antes de escolher a competição)
  mostrarMensagemAtletas(texto) {
    // Lista vazia -> preencherTabela coloca uma única linha com o texto informado
    this.preencherTabela("#listaAtletasInscricao", [], () => "", 8, texto);
  }

  // Monta a lista de atletas no mesmo formato da página atletas.html
  // (dados completos) com uma checkbox à esquerda e sem botões de editar/excluir
  mostrarAtletas(atletas) {
    // Uma <tr> por atleta; a 1ª célula é a checkbox com o id do atleta como valor
    this.preencherTabela("#listaAtletasInscricao", atletas, (atleta) => `
      <tr>
        <td><input class="check-atleta" type="checkbox" value="${this.escapar(atleta.id)}"></td>
        <td>${this.escapar(atleta.id)}</td>
        <td>${this.escapar(atleta.nome)}</td>
        <td>${this.escapar(atleta.cpf)}</td>
        <td>${this.escapar(atleta.idade)}</td>
        <td>${this.escapar(atleta.email)}</td>
        <td>${this.escapar(atleta.modalidade)}</td>
        <td>${this.escapar(atleta.peso)}</td>
      </tr>`, 8, "Nenhum atleta disponível para esta modalidade.");
  }

  // Liga/desliga o botão de inscrição (fica desligado até escolher a competição)
  ativarBotao(ativo) {
    // Pega o botão e deixa ele habilitado/desabilitado conforme "ativo"
    const botao = this.elemento("#btnInscrever");
    if (botao) botao.disabled = !ativo;
  }

  // Liga/desliga a seção de atletas (começa desativada, sem nenhum atleta listado)
  ativarSecao(ativo) {
    // Adiciona/remove a classe "desativada" na seção de atletas
    this.alternarClasse(".secao-atletas", "desativada", !ativo);
  }

  // Lê os ids de todos os atletas com a checkbox marcada
  lerAtletasSelecionados() {
    // Pega só as checkboxes marcadas (:checked), pega o value (id) e converte para número
    return this.elementos(".check-atleta:checked").map((caixa) => Number(caixa.value));
  }
}

export default InscricaoView;
