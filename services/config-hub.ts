import { SystemConfig } from '../types';

type ConfigListener = (config: SystemConfig) => void;

class ConfigHubService {
  private static instance: ConfigHubService;
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
  private listeners: Set<ConfigListener> = new Set();

  static getInstance() {
    if (!ConfigHubService.instance) ConfigHubService.instance = new ConfigHubService();
    return ConfigHubService.instance;
  }

  getCurrentConfig(): SystemConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<SystemConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.notify();
    console.log('[ConfigHub] System Parameters Updated:', this.config);
  }

  // 🛠️ Fixed: Ensure return type is a cleanup function or void, avoiding unintentional return of Set.delete result
  subscribe(listener: ConfigListener) {
    this.listeners.add(listener);
    listener(this.config);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.config));
  }
}

export const ConfigHub = ConfigHubService.getInstance();
