import { AppService } from './app.service.js';
import { LlmService } from './llm/llm.service.js';
import { OllamaChatMessage } from './llm/llm.service.js';
export declare class AppController {
    private readonly appService;
    private readonly llmService;
    constructor(appService: AppService, llmService: LlmService);
    getHello(): string;
    generateResponse(messages: OllamaChatMessage[]): Promise<string>;
}
