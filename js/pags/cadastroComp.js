/* Página Nova Competição — lê o formulário, cria e persiste a competição */
import CompView from "../views/compView.js";
import { carregarSistema, Armazenamento, proximoId, criarCompeticao } from "../script.js";

const view = new CompView();

async function iniciar() {
  const { compControl } = await carregarSistema("../data/dados.json");
  view.alternarCamposTipo();

  view.ligar("#tipo", "change", () => view.alternarCamposTipo());
  view.ligar("#formCompeticao", "submit", (e) => {
    e.preventDefault();
    const dados = view.lerCompeticao();
    if (!dados.nome || !dados.data || !dados.tipo) {
      alert("Preencha os campos obrigatórios.");
      return;
    }
    const comp = criarCompeticao({ ...dados, id: proximoId(compControl.vetCompeticoes) });
    compControl.cadastrarCompeticao(comp);
    Armazenamento.salvar({ competicoes: compControl.vetCompeticoes });
    window.location.href = "comps.html";
  });
}

iniciar();
