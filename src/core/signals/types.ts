
import React from 'react';

export type OverlayType = 'LENS' | 'DRAWER' | 'VOID' | 'NONE';

export interface QuantumSignal {
  id: string;
  source: string; // 'ACCOUNTING', 'SALES', etc.
  type: 'INTENT' | 'ALERT' | 'OPPORTUNITY';
  intensity: number; // 0.0 - 1.0
  content: any; // Flexible payload
  timestamp: number;
}

export interface ManifestationConfig {
  mode: OverlayType;
  title?: string;
  component?: React.ReactNode;
  contextData?: any;
}
