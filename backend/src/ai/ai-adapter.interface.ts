export interface AIResolveInput {
  nl: string; 
}

export interface IAIAdapter {
  resolve(input: AIResolveInput, schemaSdl: string): Promise<any>;
}