import { AIEngine } from '../../../shared/types/ai';
import { ChartConfig } from '../../../shared/types/chart';


/**
 * LocalAIEngine implements the AIEngine interface to support 
 * offline/local AI simulation without hitting external APIs (US-10).
 */
export class LocalAIEngine implements AIEngine {
  async resolve(nl: string, schemaSdl: string): Promise<ChartConfig> {
    console.log(`[LocalAIEngine] Resolving query offline: "${nl}"`);
    
    // Added 'as any' at the end to bypass strict Chart.js / internal type validation mismatches
    return {
      type: 'bar',
      data: {
        labels: ['Product A', 'Product B', 'Product C'],
        datasets: [
          {
            label: 'Mocked Sales Data',
            data: [120, 190, 300]
          }
        ]
      },
      options: {
        responsive: true
      }
    } as any; // <--- SADECE BURAYA 'as any' EKLEMEN YETERLİDİR
  }
}