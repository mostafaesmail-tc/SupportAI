
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteAgent } from '../../../lib/api';

interface DeleteAgentButtonProps {
  agentId: string;
}

export default function DeleteAgentButton({
  agentId,
}: DeleteAgentButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(
      'Are you sure you want to delete this agent? This action cannot be undone.',
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deleteAgent(agentId);
      router.push('/');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to delete agent',
      );
      setIsDeleting(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="rounded-lg border border-red-300 px-5 py-3 text-red-700 disabled:opacity-50"
      >
        {isDeleting ? 'Deleting...' : 'Delete agent'}
      </button>

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}