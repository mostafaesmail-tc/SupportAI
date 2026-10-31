
import type { Agent } from '../types/agent';
import type { CreateKnowledgeSourceInput, KnowledgeSource } from '../types/knowledge-source';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not configured');
}

export async function getAgents(): Promise<Agent[]> {
  const response = await fetch(`${API_URL}/agents`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch agents: ${response.status}`);
  }

  return response.json();
}


export interface CreateAgentInput {
  name: string;
  description?: string | null;
  systemPrompt: string;
}

export async function createAgent(
  input: CreateAgentInput,
): Promise<void> {
  const response = await fetch(`${API_URL}/agents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`Failed to create agent: ${response.status}`);
  }
}


export async function getAgent(id: string): Promise<Agent> {
  const response = await fetch(`${API_URL}/agents/${id}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? 'Agent not found'
        : `Failed to fetch agent: ${response.status}`,
    );
  }

  return response.json();
}

export async function updateAgent(
  id: string,
  input: Partial<CreateAgentInput>,
): Promise<void> {
  const response = await fetch(`${API_URL}/agents/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`Failed to update agent: ${response.status}`);
  }
}

export async function deleteAgent(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/agents/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete agent: ${response.status}`);
  }
}

export async function getKnowledgeSources(
  agentId: string,
): Promise<KnowledgeSource[]> {
  const response = await fetch(
    `${API_URL}/agents/${agentId}/knowledge-sources`,
    { cache: 'no-store' },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch knowledge sources: ${response.status}`,
    );
  }

  return response.json();
}

export async function createKnowledgeSource(
  agentId: string,
  input: CreateKnowledgeSourceInput,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/agents/${agentId}/knowledge-sources`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to create knowledge source: ${response.status}`,
    );
  }
}

export async function deleteKnowledgeSource(
  agentId: string,
  sourceId: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/agents/${agentId}/knowledge-sources/${sourceId}`,
    { method: 'DELETE' },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to delete knowledge source: ${response.status}`,
    );
  }
}



export interface ProcessKnowledgeSourceResult {
  knowledgeSourceId: string;
  status: 'ready';
  chunkCount: number;
}

export async function processKnowledgeSource(
  agentId: string,
  sourceId: string,
): Promise<ProcessKnowledgeSourceResult> {
  const response = await fetch(
    `${API_URL}/agents/${agentId}/knowledge-sources/${sourceId}/process`,
    { method: 'POST' },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to process knowledge source: ${response.status}`,
    );
  }

  return response.json();
}