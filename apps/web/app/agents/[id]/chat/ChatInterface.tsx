
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

export default function ChatInterface({
  agentId,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

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
      // Replace this fetch call with your centralized API service method.
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

  function startNewConversation() {
    if (isLoading) return;

    setMessages([]);
    setConversationId(null);
    setQuestion('');
    setError(null);
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-6">
      <header className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">SupportAI Chat</h1>
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

        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-gray-100 px-4 py-3 text-gray-500">
              Thinking...
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

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
  );
}
