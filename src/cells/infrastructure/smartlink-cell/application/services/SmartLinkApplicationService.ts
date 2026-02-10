import { CreateLinkUseCase, ResolveLinkUseCase } from '../use-cases';
import { LinkResolver } from '../../domain/services';
import { SmartLinkRepository } from '../../ports/SmartLinkRepository';
import { SmartLinkEventEmitter } from '../../ports/SmartLinkEventEmitter';
import { LinkType } from '../../domain/entities';

export class SmartLinkApplicationService {
  private readonly createLinkUseCase: CreateLinkUseCase;
  private readonly resolveLinkUseCase: ResolveLinkUseCase;

  constructor(repository: SmartLinkRepository, eventEmitter: SmartLinkEventEmitter) {
    const linkResolver = new LinkResolver();
    this.createLinkUseCase = new CreateLinkUseCase(repository, eventEmitter);
    this.resolveLinkUseCase = new ResolveLinkUseCase(repository, linkResolver);
  }

  createLink = (sourceType: string, sourceId: string, targetType: string, targetId: string, linkType: LinkType, createdBy: string) =>
    this.createLinkUseCase.execute(sourceType, sourceId, targetType, targetId, linkType, createdBy);

  resolveLinks = (entityType: string, entityId: string, maxDepth?: number) =>
    this.resolveLinkUseCase.execute(entityType, entityId, maxDepth);
}
