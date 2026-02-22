import React from 'react';
interface UIRuntimeProviderProps {
  children: React.ReactNode;
  role?: string;
  [key: string]: unknown;
}
export function UIRuntimeProvider({ children }: UIRuntimeProviderProps) {
  return React.createElement(React.Fragment, null, children);
}
