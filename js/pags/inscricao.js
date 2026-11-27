/* Página Nova Inscrição — associa um atleta a uma competição (sem alterar os Models).
   A relação é gravada em localStorage na chave "inscricoes" como { competicaoId, atletaId }. */
import { View, carregarSistema, Armazenamento } from "../script.js";

const view = new View();

async function iniciar() {
  const { dados, atletaControl, compControl } = await carregarSistema("../data/dados.json");
  const inscricoes = dados.inscricoes ?? [];

  view.preencherSelectDeObjetos("#competicao", compControl.vetCompeticoes, "Selecione a competição");
  view.preencherSelectDeObjetos("#atleta", atletaControl.vetAtletas, "Selecione o(s) atleta(s)");

  view.ligar("#formInscricao", "submit", (e) => {
    e.preventDefault();
    const competicaoId = Number(view.lerValor("#competicao"));
    const atletaId = Number(view.lerValor("#atleta"));
    if (!competicaoId || !atletaId) {
      alert("Selecione a competição e o atleta.");
      return;
    }
    const duplicada = inscricoes.some((i) => i.competicaoId === competicaoId && i.atletaId === atletaId);
    if (duplicada) {
      alert("Este atleta já está inscrito nesta competição.");
      return;
    }
    inscricoes.push({ competicaoId, atletaId });
    Armazenamento.salvar({ inscricoes });
    window.location.href = "relatorio.html";
  });
}

iniciar();
