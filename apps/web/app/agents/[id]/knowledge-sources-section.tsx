
'use client';

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from 'react';

import {
  createKnowledgeSource,
  deleteKnowledgeSource,
  getKnowledgeSources,
  processKnowledgeSource,
} from '../../../lib/api';

import type { KnowledgeSource } from '../../../types/knowledge-source';

interface KnowledgeSourcesSectionProps {
  agentId: string;
}

export default function KnowledgeSourcesSection({
  agentId,
}: KnowledgeSourcesSectionProps) {
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadSources = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getKnowledgeSources(agentId);
      setSources(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load knowledge sources',
      );
    } finally {
      setIsLoading(false);
    }
  }, [agentId]);

  useEffect(() => {
    void loadSources();
  }, [loadSources]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      await createKnowledgeSource(agentId, {
        title: title.trim(),
        content: content.trim(),
      });

      setTitle('');
      setContent('');
      setSuccess('Knowledge source added successfully.');

      await loadSources();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create knowledge source',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleProcess(source: KnowledgeSource) {
    setError(null);
    setSuccess(null);
    setProcessingId(source.id);

    try {
      const result = await processKnowledgeSource(
        agentId,
        source.id,
      );

      setSuccess(
        `Source processed successfully. ${result.chunkCount} chunk(s) created.`,
      );

      await loadSources();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to process knowledge source',
      );

      // Refresh to display the latest status, including "failed".
      await loadSources();
    } finally {
      setProcessingId(null);
    }
  }

  async function handleDelete(source: KnowledgeSource) {
    const confirmed = window.confirm(
      `Delete "${source.title}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setError(null);
    setSuccess(null);
    setDeletingId(source.id);

    try {
      await deleteKnowledgeSource(agentId, source.id);

      setSources((current) =>
        current.filter((item) => item.id !== source.id),
      );

      setSuccess('Knowledge source deleted.');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to delete knowledge source',
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="mt-8 space-y-6">
      <div>
        <h2 className="text-xl font-semibold">
          Knowledge sources
        </h2>

        <p className="mt-1 text-sm text-gray-600">
          Add reference material that your agent can prepare for
          answering customer questions.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border p-6"
      >
        <h3 className="font-semibold">Add text source</h3>

        <div>
          <label
            htmlFor="source-title"
            className="mb-1 block text-sm font-medium"
          >
            Title
          </label>

          <input
            id="source-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={256}
            required
            className="w-full rounded-lg border p-3"
            placeholder="Refund policy"
          />
        </div>

        <div>
          <label
            htmlFor="source-content"
            className="mb-1 block text-sm font-medium"
          >
            Content
          </label>

          <textarea
            id="source-content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            required
            rows={6}
            className="w-full rounded-lg border p-3"
            placeholder="Enter the information your agent should know..."
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="text-sm text-green-700">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || processingId !== null}
          className="rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
        >
          {isSubmitting ? 'Adding...' : 'Add source'}
        </button>
      </form>

      <div>
        <h3 className="mb-4 font-semibold">
          Saved sources ({sources.length})
        </h3>

        {isLoading && (
          <p role="status">Loading sources...</p>
        )}

        {!isLoading && !error && sources.length === 0 && (
          <p className="rounded-lg border p-5 text-sm text-gray-600">
            No knowledge sources yet. Add some text above.
          </p>
        )}

        {!isLoading && sources.length > 0 && (
          <ul className="space-y-4">
            {sources.map((source) => (
              <li
                key={source.id}
                className="rounded-xl border p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold">
                      {source.title}
                    </h4>

                    <p className="mt-2 text-sm">
                      Status:{' '}
                      <span className="font-medium">
                        {source.status}
                      </span>
                    </p>

                    {source.status === 'failed' &&
                      source.errorMessage && (
                        <p className="mt-1 text-sm text-red-600">
                          {source.errorMessage}
                        </p>
                      )}

                    <p className="mt-2 whitespace-pre-wrap break-words text-sm text-gray-600">
                      {source.content}
                    </p>

                    <p className="mt-3 text-xs text-gray-400">
                      Added{' '}
                      {new Date(
                        source.createdAt,
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-3 sm:flex-row sm:items-center">
                    <button
                      type="button"
                      onClick={() => void handleProcess(source)}
                      disabled={
                        processingId !== null ||
                        deletingId !== null
                      }
                      className="text-sm font-medium text-blue-700 disabled:opacity-50"
                    >
                      {processingId === source.id
                        ? 'Processing...'
                        : source.status === 'ready'
                          ? 'Reprocess'
                          : 'Process source'}
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleDelete(source)}
                      disabled={
                        deletingId !== null ||
                        processingId !== null
                      }
                      className="text-sm text-red-700 disabled:opacity-50"
                    >
                      {deletingId === source.id
                        ? 'Deleting...'
                        : 'Delete'}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}