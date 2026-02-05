
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AccountMapRule } from '../types';

interface MappingContextType {
  rules: AccountMapRule[];
  addRule: (rule: AccountMapRule) => void;
  activeRuleCount: number;
}

const MappingContext = createContext<MappingContextType | undefined>(undefined);

export const MappingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rules, setRules] = useState<AccountMapRule[]>([
    { id: 'DEFAULT_REV', sourceType: 'SALES', conditionField: 'ALL', conditionValue: 'ALL', debitAccount: '131', creditAccount: '511', name: 'Doanh thu mặc định' }
  ]);

  const addRule = (rule: AccountMapRule) => {
    setRules(prev => [...prev, rule]);
  };

  return (
    <MappingContext.Provider value={{ rules, addRule, activeRuleCount: rules.length }}>
      {children}
    </MappingContext.Provider>
  );
};

export const useMapping = () => {
  const context = useContext(MappingContext);
  if (!context) {
    throw new Error('useMapping must be used within a MappingProvider');
  }
  return context;
};
