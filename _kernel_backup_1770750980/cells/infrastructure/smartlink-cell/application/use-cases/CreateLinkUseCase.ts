import { SmartLink, LinkType } from '../../domain/entities';
import { SmartLinkRepository } from '../../ports/SmartLinkRepository';
import { SmartLinkEventEmitter } from '../../ports/SmartLinkEventEmitter';

export class CreateLinkUseCase {
  constructor(
    private readonly repository: SmartLinkRepository,
    private readonly eventEmitter: SmartLinkEventEmitter
  ) {}

  async execute(
    sourceType: string, sourceId: string,
    targetType: string, targetId: string,
    linkType: LinkType, createdBy: string
  ) {
    const link = SmartLink.create(sourceType, sourceId, targetType, targetId, linkType, createdBy);
    await this.repository.save(link);
    await this.eventEmitter.emitLinkCreated(link.id, link.sourceKey, link.targetKey);
    return { link };
  }
}
