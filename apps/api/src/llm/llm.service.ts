import { Injectable } from '@nestjs/common';

export interface OllamaChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OllamaChatResponse {
  message: OllamaChatMessage;
  done: boolean;
}

@Injectable()
export class LlmService {
  private readonly ollamaUrl = 'http://localhost:11434';
  private readonly model = 'qwen2.5:3b';

  async generateResponse(messages: OllamaChatMessage[]): Promise<string> {
    const response = await fetch(`${this.ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed with status ${response.status}`);
    }

    const data: OllamaChatResponse = await response.json();
    return data.message.content;
  }
}