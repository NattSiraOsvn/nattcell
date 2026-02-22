import React from 'react';
export interface DataPoint3DProps {
  value: number;
  label?: string;
  x?: number;
  y?: number;
  z?: number;
  [key: string]: unknown;
}
export function DataPoint3D({ value, label }: DataPoint3DProps) {
  return React.createElement('div', { className: 'data-point-3d' }, label || String(value));
}
