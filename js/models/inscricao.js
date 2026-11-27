/* Model Inscricao — entidade associativa entre Atleta e Competicao.
   Representa a "tabela associativa" prevista no diagrama de classes:
   cada Inscricao vincula um atleta (atletaId) a uma competição (competicaoId).
   É encapsulada (campos privados #) e possui toString(), como as demais classes. */
class Inscricao {
  // Campos privados: ligam uma competição a um atleta
  #competicaoId;
  #atletaId;

  // Recebe os dois ids e guarda como número, para as comparações baterem sempre
  constructor(competicaoId, atletaId) {
    // Guarda sempre como número, garantindo comparações consistentes
    this.#competicaoId = Number(competicaoId);
    this.#atletaId = Number(atletaId);
  }

  // Devolve o id da competição
  get competicaoId() {
    return this.#competicaoId;
  }

  // Troca o id da competição (convertendo para número)
  set competicaoId(valor) {
    this.#competicaoId = Number(valor);
  }

  // Devolve o id do atleta
  get atletaId() {
    return this.#atletaId;
  }

  // Troca o id do atleta (convertendo para número)
  set atletaId(valor) {
    this.#atletaId = Number(valor);
  }

  // Formato gravado no localStorage (mantém o mesmo layout do dados.json)
  toJSON() {
    return {
      competicaoId: this.#competicaoId,
      atletaId: this.#atletaId,
    };
  }

  // Texto para exibir a inscrição (usado em logs/testes)
  toString() {
    return `Inscricao{competicaoId=${this.#competicaoId}, atletaId=${this.#atletaId}}`;
  }
}

export default Inscricao;
