# TP1 - Laboratório de Desenvolvimento de Software

## Descrição

Este projeto consiste no desenvolvimento de uma API REST utilizando Node.js e Express.

A API disponibiliza operações para gerir `items`, `livros` e `clientes`, incluindo operações de consulta, criação, atualização e remoção.

Os testes da API foram realizados utilizando o Postman.

## Tecnologias utilizadas

* Node.js
* Express.js
* JavaScript
* Postman

## Requisitos

Para executar o projeto é necessário ter instalado:

* Node.js
* npm
* Postman

## Instalação

Entrar na pasta `backend` do projeto:

```bash
cd backend
```

Instalar as dependências:

```bash
npm install
```

## Execução

Para iniciar o servidor:

```bash
node server.js
```

Quando o servidor estiver a funcionar, será apresentada a mensagem:

```text
API a executar em http://localhost:3000
```

A API fica disponível em:

```text
http://localhost:3000
```

## Endpoints

### Items

#### Listar todos os items

```http
GET /api/items
```

Também são suportados parâmetros de pesquisa, ordenação e paginação:

```http
GET /api/items?name=Item
GET /api/items?sort=name
GET /api/items?sort=id&order=desc
GET /api/items?page=1&limit=10
```

#### Obter um item pelo ID

```http
GET /api/items/:id
```

Exemplo:

```http
GET /api/items/1
```

#### Criar um item

```http
POST /api/items
```

Exemplo de corpo:

```json
{
    "name": "Item3"
}
```

#### Atualizar um item

```http
PUT /api/items/:id
```

Exemplo:

```http
PUT /api/items/1
```

Corpo:

```json
{
    "name": "Novo Item"
}
```

#### Remover um item

```http
DELETE /api/items/:id
```

Exemplo:

```http
DELETE /api/items/1
```

## Livros

### Listar livros

```http
GET /api/livros
```

### Obter livro pelo ID

```http
GET /api/livros/:id
```

Exemplo:

```http
GET /api/livros/1
```

### Criar livro

```http
POST /api/livros
```

Exemplo de corpo:

```json
{
    "titulo": "JavaScript",
    "autor": "Afonso Coelho",
    "estado": "disponivel"
}
```

Os estados permitidos são:

* `disponivel`
* `emprestado`
* `avariado`

### Atualizar livro

```http
PUT /api/livros/:id
```

Exemplo de corpo:

```json
{
    "titulo": "JavaScript Avançado",
    "autor": "Afonso Coelho",
    "estado": "disponivel"
}
```

### Remover livro

```http
DELETE /api/livros/:id
```

## Clientes

### Listar clientes

```http
GET /api/clientes
```

Exemplo:

```http
GET /api/clientes
```

## Tratamento de erros

A API utiliza códigos de estado HTTP para indicar o resultado das operações.

Principais códigos utilizados:

* `200 OK` — pedido realizado com sucesso
* `201 Created` — recurso criado com sucesso
* `204 No Content` — recurso eliminado com sucesso
* `400 Bad Request` — pedido ou dados inválidos
* `404 Not Found` — recurso ou rota não encontrada
* `409 Conflict` — conflito com um recurso existente

Os erros da API utilizam o formato `application/problem+json` e incluem os campos:

```json
{
    "status": 400,
    "title": "Pedido inválido",
    "detail": "Descrição do erro"
}
```

## Testes

Os testes da API foram realizados através do Postman.

Os testes verificam, entre outros aspetos:

* Código de estado HTTP
* Formato das respostas
* Existência dos campos esperados
* Respostas para pedidos inválidos
* Respostas para recursos inexistentes
* Criação, atualização e remoção de recursos

A coleção do Postman encontra-se na pasta:

```text
tests/
```

## Estrutura do projeto

```text
lei022-tp1-Afonso-Coelho/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── tests/
│   └── coleção Postman
│
└── README.md
```
