
'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';

interface ChatInterfaceProps {
  agentId: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: {
    sourceId: string;
    sourceTitle: string;
    chunkIndex: number;
  }[];
}

interface ChatResponse {
  conversationId: string;
  answer: string;
  sources: ChatMessage['sources'];
}

interface Conversation {
  id: string;
  agentId: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ChatInterface({
  agentId,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the latest message.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Load conversation history whenever agentId changes.
  useEffect(() => {
    async function loadConversations() {
      setIsLoadingHistory(true);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/agents/${agentId}/conversations`,
        );

        if (!response.ok) {
          throw new Error('Failed to load conversations');
        }

        const data: Conversation[] = await response.json();
        setConversations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingHistory(false);
      }
    }

    loadConversations();
  }, [agentId]);

  // Load a selected conversation.
  async function loadConversation(id: string) {
    if (isLoading) return;

    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/agents/${agentId}/conversations/${id}/messages`,
      );

      if (!response.ok) {
        throw new Error('Failed to load conversation messages');
      }

      const data: ChatMessage[] = await response.json();

      setMessages(data);
      setConversationId(id);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not load conversation.',
      );
    }
  }

  // Send a message.
  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: trimmedQuestion,
    };

    setMessages((previous) => [...previous, userMessage]);
    setQuestion('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/agents/${agentId}/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: trimmedQuestion,
            ...(conversationId && { conversationId }),
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to send message.');
      }

      const data: ChatResponse = await response.json();

      setConversationId(data.conversationId);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.answer,
        sources: data.sources,
      };

      setMessages((previous) => [...previous, assistantMessage]);

      // Refresh conversation history.
      const historyResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/agents/${agentId}/conversations`,
      );

      if (historyResponse.ok) {
        const history: Conversation[] = await historyResponse.json();
        setConversations(history);
      }

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Start a new conversation.
  function startNewConversation() {
    if (isLoading) return;

    setMessages([]);
    setConversationId(null);
    setQuestion('');
    setError(null);
  }

  return (
    <div className="flex h-screen p-6 gap-6">

      {/* LEFT SIDEBAR */}
      <aside className="w-64 shrink-0 border-r pr-4 overflow-y-auto">

        <button
          onClick={startNewConversation}
          disabled={isLoading}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          + New conversation
        </button>

        <h2 className="mt-6 mb-3 text-sm font-semibold text-gray-500">
          HISTORY
        </h2>

        {isLoadingHistory && (
          <p className="text-sm text-gray-500">
            Loading...
          </p>
        )}

        {!isLoadingHistory && conversations.length === 0 && (
          <p className="text-sm text-gray-500">
            No conversations yet.
          </p>
        )}

        <div className="space-y-2">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => loadConversation(conversation.id)}
              disabled={isLoading}
              className={`w-full rounded-lg p-3 text-left text-sm hover:bg-gray-100 ${
                conversationId === conversation.id
                  ? 'bg-blue-50 text-blue-700'
                  : ''
              }`}
            >
              <p className="truncate font-medium">
                {conversation.title || 'New conversation'}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {new Date(conversation.updatedAt).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>

      </aside>

      {/* RIGHT CHAT AREA */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* HEADER */}
        <header className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold">
              SupportAI Chat
            </h1>

            <p className="text-sm text-gray-500">
              Agent ID: {agentId}
            </p>
          </div>

          <button
            onClick={startNewConversation}
            disabled={isLoading}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100 disabled:opacity-50"
          >
            New conversation
          </button>
        </header>

        {/* CHAT MESSAGES */}
        <main className="flex-1 overflow-y-auto py-6 space-y-4">

          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-16">
              <h2 className="text-xl font-semibold">
                How can I help you?
              </h2>

              <p className="mt-2">
                Ask a question about this agent's knowledge base.
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user'
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="whitespace-pre-wrap">
                  {message.content}
                </p>

                {/* SOURCES */}
                {message.role === 'assistant' &&
                  message.sources &&
                  message.sources.length > 0 && (
                    <div className="mt-4 border-t border-gray-300 pt-3">

                      <p className="text-xs font-semibold text-gray-500 mb-2">
                        SOURCES
                      </p>

                      <ul className="space-y-1">
                        {message.sources.map((source, sourceIndex) => (
                          <li
                            key={`${source.sourceId}-${source.chunkIndex}-${sourceIndex}`}
                            className="text-xs text-gray-600"
                          >
                            📄 {source.sourceTitle} — Chunk{' '}
                            {source.chunkIndex}
                          </li>
                        ))}
                      </ul>

                    </div>
                  )}

              </div>
            </div>
          ))}

          {/* LOADING INDICATOR */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-gray-100 px-4 py-3 text-gray-500">
                Thinking...
              </div>
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />

        </main>

        {/* MESSAGE INPUT */}
        <form
          onSubmit={sendMessage}
          className="flex gap-3 border-t pt-4"
        >
          <input
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask a question..."
            disabled={isLoading}
            maxLength={2000}
            className="flex-1 rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </form>

      </div>
    </div>
  );
}
