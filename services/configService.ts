
import { SystemConfig, FeatureFlag } from '../types';

type ConfigListener = (config: SystemConfig) => void;

class ConfigService {
  private static instance: ConfigService;
  // Fix: Initialized with required commissionRules as per SystemConfig interface
  private config: SystemConfig = {
    vatRate: 0.08,
    lowStockThreshold: 2,
    enableCardPayment: true,
    storeStatus: 'OPEN',
    commissionRules: {
      baseRate: 0.05,
      thresholdAmount: 50000000,
      bonusRate: 0.02
    }
  };

  private flags: FeatureFlag[] = [
    { id: 'f1', name: 'AI_GDB_SCAN', description: 'Bóc tách GĐB bằng Gemini 2.5', enabled: true, rolloutPercentage: 100 },
    { id: 'f2', name: 'BLOCKCHAIN_EXPORT', description: 'Xuất Ledger sang Blockchain Shard', enabled: false, rolloutPercentage: 0 }
  ];

  private listeners: Set<ConfigListener> = new Set();

  static getInstance() {
    if (!ConfigService.instance) ConfigService.instance = new ConfigService();
    return ConfigService.instance;
  }

  getConfig() { return this.config; }
  getFlags() { return this.flags; }

  updateConfig(updates: Partial<SystemConfig>) {
    this.config = { ...this.config, ...updates };
    this.notify();
    console.log('[Config] System Updated:', updates);
  }

  toggleFlag(id: string) {
    this.flags = this.flags.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f);
  }

  subscribe(listener: ConfigListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l(this.config));
  }
}

export const ConfigProvider = ConfigService.getInstance();
