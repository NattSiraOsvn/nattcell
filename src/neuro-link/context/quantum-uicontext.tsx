
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { OverlayType, ManifestationConfig } from '@/core/signals/types';

interface QuantumContextType {
  overlayConfig: ManifestationConfig;
  openLens: (content: ReactNode, title?: string) => void;
  openDrawer: (content: ReactNode, title?: string) => void;
  enterVoid: (content: ReactNode) => void;
  collapseWave: () => void; // Close/Resolve
}

const QuantumContext = createContext<QuantumContextType | undefined>(undefined);

export const QuantumUIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ManifestationConfig>({ mode: 'NONE' });

  const openLens = (content: ReactNode, title?: string) => {
    setConfig({ mode: 'LENS', component: content, title });
  };

  const openDrawer = (content: ReactNode, title?: string) => {
    setConfig({ mode: 'DRAWER', component: content, title });
  };

  const enterVoid = (content: ReactNode) => {
    setConfig({ mode: 'VOID', component: content });
  };

  const collapseWave = () => {
    setConfig({ mode: 'NONE' });
  };

  return (
    <QuantumContext.Provider value={{ overlayConfig: config, openLens, openDrawer, enterVoid, collapseWave }}>
      {children}
    </QuantumContext.Provider>
  );
};

export const useQuantumUI = () => {
  const context = useContext(QuantumContext);
  if (!context) {
    throw new Error('useQuantumUI must be used within a QuantumUIProvider');
  }
  return context;
};
