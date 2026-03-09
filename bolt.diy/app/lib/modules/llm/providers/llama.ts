import { BaseProvider, getOpenAILikeModel } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';
import { logger } from '~/utils/logger';

interface OpenAIModelsResponse {
  data: Array<{ id: string }>;
}

export default class LlamaProvider extends BaseProvider {
  name = 'Llama';
  getApiKeyLink = 'https://developers.llama.com/';

  config = {
    baseUrlKey: 'LLAMA_API_BASE_URL',
    apiTokenKey: 'LLAMA_API_KEY',
  };

  staticModels: ModelInfo[] = [
    {
      name: 'Llama-4-Scout-17B-16E-Instruct-FP8',
      label: 'Llama 4 Scout',
      provider: 'Llama',
      maxTokenAllowed: 10000000,
    },
    {
      name: 'Llama-4-Maverick-17B-128E-Instruct-FP8',
      label: 'Llama 4 Maverick',
      provider: 'Llama',
      maxTokenAllowed: 1000000,
    },
  ];

  async getDynamicModels(
    apiKeys?: Record<string, string>,
    settings?: IProviderSetting,
    serverEnv: Record<string, string> = {},
  ): Promise<ModelInfo[]> {
    const { baseUrl: fetchBaseUrl, apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: settings,
      serverEnv,
      defaultBaseUrlKey: 'LLAMA_API_BASE_URL',
      defaultApiTokenKey: 'LLAMA_API_KEY',
    });
    const baseUrl = fetchBaseUrl || 'https://api.llama.com/compat/v1';

    if (!apiKey) {
      return [];
    }

    try {
      const response = await fetch(`${baseUrl}/models`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        signal: this.createTimeoutSignal(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const res = (await response.json()) as OpenAIModelsResponse;

      return res.data.map((model) => ({
        name: model.id,
        label: model.id,
        provider: this.name,
        maxTokenAllowed: 131072,
      }));
    } catch (error) {
      logger.info(`${this.name}: Could not fetch /models endpoint, falling back to static models`, error);
      return [];
    }
  }

  getModelInstance(options: {
    model: string;
    serverEnv: Env;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    const { model, serverEnv, apiKeys, providerSettings } = options;
    const envRecord = this.convertEnvToRecord(serverEnv);

    const { baseUrl: fetchBaseUrl, apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: providerSettings?.[this.name],
      serverEnv: envRecord,
      defaultBaseUrlKey: 'LLAMA_API_BASE_URL',
      defaultApiTokenKey: 'LLAMA_API_KEY',
    });
    const baseUrl = fetchBaseUrl || 'https://api.llama.com/compat/v1';

    if (!apiKey) {
      throw new Error(`Missing configuration for ${this.name} provider`);
    }

    return getOpenAILikeModel(baseUrl, apiKey, model);
  }
}
