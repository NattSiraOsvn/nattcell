import { SmartLink, LinkType } from '../domain/entities';

export interface SmartLinkRepository {
  save(link: SmartLink): Promise<void>;
  getById(id: string): Promise<SmartLink | null>;
  getBySource(sourceType: string, sourceId: string): Promise<SmartLink[]>;
  getByTarget(targetType: string, targetId: string): Promise<SmartLink[]>;
  getByType(linkType: LinkType): Promise<SmartLink[]>;
  delete(id: string): Promise<boolean>;
  getAll(): Promise<SmartLink[]>;
}
