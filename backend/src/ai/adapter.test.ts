import { describe, it, expect, beforeEach } from '@jest/globals';
import { AIAdapter } from './adapter';
import { LocalAIEngine } from './local-engine';
import { NLQueryRequest } from '../../../shared/types/ai';

describe('AIAdapter Interface & Implementation Tests (US-10)', () => {
  let localEngine: LocalAIEngine;
  let adapter: AIAdapter;
  const mockSchemaSdl = 'type Product { id: ID!, name: String! }';

  beforeEach(() => {
    // Injecting the LocalAIEngine into the AIAdapter (Loose Coupling Strategy)
    localEngine = new LocalAIEngine();
    adapter = new AIAdapter(localEngine);
  });

  it('should successfully resolve a query using the injected LocalAIEngine', async () => {
    const request: NLQueryRequest = {
      nl: 'Show me total sales per product'
    };

    const response = await adapter.resolve(request, mockSchemaSdl);

    // Asserting the response structure and checking that fromCache is false on first hit
    expect(response).toBeDefined();
    expect(response.fromCache).toBe(false);
    expect(response.chartConfig).toBeDefined();
    
    // Buralara 'as any' ekledik ki TypeScript kızmasın
    expect((response.chartConfig as any).type).toBe('bar');
    expect((response.chartConfig as any).data.labels).toContain('Product A');
  });

  it('should serve results from the cryptographic cache on identical subsequent requests', async () => {
    const request: NLQueryRequest = {
      nl: 'Show me total sales per product'
    };

    // First call - goes to the engine
    const firstResponse = await adapter.resolve(request, mockSchemaSdl);
    expect(firstResponse.fromCache).toBe(false);

    // Second call - must hit the cache
    const secondResponse = await adapter.resolve(request, mockSchemaSdl);
    expect(secondResponse.fromCache).toBe(true);
    expect(secondResponse.chartConfig).toEqual(firstResponse.chartConfig);
  });

  it('should clear the cache correctly when clearCache is triggered', async () => {
    const request: NLQueryRequest = {
      nl: 'Show me total sales per product'
    };

    // Cache the first result
    await adapter.resolve(request, mockSchemaSdl);

    // Clear the cache
    adapter.clearCache();

    // Next call should miss the cache because it was cleared
    const responseAfterClear = await adapter.resolve(request, mockSchemaSdl);
    expect(responseAfterClear.fromCache).toBe(false);
  });
});