class View {
    // Lê o id do atleta usado nas operações de buscar, atualizar e remover
    lerIdAtleta() {
        return Number(document.querySelector("#atletaId").value);
    }
    // Lê os campos do atleta e devolve um objeto literal
    lerAtleta() {
        return {
            idade: Number(document.querySelector("#atletaIdade").value),
            cpf: document.querySelector("#atletaCpf").value,
            nome: document.querySelector("#atletaNome").value,
            contato: document.querySelector("#atletaContato").value,
            modalidade: document.querySelector("#atletaModalidade").value,
            peso: Number(document.querySelector("#atletaPeso").value),
        };
    }
    // Lê a modalidade usada no filtro de atletas
    lerModalidade() {
        return document.querySelector("#atletaModalidade").value;
    }
}
export default View;