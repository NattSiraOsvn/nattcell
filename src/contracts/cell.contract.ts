/**
 * CELL CONTRACT - NATT-OS NattCell ADN
 * Điều 14: Cấu trúc 7 lớp ADN bắt buộc
 */

import { Domain, BaseEvent } from './base-event.contract';

export enum CellLayer {
  KERNEL = 0,
  INFRASTRUCTURE = 1,
  BUSINESS = 2,
  PRESENTATION = 3,
}

export enum CellCapability {
  CONFIG_READ = 'config:read',
  CONFIG_WRITE = 'config:write',
  RBAC_MANAGE = 'rbac:manage',
  AUDIT_READ = 'audit:read',
  AUDIT_WRITE = 'audit:write',
  MONITOR_READ = 'monitor:read',
  SECURITY_ENFORCE = 'security:enforce',
  DATA_READ = 'data:read',
  DATA_WRITE = 'data:write',
}

export type ConstitutionalState =
  | 'STATE_1'  // CONSTITUTIONAL_FOUNDATION_ESTABLISHED
  | 'STATE_2'  // KERNEL_CORE_BARE_METAL
  | 'STATE_3'  // CELL_RUNTIME_OPERATIONAL
  | 'STATE_4'  // MEMORY_TRUTH_AUDIT_ACTIVE
  | 'STATE_5'  // OMEGA_RECOVERY_ENABLED
  | 'STATE_6'  // GOVERNANCE_LAW_ENGINE_ACTIVE
  | 'STATE_7'; // AI_HUMAN_CO_EXISTENCE

export interface CellManifest {
  // Identity (Layer 1)
  cell_id: string;
  cell_name: string;
  module_id?: string;
  version: string;
  domain: Domain;
  
  // Architecture
  layer: CellLayer;
  
  // Capability (Layer 2)
  capabilities: CellCapability[];
  
  // SmartLink (Layer 6)
  emits: string[];
  authoritative_events?: string[];
  subscribes: string[];
  min_event_versions?: Record<string, string>;
  dependencies: string[];
  
  // Boundary (Layer 3)
  immune_integration: {
    audit_enabled: boolean;
    raw_access: boolean;
    gatekeeper_bypass: boolean;
  };
  
  // Lifecycle (Layer 7)
  constitutional_state: ConstitutionalState;
  min_state_required: ConstitutionalState;
}

export interface CellHealth {
  cell_id: string;
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY' | 'OFFLINE';
  last_heartbeat: number;
  error_count: number;
  uptime_seconds: number;
}

export interface ICell {
  readonly manifest: CellManifest;
  
  initialize(): Promise<void>;
  shutdown(): Promise<void>;
  getHealth(): Promise<CellHealth>;
  
  handleEvent(event: BaseEvent): Promise<void>;
  canHandle(eventType: string): boolean;
}

export abstract class BaseCell implements ICell {
  abstract readonly manifest: CellManifest;
  
  protected initialized = false;
  protected startTime = 0;
  protected errorCount = 0;
  
  async initialize(): Promise<void> {
    this.startTime = Date.now();
    this.initialized = true;
  }
  
  async shutdown(): Promise<void> {
    this.initialized = false;
  }
  
  async getHealth(): Promise<CellHealth> {
    return {
      cell_id: this.manifest.cell_id,
      status: this.initialized ? 'HEALTHY' : 'OFFLINE',
      last_heartbeat: Date.now(),
      error_count: this.errorCount,
      uptime_seconds: this.initialized ? Math.floor((Date.now() - this.startTime) / 1000) : 0,
    };
  }
  
  canHandle(eventType: string): boolean {
    return this.manifest.subscribes.some(pattern => {
      if (pattern.endsWith('.*')) {
        const prefix = pattern.slice(0, -2);
        return eventType.startsWith(prefix);
      }
      return pattern === eventType;
    });
  }
  
  abstract handleEvent(event: BaseEvent): Promise<void>;
}
