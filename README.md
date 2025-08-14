# 🚀 Projeto Aula Node.js

API REST para gerenciamento de cursos desenvolvida com Node.js, Fastify, TypeScript e PostgreSQL.

## 📋 Descrição

Sistema de gerenciamento de cursos com endpoints para criação, listagem e busca de cursos. A aplicação utiliza Fastify como framework web, Drizzle ORM para banco de dados e PostgreSQL como banco principal.

## 🛠️ Tecnologias

- **Node.js** - Runtime JavaScript
- **Fastify** - Framework web rápido e eficiente
- **TypeScript** - Superset JavaScript com tipagem estática
- **PostgreSQL** - Banco de dados relacional
- **Drizzle ORM** - ORM moderno e type-safe
- **Zod** - Validação de schemas
- **Docker** - Containerização do banco de dados

## 🚀 Como executar

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- npm ou yarn

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd projeto-aula-node
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o banco de dados

```bash
# Inicie o PostgreSQL com Docker
docker-compose up -d

# Execute as migrações
npm run db:migrate
```

### 4. Execute a aplicação

```bash
# Modo desenvolvimento
npm run dev

# A API estará disponível em http://localhost:3333
```

## 📚 Scripts disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run db:generate` - Gera novas migrações do banco
- `npm run db:migrate` - Executa as migrações pendentes
- `npm run db:studio` - Abre o Drizzle Studio para visualizar dados

## 🗄️ Estrutura do banco

### Tabela `users`

- `id` - UUID (chave primária)
- `name` - Nome do usuário
- `email` - Email único do usuário

### Tabela `courses`

- `id` - UUID (chave primária)
- `title` - Título único do curso
- `description` - Descrição do curso

## 🔌 Endpoints da API

### POST `/courses`

Cria um novo curso.

**Body:**

```json
{
  "title": "Nome do curso"
}
```

**Resposta (201):**

```json
{
  "courseId": "uuid-do-curso"
}
```

### GET `/courses`

Lista todos os cursos disponíveis.

### GET `/courses/:id`

Busca um curso específico por ID.

## 📖 Documentação da API

Em modo desenvolvimento, a documentação está disponível em:

- **Swagger UI**: `/docs`
- **API Reference**: `/docs`

## 🔄 Fluxo da Aplicação

```mermaid
graph TD
    A[Cliente] --> B[Fastify Server]
    B --> C{Endpoint}

    C -->|POST /courses| D[Validação Zod]
    C -->|GET /courses| E[Buscar todos os cursos]
    C -->|GET /courses/:id| F[Buscar curso por ID]

    D --> G{Validação OK?}
    G -->|Não| H[Erro 400 - Validação falhou]
    G -->|Sim| I[Inserir no PostgreSQL]

    I --> J{Inserção OK?}
    J -->|Não| K[Erro 500 - Falha no banco]
    J -->|Sim| L[Retornar 201 + courseId]

    E --> M[Query SELECT * FROM courses]
    M --> N[Retornar lista de cursos]

    F --> O[Query SELECT WHERE id = :id]
    O --> P{Curso encontrado?}
    P -->|Não| Q[Erro 404 - Curso não encontrado]
    P -->|Sim| R[Retornar dados do curso]

    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style D fill:#fff3e0
    style I fill:#e8f5e8
    style M fill:#e8f5e8
    style O fill:#e8f5e8
```

## 🐳 Docker

O projeto inclui um `docker-compose.yml` para facilitar a execução do PostgreSQL:

```bash
# Iniciar banco
docker-compose up -d

# Parar banco
docker-compose down
```

## 🔧 Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/desafio
```

## 📁 Estrutura do projeto

```
projeto-aula-node/
├── src/
│   ├── database/
│   │   ├── client.ts      # Conexão com banco
│   │   └── schema.ts      # Schemas das tabelas
│   └── routes/
│       ├── create-course.ts
│       ├── get-courses.ts
│       └── get-course-bt-id.ts
├── drizzle/               # Migrações do banco
├── server.ts             # Servidor principal
├── docker-compose.yml    # Configuração Docker
└── package.json
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.
