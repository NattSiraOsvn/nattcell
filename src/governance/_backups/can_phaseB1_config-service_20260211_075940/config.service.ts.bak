import { BaseEvent } from '../../../contracts/events/base-event';
import { AuditService } from '../../infrastructure/audit-cell/audit.service';

export interface ConfigEntry {
  key: string;
  value: any;
  version: number;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  metadata: {
    requiresGatekeeperApproval: boolean;
    auditRequired: boolean;
    encryptionRequired: boolean;
  };
}

export class ConfigService {
  private static instance: ConfigService;
  private configStore: Map<string, ConfigEntry> = new Map();
  private auditService: AuditService;

  private constructor() {
    this.auditService = AuditService.getInstance();
  }

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  async set(key: string, value: any, actor: string, requiresApproval = false): Promise<void> {
    const existing = this.configStore.get(key);
    const newVersion = existing ? existing.version + 1 : 1;
    
    const entry: ConfigEntry = {
      key,
      value,
      version: newVersion,
      createdBy: actor,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      metadata: {
        requiresGatekeeperApproval: requiresApproval,
        auditRequired: true,
        encryptionRequired: key.includes('secret') || key.includes('password')
      }
    };

    // Audit before setting
    await this.auditService.log({
      action: 'config.set',
      resource: `config:${key}`,
      actorId: actor,
      details: { key, version: newVersion, requiresApproval }
    });

    this.configStore.set(key, entry);

    // Emit event
    this.emitConfigUpdated(key, newVersion, actor);
  }

  async get(key: string): Promise<ConfigEntry | null> {
    const entry = this.configStore.get(key);
    
    if (entry) {
      await this.auditService.log({
        action: 'config.get',
        resource: `config:${key}`,
        actorId: 'system',
        details: { key }
      });
    }
    
    return entry || null;
  }

  async getAll(): Promise<ConfigEntry[]> {
    return Array.from(this.configStore.values());
  }

  private emitConfigUpdated(key: string, version: number, actor: string) {
    const event: BaseEvent = {
      event_id: `evt_${Date.now()}_config_update_${key}`,
      event_type: 'config.updated',
      event_version: '1.0.0',
      source_cell: 'cell:config',
      source_module: 'AdminConfigHub',
      actor: { persona: 'SYSTEM', user_id: actor },
      domain: 'GOVERNANCE',
      timestamp: Date.now(),
      correlation_id: `config_${key}_${version}`,
      payload: { key, version, updatedBy: actor },
      audit_required: true
    };
    
    // In production, this would go to EventBus
    console.log('📡 Event emitted:', event.event_type, event.event_id);
  }
}
