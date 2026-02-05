
import { useState, useEffect, useCallback } from 'react';
// Fix: Corrected relative import path
import { SmartLinkMappingEngine } from '../services/mapping/SmartLinkMappingEngine';
// Fix: Corrected relative import path to root types.ts
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