/* Página Novo Atleta — lê o formulário, cadastra e persiste o atleta */
import AtletaView from "../views/atletaView.js";
import { carregarSistema, Armazenamento, proximoId, criarAtleta } from "../script.js";

const view = new AtletaView();

async function iniciar() {
  const { atletaControl } = await carregarSistema("../data/dados.json");

  view.ligar("#formAtleta", "submit", (e) => {
    e.preventDefault();
    const dados = view.lerAtleta();
    if (!dados.nome || !dados.cpf || !dados.modalidade) {
      alert("Preencha os campos obrigatórios.");
      return;
    }
    const atleta = criarAtleta({ ...dados, id: proximoId(atletaControl.vetAtletas) });
    atletaControl.cadastrarAtleta(atleta);
    Armazenamento.salvar({ atletas: atletaControl.vetAtletas });
    window.location.href = "atletas.html";
  });
}

iniciar();
