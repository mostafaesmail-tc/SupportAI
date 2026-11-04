var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
let LlmService = class LlmService {
    ollamaUrl = 'http://localhost:11434';
    model = 'qwen2.5:3b';
    async generateResponse(messages) {
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
        const data = await response.json();
        return data.message.content;
    }
};
LlmService = __decorate([
    Injectable()
], LlmService);
export { LlmService };
//# sourceMappingURL=llm.service.js.map