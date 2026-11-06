# SupportAI

<p align="center">
  <strong>An AI-powered customer support platform built with Retrieval-Augmented Generation (RAG).</strong>
</p>

<p align="center">
  Built with Next.js, NestJS, PostgreSQL, pgvector, and Ollama.
</p>

---

## Overview

SupportAI is a full-stack AI customer support platform that allows users to create intelligent support agents, manage custom knowledge bases, and interact with AI-powered assistants through conversational interfaces.

The platform uses **Retrieval-Augmented Generation (RAG)** to ground AI responses in relevant knowledge sources. It combines semantic search with locally hosted language models to generate context-aware answers while providing references to the information used.

SupportAI is built as a hands-on exploration of the engineering behind AI-powered SaaS products, covering everything from database design and backend architecture to vector retrieval, LLM integration, and frontend development.

## Product Showcase

<!-- Add screenshots to the assets/screenshots directory. -->

### AI Agent Management

Create and configure AI support agents with their own descriptions, system prompts, and knowledge bases.

<!-- Screenshot: assets/screenshots/agent-dashboard.png -->

### Knowledge Base

Manage knowledge sources, process documents into chunks, and generate embeddings for semantic search.

<!-- Screenshot: assets/screenshots/knowledge-base.png -->

### AI-Powered Conversations

Ask questions, receive context-grounded responses, and inspect the sources used by the AI assistant.

<!-- Screenshot: assets/screenshots/chat-interface.png -->

### Conversation History

Reopen previous conversations and continue interacting with an AI agent using persistent conversation history.

<!-- Screenshot: assets/screenshots/conversation-history.png -->

## Features

### AI Agent Management
- Create, update, and delete AI agents.
- Configure agent descriptions and system prompts.
- Maintain agent-specific knowledge bases.

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
- Source references returned with generated answers.
- Fallback responses when relevant knowledge is unavailable.

### Conversational Chat
- Start new conversations with AI agents.
- Continue existing conversations.
- Persist user and assistant messages.
- Include previous conversation messages in LLM requests.
- Display source references beneath assistant responses.
- Browse and reopen previous conversations.

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

    API --> Agents
    API --> Knowledge
    API --> Chat

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

    LLMService --> Web
```

## RAG Pipeline

SupportAI processes knowledge and user questions through the following pipeline:

1. **Knowledge ingestion** — A user adds a knowledge source to an AI agent.
2. **Text chunking** — Source content is split into smaller overlapping chunks.
3. **Embedding generation** — Each chunk is converted into a vector using `nomic-embed-text`.
4. **Vector storage** — Chunks and embeddings are stored in PostgreSQL with pgvector.
5. **Query embedding** — A user's question is converted into an embedding.
6. **Semantic retrieval** — Relevant chunks are retrieved using cosine distance.
7. **Context construction** — Retrieved chunks are assembled into the LLM prompt.
8. **Answer generation** — Qwen generates a response grounded in the retrieved context.
9. **Persistence** — User messages, assistant responses, and source references are stored.
10. **Response delivery** — The frontend displays the answer and supporting sources.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| Backend | NestJS, Node.js, TypeScript |
| Database | PostgreSQL |
| Vector Search | pgvector |
| ORM | Drizzle ORM |
| LLM Runtime | Ollama |
| Generative Model | Qwen 2.5 3B |
| Embedding Model | nomic-embed-text |
| Infrastructure | Docker, Docker Compose |
| Package Manager | pnpm |

## Getting Started

### Prerequisites

- Node.js
- pnpm
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

The database is configured to use PostgreSQL with pgvector.

### 4. Configure environment variables

Configure the environment variables required by the API and frontend.

Example API configuration:

```env
DATABASE_URL=postgresql://supportai:supportai_dev@localhost:5432/supportai
```

Example frontend configuration:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Use your actual local configuration values.

### 5. Install the Ollama models

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

Run the Drizzle migration scripts configured in the API workspace.

### 7. Start the applications

Run the development scripts configured in the API and frontend workspaces.

Open the frontend in your browser once both applications are running.

## Project Structure

```text
supportAI/
├── apps/
│   ├── api/
│   │   └── src/
│   │       ├── agents/
│   │       ├── chat/
│   │       ├── conversations/
│   │       ├── db/
│   │       ├── embeddings/
│   │       ├── knowledge-sources/
│   │       └── llm/
│   │
│   └── web/
│       └── app/
│           └── agents/
│
├── docker-compose.yml
├── pnpm-workspace.yaml
└── README.md
```

## Engineering Concepts Explored

- End-to-end feature ownership from database schema to UI.
- Modular backend architecture using NestJS.
- REST API design and request validation.
- Relational data modeling and cascading relationships.
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
- [x] RAG-powered chat responses
- [x] Persistent conversations and messages
- [x] Chat interface with source references
- [x] Conversation history and reopening
- [ ] Automatic conversation titles
- [ ] Improved agent chat entry points
- [ ] Automated testing and additional validation
- [ ] Retrieval optimization and advanced RAG techniques
- [ ] Streaming responses
- [ ] Production deployment

## Motivation

SupportAI is a practical project focused on understanding how AI-powered customer support platforms are designed and implemented.

The project explores the complete lifecycle of a RAG application—from knowledge ingestion and vector retrieval to conversational AI and persistent user experiences—while emphasizing maintainable architecture and end-to-end engineering.

---

<p align="center">
  <strong>Built with TypeScript, NestJS, Next.js, PostgreSQL, pgvector, and Ollama.</strong>
</p>
