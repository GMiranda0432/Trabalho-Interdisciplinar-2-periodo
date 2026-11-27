/* Página Editar Atleta — carrega o atleta da URL, atualiza e persiste */
import AtletaView from "../views/atletaView.js";
import { carregarSistema, Armazenamento, criarAtleta } from "../script.js";

const view = new AtletaView();

async function iniciar() {
  const { atletaControl } = await carregarSistema("../data/dados.json");
  const id = view.lerIdDaUrl();
  const atleta = atletaControl.buscarAtleta(id);
  if (atleta) view.preencherAtleta(atleta);

  view.ligar("#formAtleta", "submit", (e) => {
    e.preventDefault();
    const dados = view.lerAtleta();
    if (!dados.nome || !dados.cpf || !dados.modalidade) {
      alert("Preencha os campos obrigatórios.");
      return;
    }
    const idAtual = view.lerIdAtleta();
    atletaControl.atualizarAtleta(idAtual, criarAtleta({ ...dados, id: idAtual }));
    Armazenamento.salvar({ atletas: atletaControl.vetAtletas });
    window.location.href = "atletas.html";
  });
}

iniciar();
