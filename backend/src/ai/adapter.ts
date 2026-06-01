import { createHash } from 'crypto';
import { AIEngine, NLQueryRequest, NLQueryResponse } from '../../../shared/types/ai';
import { ChartConfig } from '../../../shared/types/chart';

/**
 * Technical specification interface requested in US-10
 * to allow swapping the underlying AI provider dynamically.
 */
export interface IAIAdapter {
  resolve(request: NLQueryRequest, schemaSdl: string): Promise<NLQueryResponse>;
  clearCache(): void;
}

/**
 * AIAdapter manages core AI resolution flow with an injected AI engine
 * and cryptographic result caching.
 */
export class AIAdapter implements IAIAdapter {
  private cache = new Map<string, ChartConfig>();

  // Engine is injected — swap Gemini/GPT for local by passing a different engine implementation
  constructor(private engine: AIEngine) {}

  async resolve(request: NLQueryRequest, schemaSdl: string): Promise<NLQueryResponse> {
    // Cache key = hash of question + schema so different schemas produce different results
    const cacheKey = createHash('sha1')
      .update(request.nl + schemaSdl)
      .digest('hex');

    const cached = this.cache.get(cacheKey);
    if (cached) {
      return { chartConfig: cached, fromCache: true };
    }

    const chartConfig = await this.engine.resolve(request.nl, schemaSdl);

    this.cache.set(cacheKey, chartConfig);

    return { chartConfig, fromCache: false };
  }

  // Allows Dev B to clear the cache if the schema changes
  clearCache(): void {
    this.cache.clear();
  }
}