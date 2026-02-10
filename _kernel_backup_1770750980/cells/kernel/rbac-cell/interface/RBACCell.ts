/**
 * RBACCell - Kernel Cell #2
 * Role-Based Access Control Management
 */

import { Role } from '../domain/entities';
import { RBACApplicationService } from '../application/services/RBACApplicationService';
import { InMemoryRBACRepository } from '../infrastructure/repositories/InMemoryRBACRepository';
import { RBACEventEmitterAdapter } from '../infrastructure/adapters/RBACEventEmitterAdapter';

export class RBACCell {
  private service: RBACApplicationService | null = null;
  private repository: InMemoryRBACRepository | null = null;

  async initialize(): Promise<void> {
    console.log('[RBAC-CELL] Initializing...');
    this.repository = new InMemoryRBACRepository();
    const eventEmitter = new RBACEventEmitterAdapter();
    this.service = new RBACApplicationService(this.repository, eventEmitter);
    await this.loadDefaultRoles();
    console.log('[RBAC-CELL] Initialized successfully');
  }

  async shutdown(): Promise<void> {
    console.log('[RBAC-CELL] Shutting down...');
    this.service = null;
    this.repository = null;
  }

  checkAccess = (userId: string, resource: string, action: string) => {
    this.ensureInitialized();
    return this.service!.checkAccess(userId, resource, action);
  };

  assignRole = (userId: string, roleId: string, assignedBy: string, expiresAt?: Date) => {
    this.ensureInitialized();
    return this.service!.assignRole(userId, roleId, assignedBy, expiresAt);
  };

  revokeRole = (userId: string, roleId: string, revokedBy: string) => {
    this.ensureInitialized();
    return this.service!.revokeRole(userId, roleId, revokedBy);
  };

  private ensureInitialized() {
    if (!this.service) throw new Error('RBACCell not initialized');
  }

  private async loadDefaultRoles() {
    const defaultRoles = [
      Role.create('role:admin', 'Administrator', 'Full system access', ['*'], true),
      Role.create('role:operator', 'Operator', 'Operational access', ['config:read', 'monitor:*', 'audit:read'], true),
      Role.create('role:viewer', 'Viewer', 'Read-only access', ['*:read'], true),
      Role.create('role:ai:kim', 'AI Kim', 'Chief Governance Enforcer', ['governance:*', 'constitution:*'], true),
      Role.create('role:ai:bang', 'AI Băng', 'Data Steward', ['data:*', 'process:*', 'quality:*'], true),
      Role.create('role:ai:boiboi', 'AI Bối Bối', 'Strategic Advisor', ['strategy:*', 'analysis:*'], true),
    ];
    for (const role of defaultRoles) {
      await this.repository!.saveRole(role);
    }
  }
}

let instance: RBACCell | null = null;
export const getRBACCell = () => instance || (instance = new RBACCell());
