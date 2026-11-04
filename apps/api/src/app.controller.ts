import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service.js';
import { LlmService } from './llm/llm.service.js';
import { OllamaChatMessage } from './llm/llm.service.js';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly llmService: LlmService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('test-llm')
  async generateResponse(messages: OllamaChatMessage[]): Promise<string> {
    // const messages: OllamaChatMessage[] = [
    //   {
    //     role: 'user',
    //     content: 'Hello! How are you?',
    //   },
    // ];

    return await this.llmService.generateResponse(messages);
  }
}
