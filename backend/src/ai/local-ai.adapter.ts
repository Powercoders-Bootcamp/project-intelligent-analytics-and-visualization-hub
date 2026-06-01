import { IAIAdapter, AIResolveInput } from './ai-adapter.interface';

export class LocalAIAdapter implements IAIAdapter {
  async resolve(input: AIResolveInput, schemaSdl: string): Promise<any> {
    console.log(`🤖 Local AI Adaptörü Tetiklendi! Soru: "${input.nl}"`);
    
    return {
      query: `
        query {
          products {
            id
            name
          }
        }
      `
    };
  }
}