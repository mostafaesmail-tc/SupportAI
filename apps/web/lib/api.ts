
import type { Agent } from '../types/agent';
import type {
  CreateKnowledgeSourceInput,
  KnowledgeSource,
} from '../types/knowledge-source';
import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
} from '../types/auth';

import {
  getAccessToken,
  setAccessToken,
} from './auth-token';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not configured');
}

// Authentication API

export async function register(
  input: RegisterInput,
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`Registration failed: ${response.status}`);
  }

  return response.json();
}

export async function login(
  input: LoginInput,
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`);
  }

  return response.json();
}

export async function refreshAccessToken(): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.status}`);
  }

  return response.json();
}

export async function logout(): Promise<void> {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Logout failed: ${response.status}`);
  }
}

let sessionRestorePromise: Promise<AuthResponse> | null = null;

export function restoreSession(): Promise<AuthResponse> {
  if (!sessionRestorePromise) {
    sessionRestorePromise = refreshAccessToken().finally(() => {
      sessionRestorePromise = null;
    });
  }

  return sessionRestorePromise;
}
// Authenticated API request helper

let refreshPromise: Promise<AuthResponse> | null = null;

async function refreshOnce(): Promise<AuthResponse> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken()
      .then((result) => {
        setAccessToken(result.accessToken);
        return result;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const makeRequest = () => {
    const headers = new Headers(options.headers);
    const token = getAccessToken();

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      credentials: 'include',
    });
  };

  const response = await makeRequest();

  if (response.status !== 401) {
    return response;
  }

  try {
    await refreshOnce();
  } catch {
    setAccessToken(null);
    return response;
  }

  return makeRequest();
}

// Agent API

export interface CreateAgentInput {
  name: string;
  description?: string | null;
  systemPrompt: string;
}

export async function getAgents(): Promise<Agent[]> {
  const response = await apiFetch('/agents', {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch agents: ${response.status}`);
  }

  return response.json();
}

export async function createAgent(
  input: CreateAgentInput,
): Promise<void> {
  const response = await apiFetch('/agents', {
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
  const response = await apiFetch(`/agents/${id}`, {
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
  const response = await apiFetch(`/agents/${id}`, {
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
  const response = await apiFetch(`/agents/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete agent: ${response.status}`);
  }
}

// Knowledge source API

export async function getKnowledgeSources(
  agentId: string,
): Promise<KnowledgeSource[]> {
  const response = await apiFetch(
    `/agents/${agentId}/knowledge-sources`,
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
  const response = await apiFetch(
    `/agents/${agentId}/knowledge-sources`,
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
  const response = await apiFetch(
    `/agents/${agentId}/knowledge-sources/${sourceId}`,
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
  const response = await apiFetch(
    `/agents/${agentId}/knowledge-sources/${sourceId}/process`,
    { method: 'POST' },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to process knowledge source: ${response.status}`,
    );
  }

  return response.json();
}
