
export type KnowledgeSourceStatus =
  | 'pending'
  | 'processing'
  | 'ready'
  | 'failed';

export interface KnowledgeSource {
  id: string;
  agentId: string;
  title: string;
  content: string;
  status: KnowledgeSourceStatus;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateKnowledgeSourceInput {
  title: string;
  content: string;
}