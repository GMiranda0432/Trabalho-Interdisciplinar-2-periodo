/* Página Edição de Competições — carrega a competição da URL, atualiza e persiste */
import CompView from "../views/compView.js";
import { carregarSistema, Armazenamento, criarCompeticao } from "../script.js";

const view = new CompView();

async function iniciar() {
  const { compControl } = await carregarSistema("../data/dados.json");
  const id = view.lerIdDaUrl();
  const comp = compControl.buscarCompeticao(id);
  if (comp) view.preencherCompeticao(comp);

  view.ligar("#tipo", "change", () => view.alternarCamposTipo());
  view.ligar("#formCompeticao", "submit", (e) => {
    e.preventDefault();
    const dados = view.lerCompeticao();
    if (!dados.nome || !dados.data || !dados.tipo) {
      alert("Preencha os campos obrigatórios.");
      return;
    }
    const idAtual = view.lerIdCompeticao();
    compControl.atualizarCompeticao(idAtual, criarCompeticao({ ...dados, id: idAtual }));
    Armazenamento.salvar({ competicoes: compControl.vetCompeticoes });
    window.location.href = "comps.html";
  });
}

iniciar();
