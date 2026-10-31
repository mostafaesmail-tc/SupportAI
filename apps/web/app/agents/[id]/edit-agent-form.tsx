
'use client';

import { useState, type FormEvent } from 'react';
import { updateAgent } from '../../../lib/api';
import type { Agent } from '../../../types/agent';



interface EditAgentFormProps {
  agent: Agent;
  onUpdated: () => void;
}

export default function EditAgentForm({
  agent,
  onUpdated,
}: EditAgentFormProps) {
  const [name, setName] = useState(agent.name);
  const [description, setDescription] = useState(
    agent.description ?? '',
  );
  const [systemPrompt, setSystemPrompt] = useState(
    agent.systemPrompt,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    if (!name.trim() || !systemPrompt.trim()) {
      setError('Name and system prompt are required.');
      return;
    }

    setIsSubmitting(true);

    try {
      await updateAgent(agent.id, {
        name: name.trim(),
        description: description.trim() || null,
        systemPrompt: systemPrompt.trim(),
      });

      setSuccess(true);
      onUpdated();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update agent',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-4 rounded-xl border p-6"
    >
      <h2 className="text-xl font-semibold">Edit agent</h2>

      <div>
        <label htmlFor="edit-name" className="mb-1 block text-sm font-medium">
          Name
        </label>
        <input
          id="edit-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={100}
          required
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label
          htmlFor="edit-description"
          className="mb-1 block text-sm font-medium"
        >
          Description
        </label>
        <input
          id="edit-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label
          htmlFor="edit-prompt"
          className="mb-1 block text-sm font-medium"
        >
          System prompt
        </label>
        <textarea
          id="edit-prompt"
          value={systemPrompt}
          onChange={(event) => setSystemPrompt(event.target.value)}
          required
          rows={5}
          className="w-full rounded-lg border p-3"
        />
      </div>

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {success && (
        <p role="status" className="text-sm text-green-700">
          Agent updated successfully.
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Save changes'}
      </button>
    </form>
  );
}