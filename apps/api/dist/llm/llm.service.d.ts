export interface OllamaChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export interface OllamaChatResponse {
    message: OllamaChatMessage;
    done: boolean;
}
export declare class LlmService {
    private readonly ollamaUrl;
    private readonly model;
    generateResponse(messages: OllamaChatMessage[]): Promise<string>;
}
