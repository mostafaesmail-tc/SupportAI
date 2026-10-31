
'use client';

import { useState, type FormEvent } from 'react';
import { createAgent } from '../../lib/api';

interface CreateAgentFormProps {
  onCreated: () => void;
}

export default function CreateAgentForm({
  onCreated,
}: CreateAgentFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await createAgent({
        name: name.trim(),
        description: description.trim() || undefined,
        systemPrompt: systemPrompt.trim(),
      });

      setName('');
      setDescription('');
      setSystemPrompt('');
      onCreated();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create agent',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 space-y-4 rounded-xl border p-6"
    >
      <h2 className="text-xl font-semibold">Create an agent</h2>

      <div>
        <label htmlFor="agent-name" className="mb-1 block text-sm font-medium">
          Name
        </label>
        <input
          id="agent-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={100}
          required
          className="w-full rounded-lg border p-3"
          placeholder="Customer Support Assistant"
        />
      </div>

      <div>
        <label
          htmlFor="agent-description"
          className="mb-1 block text-sm font-medium"
        >
          Description
        </label>
        <input
          id="agent-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="w-full rounded-lg border p-3"
          placeholder="Helps customers with common questions"
        />
      </div>

      <div>
        <label
          htmlFor="agent-prompt"
          className="mb-1 block text-sm font-medium"
        >
          System prompt
        </label>
        <textarea
          id="agent-prompt"
          value={systemPrompt}
          onChange={(event) => setSystemPrompt(event.target.value)}
          required
          rows={4}
          className="w-full rounded-lg border p-3"
          placeholder="Define how this agent should behave..."
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
      >
        {isSubmitting ? 'Creating...' : 'Create agent'}
      </button>
    </form>
  );
}