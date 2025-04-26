# Wise Wallet

Um aplicativo web simples para controle financeiro pessoal, permitindo o upload de transações via CSV, categorização e visualização de resumos financeiros.

## Logar
* http://localhost:3001/api/auth/google
    * Após o login bem-sucedido no navegador, use as ferramentas de desenvolvedor do navegador (aba "Network" ou "Application" > "Cookies") para encontrar o cookie de sessão (geralmente chamado connect.sid para express-session).
    * No Postman/Insomnia, adicione um Header Cookie a todas as suas requisições para as rotas protegidas, com o valor connect.sid=SEU_VALOR_DO_COOKIE_AQUI.
* http://localhost:3001/api/auth/me
* http://localhost:3001/api/auth/logout


## Funcionalidades Planejadas

* [x] Autenticação de usuário via Google Authentication.
* [x] Upload de arquivos `.csv` contendo transações financeiras.
* [x] Listagem e filtragem de transações.
* [x] CRUD (Criar, Ler, Atualizar, Desativar) para Categorias.
* [x] CRUD (Criar, Ler, Atualizar, Desativar) para Subcategorias (vinculadas a Categorias).
* [x] Dashboard inicial com resumo financeiro.
* [ ] (Opcional) Integração com LLM para insights financeiros.

## Tecnologias Utilizadas

* **Frontend:** React (com Vite)
* **Backend:** Node.js (com Express.js)
* **Banco de Dados:** PostgreSQL (gerenciado via Docker)
* **Gerenciador de Pacotes:** npm
* **Versionamento:** Git

## Estrutura do Projeto

Este projeto é organizado como um monorepo simples:

* `/backend`: Contém o código do servidor Node.js/Express.
* `/frontend`: Contém o código da aplicação React/Vite.
* `docker-compose.yml`: Arquivo de configuração para iniciar o banco de dados PostgreSQL via Docker.
* `README.md`: Este arquivo.

## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

* [Node.js](https://nodejs.org/) (que inclui o npm)
* [Git](https://git-scm.com/)
* [Docker](https://www.docker.com/products/docker-desktop/)
* [Docker Compose](https://docs.docker.com/compose/install/) (geralmente incluído no Docker Desktop)

## Instalação e Configuração

1.  **Clone o Repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO_GIT>
    cd meu-app-financeiro 
    ```
    *(Substitua `<URL_DO_SEU_REPOSITORIO_GIT>` pela URL real se você o hospedou online, ou apenas navegue para a pasta se criou localmente)*

2.  **Inicie o Banco de Dados (PostgreSQL via Docker):**
    Na pasta raiz do projeto (`meu-app-financeiro`), execute:
    ```bash
    docker-compose up -d
    ```
    Isso iniciará um container PostgreSQL em segundo plano. Os dados serão persistidos em um volume Docker chamado `postgres_data`.

3.  **Configure o Backend:**
    * Navegue até a pasta do backend:
        ```bash
        cd backend
        ```
    * Instale as dependências:
        ```bash
        npm install
        ```
    * *(Opcional)* Verifique ou crie o arquivo `.env` na pasta `backend` se precisar definir variáveis de ambiente específicas (como as credenciais do banco de dados, que adicionaremos depois). Por enquanto, ele deve conter pelo menos `BACKEND_PORT=3001`.

4.  **Configure o Frontend:**
    * Volte para a raiz e navegue até a pasta do frontend:
        ```bash
        cd ../frontend 
        ```
        *(Se estiver na pasta `backend`, use `cd ../frontend`. Se estiver na raiz, use `cd frontend`)*
    * Instale as dependências:
        ```bash
        npm install
        ```

## Executando a Aplicação

Você precisará de dois terminais abertos para rodar o backend e o frontend simultaneamente.

1.  **Iniciar o Backend:**
    * Navegue até a pasta `backend`.
    * Execute o comando de desenvolvimento:
        ```bash
        npm run dev
        ```
    * O servidor backend estará rodando em `http://localhost:3001` (ou a porta definida em `backend/.env`).

2.  **Iniciar o Frontend:**
    * Navegue até a pasta `frontend`.
    * Execute o comando de desenvolvimento:
        ```bash
        npm run dev
        ```
    * A aplicação React estará acessível em `http://localhost:5173` (ou outra porta indicada pelo Vite no terminal).

## Parando a Aplicação

* Para parar o servidor backend, pressione `Ctrl + C` no terminal correspondente.
* Para parar o servidor frontend, pressione `Ctrl + C` no terminal correspondente.
* Para parar o container do banco de dados PostgreSQL:
    ```bash
    docker-compose down 
    ```
    *(Execute este comando na pasta raiz do projeto onde o `docker-compose.yml` está localizado).*

---

*Este README será atualizado conforme o projeto evolui.*