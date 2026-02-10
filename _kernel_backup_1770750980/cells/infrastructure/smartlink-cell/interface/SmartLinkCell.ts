import { SmartLinkApplicationService } from '../application/services/SmartLinkApplicationService';
import { InMemorySmartLinkRepository } from '../infrastructure/repositories/InMemorySmartLinkRepository';
import { SmartLinkEventEmitterAdapter } from '../infrastructure/adapters/SmartLinkEventEmitterAdapter';
import { LinkType } from '../domain/entities';

export class SmartLinkCell {
  private service: SmartLinkApplicationService | null = null;

  async initialize(): Promise<void> {
    console.log('[SMARTLINK-CELL] Initializing...');
    const repository = new InMemorySmartLinkRepository();
    const eventEmitter = new SmartLinkEventEmitterAdapter();
    this.service = new SmartLinkApplicationService(repository, eventEmitter);
    console.log('[SMARTLINK-CELL] Initialized successfully');
  }

  async shutdown(): Promise<void> { this.service = null; }

  createLink = (sourceType: string, sourceId: string, targetType: string, targetId: string, linkType: LinkType, createdBy: string) => {
    if (!this.service) throw new Error('SmartLinkCell not initialized');
    return this.service.createLink(sourceType, sourceId, targetType, targetId, linkType, createdBy);
  };

  resolveLinks = (entityType: string, entityId: string, maxDepth?: number) => {
    if (!this.service) throw new Error('SmartLinkCell not initialized');
    return this.service.resolveLinks(entityType, entityId, maxDepth);
  };
}

let instance: SmartLinkCell | null = null;
export const getSmartLinkCell = () => instance || (instance = new SmartLinkCell());
