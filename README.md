# 🚀 Projeto Aula Node.js

API REST para gerenciamento de cursos desenvolvida com Node.js, Fastify, TypeScript, Drizzle ORM e PostgreSQL.

## 📋 Descrição

Sistema de gerenciamento de cursos com endpoints para criação, listagem, busca e remoção de cursos. Em desenvolvimento, expõe documentação em `/docs`.

## 🛠️ Tecnologias

- **Node.js**
- **Fastify**
- **TypeScript**
- **PostgreSQL**
- **Drizzle ORM**
- **Zod**
- **Docker**
- **Vitest + Supertest** (testes e cobertura com V8)

## 🚀 Como executar

### Pré-requisitos

- Node.js 18+ (recomendado 20+)
- Docker e Docker Compose
- npm

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
docker compose up -d postgres

# Crie o banco usado em desenvolvimento (se não existir)
# O docker-compose já sobe o DB "desafio". Ajuste o .env se necessário.

# Rode as migrações (usando seu .env)
npx dotenv -e .env drizzle-kit migrate
```

### 4. Execute a aplicação

```bash
# Modo desenvolvimento
npm run dev
# A API estará disponível em http://localhost:3333
```

## 🧪 Testes

Os testes usam `vitest` + `supertest` e rodam migrações automaticamente no `pretest` com `.env.test`.

```bash
# Garanta que o banco de teste existe (ex.: desafio_teste)
docker compose exec -T postgres psql -U postgres -c "CREATE DATABASE desafio_teste;"

# Rode os testes
npm run test

# Com cobertura
npx dotenv -e .env.test vitest run --coverage
```

## 📚 Scripts disponíveis

- `dev`: inicia o servidor em modo desenvolvimento (`src/server.ts`)
- `db:generate`: gera migrações conforme `src/database/schema.ts`
- `db:migrate`: aplica migrações
- `db:studio`: abre o Drizzle Studio
- `db:seed`: popula dados de exemplo
- `test`: executa testes (carregando `.env.test` e migrando antes)

## 🗄️ Estrutura do banco

### Tabela `users`

- `id` - UUID (chave primária)
- `name` - Nome do usuário
- `email` - Email único do usuário

### Tabela `courses`

- `id` - UUID (chave primária)
- `title` - Título único do curso
- `description` - Descrição do curso

### Tabela `enrollments`

- `id` - UUID (chave primária)
- `userId` - FK para `users.id`
- `courseId` - FK para `courses.id`
- `createdAt` - Timestamp com timezone

## 🔌 Endpoints da API

### POST `/courses`

Cria um novo curso.

Body:

```json
{ "title": "Nome do curso" }
```

Resposta (201):

```json
{ "courseId": "uuid-do-curso" }
```

### GET `/courses`

Lista todos os cursos.

### GET `/courses/:id`

Busca um curso pelo ID.

### DELETE `/courses/:id`

Remove um curso pelo ID.

## 📖 Documentação da API

Em desenvolvimento, disponível em:

- **API Reference**: `/docs`

## 🐳 Docker

```bash
# Iniciar
docker compose up -d postgres

# Parar
docker compose down
```

## 🔧 Configuração

Crie os arquivos de ambiente na raiz do projeto:

`.env`

```env
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/desafio
```

`.env.test` (exemplo)

```env
NODE_ENV=test
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/desafio_teste
```

## 📁 Estrutura do projeto

```
projeto-aula-node/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── database/
│   │   ├── client.ts
│   │   ├── schema.ts
│   │   └── seed.ts
│   └── routes/
│       ├── create-course.ts
│       ├── get-courses.ts
│       ├── get-course-by-id.ts
│       └── delete-course.ts
├── drizzle/
├── docker-compose.yml
├── vitest.config.ts
└── package.json
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch (`git checkout -b feature/minha-feature`)
3. Commit (`git commit -m 'feat: minha feature'`)
4. Push (`git push origin feature/minha-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.
