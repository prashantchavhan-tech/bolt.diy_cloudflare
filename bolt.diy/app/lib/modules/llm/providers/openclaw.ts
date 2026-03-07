
import { BaseProvider } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';

export default class OpenClawProvider extends BaseProvider {
  name = 'OpenClaw';
  getApiKeyLink = 'http://localhost:18789';

  config = {
    apiTokenKey: 'OPENCLAW_API_KEY',
  };

  staticModels: ModelInfo[] = [
    {
      name: 'openclaw-agent',
      label: 'OpenClaw Agent',
      provider: 'OpenClaw',
      maxTokenAllowed: 128000,
      maxCompletionTokens: 8192,
    },
  ];

  async getDynamicModels(): Promise<ModelInfo[]> {
    return this.staticModels;
  }

  getModelInstance(options: {
    model: string;
    serverEnv: Env;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    // This is a placeholder as the actual call is intercepted in stream-text.ts
    // but we need to return a valid LanguageModelV1 for the type system.
    return {
        specificationVersion: 'v1',
        provider: 'OpenClaw',
        modelId: options.model,
        doGenerate: async () => ({
            text: 'OpenClaw integration active',
            finishReason: 'stop',
            usage: { promptTokens: 0, completionTokens: 0 },
            rawCall: { rawPrompt: null, rawSettings: {} },
        }),
        doStream: async () => {
            throw new Error('OpenClaw provider should be handled by runAgent in stream-text.ts');
        },
    } as unknown as LanguageModelV1;
  }
}
