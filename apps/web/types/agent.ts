
export interface Agent {
  id: string;
  name: string;
  description: string | null;
  systemPrompt: string;
  createdAt: string;
  updatedAt: string;
}