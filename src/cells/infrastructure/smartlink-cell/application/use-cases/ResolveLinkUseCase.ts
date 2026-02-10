import { SmartLinkRepository } from '../../ports/SmartLinkRepository';
import { LinkResolver } from '../../domain/services';

export class ResolveLinkUseCase {
  constructor(
    private readonly repository: SmartLinkRepository,
    private readonly linkResolver: LinkResolver
  ) {}

  async execute(entityType: string, entityId: string, maxDepth = 3) {
    const allLinks = await this.repository.getAll();
    const startKey = `${entityType}:${entityId}`;
    const resolved = this.linkResolver.resolveLinks(allLinks, startKey, maxDepth);
    return { resolved, totalLinks: resolved.length };
  }
}
