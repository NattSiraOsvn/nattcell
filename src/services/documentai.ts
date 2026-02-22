// Stub for documentai - will be implemented later
export const documentai = {};

export class Utilities {
  static parse(_data: unknown): unknown { return {}; }
  static format(_data: unknown): string { return ''; }
}

export interface AIScoringConfig {
  threshold?: number;
  model?: string;
  [key: string]: unknown;
}

export interface DetectedContext {
  type?: string;
  confidence?: number;
  data?: unknown;
}
