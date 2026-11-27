# Sistema de Gestão de Competições de Corrida

Projeto interdisciplinar para organizar atletas, competições de corrida, inscrições e relatórios. A aplicação é feita com HTML, CSS e JavaScript, sem backend: os dados ficam no navegador em que o sistema é utilizado.

## Executar o sistema

O JavaScript usa módulos ES e carrega os dados iniciais com `fetch`. Por isso, abra o projeto por um servidor HTTP local, não diretamente pelo arquivo `index.html`.

No Visual Studio Code:

1. Abra a pasta do projeto.
2. Inicie um servidor local, por exemplo, com a extensão **Live Server**.
3. Abra o [`index.html`](./index.html) pelo servidor.

## Funcionalidades

- **Visão geral:** apresenta os totais de atletas e competições e atalhos para as telas principais.
- **Atletas:** cadastro, listagem, edição, exclusão, pesquisa por ID e filtro por modalidade.
- **Competições:** cadastro, listagem, edição, exclusão, pesquisa por ID e filtro por tipo. Maratonas e Trail Running têm campos específicos.
- **Inscrições:** associa atletas a uma competição, mostrando atletas da modalidade correspondente e evitando inscrições duplicadas.
- **Relatórios:** consulta participantes de uma competição e apresenta um resumo geral.

## Organização do código

O projeto segue uma organização inspirada no padrão MVC:

- [`js/models/`](./js/models/): classes de domínio, como `Atleta`, `Competicao`, `Maratona` e `TrailRunning`.
- [`js/controllers/`](./js/controllers/): operações sobre as listas de atletas e competições, incluindo cadastro, consulta, atualização, remoção e filtros.
- [`js/views/`](./js/views/): leitura de formulários e atualização dos elementos da página.
- [`js/pags/`](./js/pags/): scripts que conectam a View e o Controller de cada tela.
- [`js/script.js`](./js/script.js): funções compartilhadas, validações, carregamento, persistência e a classe base `View`.
- [`pags/`](./pags/): páginas HTML secundárias.
- [`css/style.css`](./css/style.css): estilos compartilhados.
- [`data/dados.json`](./data/dados.json): dados de exemplo carregados na primeira execução.
- [`docs/diagramaCorridas.png`](./docs/diagramaCorridas.png): diagrama de classes do projeto.

Os campos dos models são privados e acessados por getters e setters. `Maratona` e `TrailRunning` herdam os dados comuns de `Competicao` e acrescentam seus próprios dados.

## Dados e persistência

Na primeira execução, o sistema carrega [`data/dados.json`](./data/dados.json) e grava os dados no `localStorage`. Depois disso, as páginas leem e atualizam os dados salvos no navegador.

O armazenamento é local ao navegador e à origem do servidor usado. Assim, os dados não são compartilhados entre dispositivos ou entre endereços diferentes.

Para voltar aos dados iniciais, limpe no armazenamento local do navegador as chaves `atletas`, `competicoes` e `inscricoes`. Na próxima execução, o sistema carregará novamente o JSON de exemplo.

## Tecnologias

- HTML
- CSS
- JavaScript com módulos ES
- `localStorage` e `fetch` para persistência e carga inicial dos dados
