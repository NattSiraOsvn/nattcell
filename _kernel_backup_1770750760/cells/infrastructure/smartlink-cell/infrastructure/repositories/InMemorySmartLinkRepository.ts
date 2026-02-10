import { SmartLink, LinkType } from '../../domain/entities';
import { SmartLinkRepository } from '../../ports/SmartLinkRepository';

export class InMemorySmartLinkRepository implements SmartLinkRepository {
  private links = new Map<string, SmartLink>();

  async save(link: SmartLink) { this.links.set(link.id, link); }
  async getById(id: string) { return this.links.get(id) || null; }
  async getBySource(sourceType: string, sourceId: string) {
    return Array.from(this.links.values()).filter(l => l.sourceType === sourceType && l.sourceId === sourceId);
  }
  async getByTarget(targetType: string, targetId: string) {
    return Array.from(this.links.values()).filter(l => l.targetType === targetType && l.targetId === targetId);
  }
  async getByType(linkType: LinkType) {
    return Array.from(this.links.values()).filter(l => l.linkType === linkType);
  }
  async delete(id: string) { return this.links.delete(id); }
  async getAll() { return Array.from(this.links.values()); }
}
