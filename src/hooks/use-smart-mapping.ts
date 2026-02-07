/**
 * 👑 NATT-OS GOLD MASTER: SMART MAPPING HOOK
 * AUTHORIZED BY: ANH_NAT (SOVEREIGN)
 * STATUS: 100% TYPE-SAFE | THE FINAL PIECE
 */

import { useState, useEffect, useCallback } from 'react';
// 🛠️ FIX: Đồng bộ kebab-case với hệ thống (Điều 11)
import { SmartLinkMappingEngine } from '@/services/mapping/smart-link-mapping-engine';
import { AccountingMappingRule, SalesEvent, AccountingEntry, RealTimeUpdate } from '@/types';

export const useSmartMapping = () => {
  const [mappingEngine] = useState(() => SmartLinkMappingEngine.getInstance());
  const [rules, setRules] = useState<AccountingMappingRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [realTimeUpdates, setRealTimeUpdates] = useState<RealTimeUpdate[]>([]);

  // 1. Load danh mục luật từ Engine
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

    // 2. Đăng ký lắng nghe cập nhật (Event Subscription)
    const handleRuleAdded = (rule: AccountingMappingRule) => {
      setRules(prev => [...prev, rule]);
    };

    const handleRuleUpdated = (updatedRule: AccountingMappingRule) => {
      // 🛠️ FIX: Hoàn thiện logic cập nhật luật theo ID
      setRules(prev => prev.map(rule => rule.id === updatedRule.id ? updatedRule : rule));
    };

    mappingEngine.on('ruleAdded', handleRuleAdded);
    mappingEngine.on('ruleUpdated', handleRuleUpdated);

    // Giao thức dọn dẹp ADN sau khi Unmount
    return () => {
      mappingEngine.off('ruleAdded', handleRuleAdded);
      mappingEngine.off('ruleUpdated', handleRuleUpdated);
    };
  }, [mappingEngine]);

  // 3. Hàm thực thi Mapping (Traceable Action)
  const mapEvent = useCallback(async (event: SalesEvent): Promise<AccountingEntry[]> => {
    return await mappingEngine.autoMapSalesEvent(event);
  }, [mappingEngine]);

  return {
    rules,
    isLoading,
    error,
    realTimeUpdates,
    mapEvent,
    refreshRules: () => setRules(mappingEngine.getMappingRules())
  };
};
