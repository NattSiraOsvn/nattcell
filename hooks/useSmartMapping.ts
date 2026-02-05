
import { useState, useEffect, useCallback } from 'react';
import { SmartLinkMappingEngine } from '../services/mapping/SmartLinkMappingEngine';
/* Fix: Import from ../types to ensure compatibility with engine return types */
import { AccountingMappingRule, SalesEvent, AccountingEntry, RealTimeUpdate } from '../types';

export const useSmartMapping = () => {
  const [mappingEngine] = useState(() => SmartLinkMappingEngine.getInstance());
  const [rules, setRules] = useState<AccountingMappingRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [realTimeUpdates, setRealTimeUpdates] = useState<RealTimeUpdate[]>([]);

  // Load initial rules
  useEffect(() => {
    const loadRules = () => {
      try {
        const loadedRules = mappingEngine.getMappingRules();
        /* Fix: Assignment now valid because rules state uses types.ts definition */
        setRules(loadedRules);
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    loadRules();

    // Subscribe to rule updates
    const handleRuleAdded = (rule: AccountingMappingRule) => {
      setRules(prev => [...prev, rule]);
    };

    const handleRuleUpdated = (updatedRule: AccountingMappingRule) => {
      setRules(prev => prev.map(rule => 
        rule.id === updatedRule.id ? updatedRule : rule
      ));
    };

    // Subscribe to real-time events
    const handleEntriesMapped = (data: any) => {
      setRealTimeUpdates(prev => [{
        id: Date.now().toString(),
        type: 'ENTRIES_MAPPED',
        timestamp: new Date(),
        data,
        source: 'mappingEngine',
        priority: 'MEDIUM',
        processed: false
      }, ...prev.slice(0, 49)]);
    };

    mappingEngine.on('ruleAdded', handleRuleAdded);
    mappingEngine.on('ruleUpdated', handleRuleUpdated);
    mappingEngine.on('entriesMapped', handleEntriesMapped);

    return () => {
      mappingEngine.removeAllListeners();
    };
  }, [mappingEngine]);

  const mapSalesEvent = useCallback(async (event: SalesEvent): Promise<AccountingEntry[]> => {
    try {
      /* Fix: Return type matches Promise<types.AccountingEntry[]> */
      return await mappingEngine.autoMapSalesEvent(event);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [mappingEngine]);

  const addRule = useCallback((rule: AccountingMappingRule) => {
    mappingEngine.addMappingRule(rule);
  }, [mappingEngine]);

  const updateRule = useCallback((id: string, updates: Partial<AccountingMappingRule>) => {
    mappingEngine.updateMappingRule(id, updates);
  }, [mappingEngine]);

  const clearRealTimeUpdates = useCallback(() => {
    setRealTimeUpdates([]);
  }, []);

  return {
    rules,
    isLoading,
    error,
    realTimeUpdates,
    mapSalesEvent,
    addRule,
    updateRule,
    clearRealTimeUpdates,
    initialized: !isLoading && !error
  };
};
