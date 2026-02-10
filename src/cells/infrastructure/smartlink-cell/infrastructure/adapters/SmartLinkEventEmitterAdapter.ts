import { SmartLinkEventEmitter } from '../../ports/SmartLinkEventEmitter';

export class SmartLinkEventEmitterAdapter implements SmartLinkEventEmitter {
  async emitLinkCreated(linkId: string, sourceKey: string, targetKey: string) {
    console.log('[SMARTLINK-CELL] smartlink.created:', { linkId, sourceKey, targetKey });
  }
  async emitLinkDeleted(linkId: string) {
    console.log('[SMARTLINK-CELL] smartlink.deleted:', { linkId });
  }
  async emitLinkAccessed(linkId: string) {
    console.log('[SMARTLINK-CELL] smartlink.accessed:', { linkId });
  }
}
