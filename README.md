# SupportAI

<p align="center">
  <strong>An AI-powered customer support platform built with Retrieval-Augmented Generation (RAG).</strong>
</p>

<p align="center">
  Built with Next.js, NestJS, PostgreSQL, pgvector, and Ollama.
</p>

---

## Overview

SupportAI is a full-stack AI customer support platform that enables users to create intelligent support agents, manage custom knowledge bases, and build AI-powered conversational experiences.

The platform uses **Retrieval-Augmented Generation (RAG)** to ground AI-generated responses in relevant knowledge sources. It combines semantic search with locally hosted language models to generate context-aware answers.

SupportAI is a hands-on exploration of the engineering behind AI-powered SaaS products, covering database design, backend architecture, authentication, vector retrieval, LLM integration, and full-stack development.

## Product Showcase

<!-- Add screenshots to the assets/screenshots directory. -->

### AI Agent Management

Create and configure AI support agents with their own descriptions, system prompts, and knowledge bases.

<!-- Screenshot: assets/screenshots/agent-dashboard.png -->

### Knowledge Base

Manage knowledge sources, process content into chunks, and generate embeddings for semantic search.

<!-- Screenshot: assets/screenshots/knowledge-base.png -->

### Authentication

Register and log in securely, with persistent sessions powered by HTTP-only refresh cookies.

<!-- Screenshot: assets/screenshots/authentication.png -->

### AI-Powered Conversations

Interact with AI agents, receive context-grounded responses, and inspect the knowledge sources used to generate answers.

<!-- Screenshot: assets/screenshots/chat-interface.png -->

## Features

### Authentication and Authorization

- User registration and login.
- Password hashing using Argon2id.
- JWT-based access authentication.
- HTTP-only refresh token cookies.
- Refresh token rotation and revocation.
- Persistent sessions across page reloads.
- Protected API endpoints.
- User-specific agent ownership and data isolation.

### AI Agent Management

- Create, retrieve, update, and delete AI agents.
- Configure agent descriptions and system prompts.
- Associate knowledge bases with individual agents.
- Enforce agent ownership.

### Knowledge Source Management

- Add and manage knowledge sources.
- Split source content into smaller overlapping chunks.
- Generate vector embeddings locally.
- Store embeddings in PostgreSQL using pgvector.
- Process and reprocess knowledge sources.

### Retrieval-Augmented Generation

- Semantic retrieval using vector similarity search.
- Context construction from relevant knowledge chunks.
- Grounded response generation using local LLMs.
- Source references associated with generated answers.
- Fallback responses when relevant knowledge is unavailable.

### Conversational Backend

- Create and persist conversations.
- Store user and assistant messages.
- Associate conversations with individual agents.
- Support RAG-powered chat orchestration.
- Include conversation context in LLM requests.

### Local AI Inference

- LLM inference through Ollama.
- Local embedding generation.
- No dependency on paid external LLM APIs for the current implementation.

## Architecture

```mermaid
flowchart TD
    User[User]
    Web[Next.js Frontend]
    API[NestJS REST API]

    Auth[Authentication]
    Agents[Agent Management]
    Knowledge[Knowledge Source Management]
    Chat[Chat Orchestration]
    Conversations[Conversation Persistence]

    Chunking[Text Chunking]
    Embedding[Embedding Service]
    Retrieval[Semantic Retrieval]
    LLMService[LLM Service]

    DB[(PostgreSQL + pgvector)]
    Ollama[Ollama Runtime]

    User --> Web
    Web --> API

    API --> Auth
    API --> Agents
    API --> Knowledge
    API --> Chat

    Auth --> DB
    Agents --> DB

    Knowledge --> Chunking
    Chunking --> Embedding
    Embedding --> Ollama
    Embedding --> DB

    Chat --> Retrieval
    Retrieval --> DB
    Chat --> LLMService
    LLMService --> Ollama

    Chat --> Conversations
    Conversations --> DB
```

## RAG Pipeline

SupportAI processes knowledge sources and user questions through the following pipeline:

1. **Knowledge ingestion** — A user adds a knowledge source to an AI agent.
2. **Text chunking** — Source content is split into smaller overlapping chunks.
3. **Embedding generation** — Each chunk is converted into a vector using `nomic-embed-text`.
4. **Vector storage** — Chunks and embeddings are stored in PostgreSQL with pgvector.
5. **Query embedding** — A user's question is converted into an embedding.
6. **Semantic retrieval** — Relevant chunks are retrieved using vector similarity.
7. **Context construction** — Retrieved chunks are assembled into the LLM prompt.
8. **Answer generation** — Qwen generates a response grounded in the retrieved context.
9. **Persistence** — Conversation messages and associated source references are persisted.
10. **Response delivery** — The generated answer and supporting sources are returned to the client.

## Authentication Flow

SupportAI uses short-lived access tokens and rotating refresh tokens.

- Access tokens are JWTs used to authenticate protected API requests.
- Refresh tokens are generated using cryptographically secure randomness.
- Only SHA-256 hashes of refresh tokens are stored in the database.
- Refresh tokens are delivered through HTTP-only cookies.
- Refresh token rotation invalidates the previous token.
- Logout revokes the active refresh token.
- The frontend restores sessions after page reloads.
- Authenticated API requests can automatically refresh expired access tokens.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Backend | NestJS 12, Node.js, TypeScript |
| Database | PostgreSQL |
| Vector Search | pgvector |
| ORM | Drizzle ORM |
| Authentication | JWT, Argon2id, HTTP-only cookies |
| LLM Runtime | Ollama |
| Generative Model | Qwen 2.5 3B |
| Embedding Model | nomic-embed-text |
| Infrastructure | Docker, Docker Compose |
| Package Manager | pnpm |
| Backend Testing | Vitest |

## Getting Started

### Prerequisites

- Node.js
- pnpm 12.10.1
- Docker and Docker Compose
- Ollama

### 1. Clone the repository

```bash
git clone https://github.com/mostafaesmail-tc/supportAI.git
cd supportAI
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Start PostgreSQL

```bash
docker compose up -d
```

The database runs PostgreSQL with the pgvector extension.

### 4. Configure environment variables

Create an API environment file at `apps/api/.env`:

```env
DATABASE_URL=postgresql://YOUR_DB_USER:YOUR_DB_PASSWORD@localhost:5432/YOUR_DB_NAME
```

Create a frontend environment file at `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Replace the database placeholders with the credentials configured in your Docker Compose setup.

Do not commit environment files or secrets to version control.

### 5. Install Ollama models

```bash
ollama pull qwen2.5:3b
ollama pull nomic-embed-text
```

Ensure Ollama is running:

```bash
ollama serve
```

The default Ollama API endpoint is:

```text
http://localhost:11434
```

### 6. Run database migrations

From the repository root:

```bash
pnpm --filter api exec drizzle-kit migrate
```

To generate migrations after changing the database schema:

```bash
pnpm --filter api exec drizzle-kit generate
```

### 7. Start the applications

Start the NestJS API:

```bash
pnpm --filter api start:dev
```

In another terminal, start the Next.js frontend:

```bash
pnpm --filter web dev
```

The development services are available at:

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001 |
| Ollama | http://localhost:11434 |

## Development Commands

### Backend

```bash
# Development server
pnpm --filter api start:dev

# Production build
pnpm --filter api build

# Run tests
pnpm --filter api test

# Run tests in watch mode
pnpm --filter api test:watch

# Run tests with coverage
pnpm --filter api test:cov

# Run end-to-end tests
pnpm --filter api test:e2e

# Lint
pnpm --filter api lint
```

### Frontend

```bash
# Development server
pnpm --filter web dev

# Production build
pnpm --filter web build

# Start production server
pnpm --filter web start

# Lint
pnpm --filter web lint
```

## Project Structure

```text
supportAI/
├── apps/
│   ├── api/
│   │   ├── drizzle/
│   │   ├── src/
│   │   │   ├── agents/
│   │   │   ├── auth/
│   │   │   ├── chat/
│   │   │   ├── conversations/
│   │   │   ├── db/
│   │   │   ├── embeddings/
│   │   │   ├── knowledge-sources/
│   │   │   ├── llm/
│   │   │   └── app.module.ts
│   │   ├── test/
│   │   ├── drizzle.config.ts
│   │   └── package.json
│   │
│   └── web/
│       ├── app/
│       │   ├── agents/
│       │   ├── components/
│       │   ├── login/
│       │   ├── register/
│       │   ├── globals.css
│       │   ├── layout.tsx
│       │   └── page.tsx
│       ├── lib/
│       │   ├── api.ts
│       │   ├── auth-context.tsx
│       │   └── auth-token.ts
│       ├── types/
│       └── package.json
│
├── packages/
├── docker-compose.yml
├── pnpm-workspace.yaml
├── package.json
├── pnpm-lock.yaml
└── README.md
```

## Engineering Concepts Explored

- End-to-end feature ownership from database schema to UI.
- Modular backend architecture using NestJS.
- REST API design and request validation.
- Relational data modeling and cascading relationships.
- Authentication and authorization.
- Secure password storage and refresh token rotation.
- Session management in browser applications.
- Vector embeddings and semantic similarity search.
- Retrieval-Augmented Generation orchestration.
- Local LLM inference.
- Conversational state and message persistence.
- Agent-specific data isolation.
- Full-stack TypeScript development.
- Containerized local development.

## Roadmap

- [x] AI agent CRUD
- [x] Knowledge source management
- [x] Text chunking and embedding generation
- [x] PostgreSQL vector storage
- [x] Semantic knowledge retrieval
- [x] Local LLM integration
- [x] RAG-powered chat backend
- [x] Persistent conversations and messages (backend)
- [x] User registration and login
- [x] Secure password hashing
- [x] JWT access authentication
- [x] Refresh token rotation and revocation
- [x] Persistent frontend sessions
- [x] Protected dashboard
- [ ] Complete frontend chat experience
- [ ] Conversation history UI
- [ ] Automatic conversation titles
- [ ] Streaming responses
- [ ] Automated testing and additional validation
- [ ] Retrieval optimization and advanced RAG techniques
- [ ] Production deployment

## Motivation

SupportAI is a practical project focused on understanding how AI-powered customer support platforms are designed and implemented.

The project explores the complete lifecycle of a RAG application—from knowledge ingestion and vector retrieval to authentication, conversational AI, and persistent user experiences—while emphasizing maintainable architecture, security, and end-to-end engineering.

---

<p align="center">
  <strong>Built with TypeScript, NestJS, Next.js, PostgreSQL, pgvector, and Ollama.</strong>
</p>