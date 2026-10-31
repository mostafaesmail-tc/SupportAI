
'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAgent } from '../../../lib/api';
import type { Agent } from '../../../types/agent';
import EditAgentForm from './edit-agent-form';
import DeleteAgentButton from './delete-agent-button';
import KnowledgeSourcesSection from './knowledge-sources-section';

export default function AgentDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshToken, setRefreshToken] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAgent() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getAgent(id);

        if (!cancelled) {
          setAgent(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load agent',
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadAgent();

    return () => {
      cancelled = true;
    };
  }, [id, refreshToken]);

  if (isLoading) {
    return <main className="p-8">Loading agent...</main>;
  }

  if (error || !agent) {
    return (
      <main className="mx-auto max-w-3xl p-8">
        <p role="alert" className="text-red-600">
          {error ?? 'Agent not found'}
        </p>
        <Link href="/" className="mt-4 inline-block underline">
          Back to dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <Link href="/" className="text-sm text-gray-600 hover:underline">
        ← Back to dashboard
      </Link>

      <header className="my-8">
        <h1 className="text-3xl font-bold">{agent.name}</h1>
        <p className="mt-2 text-gray-600">
          {agent.description || 'No description provided.'}
        </p>
      </header>

      <section className="rounded-xl border p-6">
        <h2 className="text-lg font-semibold">System prompt</h2>
        <EditAgentForm
          agent={agent}
          onUpdated={() => setRefreshToken((current) => current + 1)}
        />
        <KnowledgeSourcesSection agentId={agent.id} />
        
        <DeleteAgentButton agentId={agent.id} />


        <p className="mt-3 whitespace-pre-wrap text-sm leading-6">
          {agent.systemPrompt}
        </p>
      </section>

      <section className="mt-6 text-sm text-gray-500">
        <p>ID: {agent.id}</p>
        <p className="mt-1">
          Created: {new Date(agent.createdAt).toLocaleString()}
        </p>
        <p className="mt-1">
          Last updated: {new Date(agent.updatedAt).toLocaleString()}
        </p>
      </section>
    </main>
  );
}