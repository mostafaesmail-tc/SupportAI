
'use client';

import { useEffect, useState } from 'react';
import { getAgents } from '../lib/api';
import type { Agent } from '../types/agent';
import CreateAgentForm from './components/create-agent-form';
import Link from 'next/link';

export default function Home() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    async function loadAgents() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getAgents();
        setAgents(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Something went wrong',
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadAgents();
  }, [refreshToken]);

  return (
    <main className="mx-auto max-w-5xl p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">
          Support AI
        </h1>
        <p className="mt-2 text-gray-600">
          Manage your AI support agents.
        </p>
      </header>
      <CreateAgentForm
        onCreated={() => setRefreshToken((current) => current + 1)}
        />
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Your agents
          </h2>

          <span className="text-sm text-gray-500">
            {agents.length} total
          </span>
        </div>

        {isLoading && (
          <p role="status">Loading agents...</p>
        )}

        {!isLoading && error && (
          <p role="alert" className="text-red-600">
            {error}
          </p>
        )}

        {!isLoading && !error && agents.length === 0 && (
          <p className="rounded-lg border p-6 text-gray-600">
            You haven't created any agents yet.
          </p>
        )}

        {!isLoading && !error && agents.length > 0 && (
          <ul className="grid gap-4 sm:grid-cols-2">
            {agents.map((agent) => (
              <li
              key={agent.id}
              className="rounded-xl border p-5 shadow-sm transition hover:shadow-md"
            >
              <Link href={`/agents/${agent.id}`} className="block">
                <h3 className="text-lg font-semibold">
                  {agent.name}
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  {agent.description || 'No description provided.'}
                </p>

                <p className="mt-4 text-xs text-gray-400">
                  Created {new Date(agent.createdAt).toLocaleDateString()}
                </p>

                <span className="mt-4 inline-block text-sm font-medium">
                  View agent →
                </span>
              </Link>
            </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}