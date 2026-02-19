import { BaseEvent } from '../../../contracts/events/base-event';
import { AuditPort, AuditRecord } from '../audit-cell/ports/audit.port';

export interface ConfigEntry {
  key: string;
  value: unknown;
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
  private configStore = new Map<string, ConfigEntry>();

  constructor(private readonly auditPort: AuditPort) {}

  async set(
    key: string,
    value: unknown,
    actor: string,
    requiresApproval = false
  ): Promise<void> {
    const existing = this.configStore.get(key);
    const version = existing ? existing.version + 1 : 1;

    const entry: ConfigEntry = {
      key,
      value,
      version,
      createdBy: actor,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      metadata: {
        requiresGatekeeperApproval: requiresApproval,
        auditRequired: true,
        encryptionRequired:
          key.includes("secret") || key.includes("password"),
      },
    };

    const record: AuditRecord = {
      record_id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      actor: { persona_id: "SYSTEM_AUTO", user_id: actor },
      action: "CONFIG_SET",
      scope: { cell: "config-cell", layer: "kernel" },
      payload: { key, version, requiresApproval },
    };

    await this.auditPort.append(record);
    this.configStore.set(key, entry);
    this.emitConfigUpdated(key, version, actor);
  }

  async get(key: string): Promise<ConfigEntry | null> {
    return this.configStore.get(key) ?? null;
  }

  getAll(): ConfigEntry[] {
    return Array.from(this.configStore.values());
  }

  private emitConfigUpdated(key: string, version: number, actor: string) {
    const event: BaseEvent = {
      event_id: `evt_${Date.now()}_${key}`,
      event_type: "config.updated",
      event_version: "1.0.0",
      source_cell: "cell:config",
      source_module: "ConfigService",
      actor: { persona: "SYSTEM", user_id: actor },
      domain: "GOVERNANCE",
      timestamp: Date.now(),
      correlation_id: `config_${key}_${version}`,
      payload: { key, version },
      audit_required: true,
    };
    console.log("📡", event.event_type, event.event_id);
  }
}
