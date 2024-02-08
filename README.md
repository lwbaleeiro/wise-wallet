# Docker

Para executar um arquivo Docker Compose no terminal, você precisa navegar até o diretório que contém o arquivo `docker-compose.yml` e, em seguida, usar o comando `docker-compose up` seguido de opções adicionais, se necessário. Aqui está uma explicação passo a passo:

1. Abra um terminal ou prompt de comando.

2. Navegue até o diretório que contém seu arquivo `docker-compose.yml` usando o comando `cd`. Por exemplo:

```cd caminho/para/seu/diretorio```

3. Uma vez no diretório, execute o comando `docker-compose up` para iniciar os contêineres conforme definido no arquivo `docker-compose.yml`:

```docker-compose up```

Este comando iniciará todos os contêineres definidos no arquivo `docker-compose.yml`. Se você quiser executar os contêineres em segundo plano, adicionando a opção `-d`:

```docker-compose up -d```

4. Se desejar, você também pode forçar a criação de contêineres sempre que desejar reiniciar seus contêineres, adicionando a opção `--build`:

```docker-compose up --build```

Isso é tudo! O Docker Compose começará a criar e executar seus contêineres conforme definido no arquivo `docker-compose.yml`. Você pode ver a saída no terminal para verificar o status da criação e execução dos contêineres. Para encerrar a execução dos contêineres, basta pressionar `Ctrl + C` no terminal.


# Swagger

1. http://localhost:8080/swagger-ui.html