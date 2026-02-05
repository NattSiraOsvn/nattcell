
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { SmartLinkMappingEngine } from '../services/mapping/SmartLinkMappingEngine';
/* Fix: Import from ../types to ensure compatibility with engine return types */
import { AccountingEntry, AccountingMappingRule, SalesEvent } from '../types';

interface AccountingContextType {
  entries: AccountingEntry[];
  rules: AccountingMappingRule[];
  isLoading: boolean;
  error: string | null;
  syncStatus: Record<string, any>;
  mapSalesEvent: (event: SalesEvent) => Promise<AccountingEntry[]>;
  addMappingRule: (rule: AccountingMappingRule) => void;
  updateMappingRule: (id: string, updates: Partial<AccountingMappingRule>) => void;
  postEntry: (id: string) => void;
  refreshData: () => Promise<void>;
  clearError: () => void;
  getSummary: () => { totalRevenue: number, totalExpenses: number, pendingCount: number };
}

const AccountingContext = createContext<AccountingContextType | undefined>(undefined);

export const useAccounting = () => {
  const context = useContext(AccountingContext);
  if (!context) {
    throw new Error('useAccounting must be used within an AccountingProvider');
  }
  return context;
};

export const AccountingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<AccountingEntry[]>([]);
  const [rules, setRules] = useState<AccountingMappingRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<Record<string, any>>({});
  
  // Singleton instance
  const mappingEngine = SmartLinkMappingEngine.getInstance();

  useEffect(() => {
    initializeSystem();
    
    // Subscribe to engine events
    const handleEntriesMapped = (data: any) => {
        setEntries(prev => [...data.entries, ...prev]);
    };
    
    const handleRuleAdded = (rule: AccountingMappingRule) => {
        setRules(prev => [...prev, rule]);
    };

    mappingEngine.on('entriesMapped', handleEntriesMapped);
    mappingEngine.on('ruleAdded', handleRuleAdded);

    return () => {
        mappingEngine.removeAllListeners();
    };
  }, []);

  const initializeSystem = async () => {
    try {
      setIsLoading(true);
      const loadedRules = mappingEngine.getMappingRules();
      /* Fix: Assignment now valid because rules state uses types.ts definition */
      setRules(loadedRules);
      // Simulate initial entries loading
      await new Promise(r => setTimeout(r, 500));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const mapSalesEvent = async (event: SalesEvent): Promise<AccountingEntry[]> => {
    try {
      const mappedEntries = await mappingEngine.autoMapSalesEvent(event);
      // Note: mappingEngine emits 'entriesMapped' which updates state, 
      // but we return it here for immediate use if needed.
      return mappedEntries;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const addMappingRule = (rule: AccountingMappingRule) => {
    mappingEngine.addMappingRule(rule);
  };

  const updateMappingRule = (id: string, updates: Partial<AccountingMappingRule>) => {
    mappingEngine.updateMappingRule(id, updates);
    setRules(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const postEntry = (id: string) => {
    setEntries(prev => prev.map(e => 
      e.journalId === id ? { ...e, status: 'POSTED' } : e
    ));
  };

  const refreshData = async (): Promise<void> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setIsLoading(false);
  };

  const clearError = () => setError(null);

  const getSummary = useCallback(() => {
    let totalRevenue = 0;
    let totalExpenses = 0;
    let pendingCount = 0;

    entries.forEach(e => {
      if (e.status !== 'POSTED') pendingCount++;
      e.entries.forEach(line => {
        // 🛠️ Fixed: check if line.accountNumber exists before startsWith check
        if (line.accountNumber && line.accountNumber.startsWith('511')) totalRevenue += line.credit;
        if (line.accountNumber && (line.accountNumber.startsWith('6') || line.accountNumber.startsWith('8'))) totalExpenses += line.debit;
      });
    });

    return { totalRevenue, totalExpenses, pendingCount };
  }, [entries]);

  const value: AccountingContextType = {
    entries,
    rules,
    isLoading,
    error,
    syncStatus,
    mapSalesEvent,
    addMappingRule,
    updateMappingRule,
    postEntry,
    refreshData,
    clearError,
    getSummary
  };

  return (
    <AccountingContext.Provider value={value}>
      {children}
    </AccountingContext.Provider>
  );
};
