import React from 'react';
interface Props { moduleId?: string; [key: string]: unknown; }
export default function DynamicModuleRenderer({ moduleId }: Props) {
  return React.createElement('div', { className: 'dynamic-module' }, `Module: ${moduleId}`);
}
