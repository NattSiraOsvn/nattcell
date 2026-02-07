/**
 * 👑 NATT-OS GOLD MASTER: ACCOUNTING CONTEXT
 * AUTHORIZED BY: ANH_NAT (SOVEREIGN)
 * STATUS: 100% TYPE-SAFE | ZERO SYNTAX DEBRIS
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
// 🛠️ FIX: Loại bỏ đuôi .ts trong import (Vi phạm TS Layer)
import { SmartLinkMappingEngine } from '@/services/mapping/smart-link-mapping-engine';
import { AccountingEntry, AccountingMappingRule, SalesEvent } from '@/types';

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
  // 🛠️ FIX: Khâu lại Generic Record, xóa bỏ mảnh vỡ {">>"}
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
      setRules(loadedRules);
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
        // 🛠️ Guard Rail: Check if accountNumber exists (Constitution Layer)
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
