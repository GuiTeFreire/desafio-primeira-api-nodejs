# 🚀 Projeto Aula Node.js

API REST para gerenciamento de cursos desenvolvida com Node.js, Fastify, TypeScript, Drizzle ORM e PostgreSQL. Sistema completo com autenticação JWT, controle de acesso baseado em roles e gerenciamento de matrículas.

## 📋 Descrição

Sistema de gerenciamento de cursos com endpoints para criação, listagem, busca e remoção de cursos. Inclui sistema de autenticação JWT, controle de acesso baseado em roles (student/manager) e gerenciamento de matrículas. Em desenvolvimento, expõe documentação em `/docs`.

## 🏗️ Arquitetura

```mermaid
graph TB
    subgraph "Frontend/Client"
        A[Cliente HTTP]
    end

    subgraph "API Layer"
        B[Fastify Server]
        C[Routes]
        D[Middleware]
        E[Validation Zod]
    end

    subgraph "Business Logic"
        F[Authentication]
        G[Role Check]
        H[Course Management]
        I[User Management]
    end

    subgraph "Data Layer"
        J[Drizzle ORM]
        K[PostgreSQL]
    end

    subgraph "Security"
        L[JWT Token]
        M[Argon2 Hash]
        N[Role-based Access]
    end

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> J
    I --> J
    J --> K
    F --> L
    F --> M
    G --> N
```

## 🛠️ Tecnologias

- **Node.js** - Runtime JavaScript
- **Fastify** - Framework web rápido
- **TypeScript** - Superset JavaScript tipado
- **PostgreSQL** - Banco de dados relacional
- **Drizzle ORM** - ORM moderno e type-safe
- **Zod** - Validação de schemas
- **JWT** - Autenticação stateless
- **Argon2** - Hash de senhas seguro
- **Docker** - Containerização
- **Vitest + Supertest** - Testes e cobertura com V8

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
- `password` - Hash da senha (Argon2)
- `role` - Role do usuário (student/manager)

### Tabela `courses`

- `id` - UUID (chave primária)
- `title` - Título único do curso
- `description` - Descrição do curso

### Tabela `enrollments`

- `id` - UUID (chave primária)
- `userId` - FK para `users.id`
- `courseId` - FK para `courses.id`
- `createdAt` - Timestamp com timezone
- **Índice único** em (userId, courseId)

## 🔌 Endpoints da API

### 🔐 Autenticação

#### POST `/sessions`

Login do usuário.

**Body:**

```json
{
  "email": "user@example.com",
  "password": "senha123"
}
```

**Resposta (200):**

```json
{
  "token": "jwt-token-aqui"
}
```

### 📚 Cursos

#### POST `/courses`

Cria um novo curso. **Requer autenticação e role 'manager'**.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Body:**

```json
{
  "title": "Nome do curso",
  "description": "Descrição do curso"
}
```

**Resposta (201):**

```json
{
  "courseId": "uuid-do-curso"
}
```

#### GET `/courses`

Lista todos os cursos. **Requer autenticação**.

#### GET `/courses/:id`

Busca um curso pelo ID. **Requer autenticação**.

#### DELETE `/courses/:id`

Remove um curso pelo ID. **Requer autenticação e role 'manager'**.

## 🔐 Sistema de Autenticação

### JWT Token

- **Algoritmo**: HS256
- **Payload**: `{ sub: userId, role: userRole }`
- **Expiração**: Configurável via `JWT_SECRET`

### Controle de Acesso

- **Student**: Pode visualizar cursos e fazer matrículas
- **Manager**: Pode criar, editar e deletar cursos

### Middleware de Segurança

- `check-request-jwt`: Valida token JWT
- `check-user-role`: Verifica permissões baseadas em role

## 📖 Documentação da API

Em desenvolvimento, disponível em:

- **API Reference**: `/docs` (Swagger UI)
- **Scalar API Reference**: `/docs` (interface moderna)

## 🐳 Docker

```bash
# Iniciar
docker compose up -d postgres

# Parar
docker compose down
```

## 🔧 Configuração

Crie os arquivos de ambiente na raiz do projeto:

### `.env`

```env
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/desafio
JWT_SECRET=sua-chave-secreta-aqui
```

### `.env.test`

```env
NODE_ENV=test
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/desafio_teste
JWT_SECRET=chave-teste
```

## 📁 Estrutura do projeto

```
projeto-aula-node/
├── src/
│   ├── app.ts                 # Configuração do Fastify
│   ├── server.ts              # Servidor HTTP
│   ├── database/
│   │   ├── client.ts          # Conexão com banco
│   │   ├── schema.ts          # Schemas Drizzle
│   │   └── seed.ts            # Dados de exemplo
│   ├── routes/
│   │   ├── create-course.ts   # Criação de cursos
│   │   ├── get-courses.ts     # Listagem de cursos
│   │   ├── get-course-by-id.ts # Busca por ID
│   │   ├── delete-course.ts   # Remoção de cursos
│   │   └── login.ts           # Autenticação
│   ├── hooks/
│   │   ├── check-request-jwt.ts # Validação JWT
│   │   └── check-user-role.ts   # Verificação de role
│   ├── utils/
│   │   └── get-authenticated-user-from-request.ts
│   └── tests/                 # Testes automatizados
├── drizzle/                   # Migrações do banco
├── docker-compose.yml         # Configuração Docker
├── vitest.config.ts           # Configuração de testes
└── package.json
```

## 🚀 Deploy

### Render.com

1. Conecte seu repositório GitHub
2. Configure como "Web Service"
3. **Build Command**: `npm install`
4. **Start Command**: `npm run dev`
5. Configure variáveis de ambiente:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`

### Variáveis de Ambiente para Produção

```env
NODE_ENV=production
DATABASE_URL=sua-url-postgresql-producao
JWT_SECRET=chave-secreta-producao-forte
PORT=10000
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch (`git checkout -b feature/minha-feature`)
3. Commit (`git commit -m 'feat: minha feature'`)
4. Push (`git push origin feature/minha-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.
