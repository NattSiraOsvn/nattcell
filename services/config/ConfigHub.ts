
import { SystemConfig } from '../../types';

type ConfigListener = (config: SystemConfig) => void;

class ConfigHubService {
  private static instance: ConfigHubService;
  private config: SystemConfig = {
    vatRate: 0.08,
    lowStockThreshold: 10,
    enableCardPayment: true,
    storeStatus: 'OPEN',
    commissionRules: {
      baseRate: 0.02,
      thresholdAmount: 50000000,
      bonusRate: 0.03
    }
  };
  private listeners: Set<ConfigListener> = new Set();

  static getInstance() {
    if (!ConfigHubService.instance) ConfigHubService.instance = new ConfigHubService();
    return ConfigHubService.instance;
  }

  public getConfigStream(callback: ConfigListener) {
    this.listeners.add(callback);
    callback(this.config);
    return () => this.listeners.delete(callback);
  }

  public getCurrentConfig(): SystemConfig {
    return { ...this.config };
  }

  public async updateConfig(newConfig: Partial<SystemConfig>, adminUser: string) {
    const updated = { ...this.config, ...newConfig };
    
    if (updated.vatRate < 0 || updated.vatRate > 1) {
      throw new Error("VAT không hợp lệ");
    }

    this.config = updated;
    this.notify();
    
    console.log(`[ConfigHub] Updated by ${adminUser}:`, newConfig);
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.config));
  }
}

export const ConfigHub = ConfigHubService.getInstance();
