/**
 * SmartLink Entity - Intelligent entity linking across modules
 */

export type LinkType = 'REFERENCE' | 'DEPENDENCY' | 'RELATED' | 'PARENT_CHILD' | 'BIDIRECTIONAL';

export interface SmartLinkProps {
  id: string;
  sourceType: string;
  sourceId: string;
  targetType: string;
  targetId: string;
  linkType: LinkType;
  metadata: Record<string, unknown>;
  strength: number; // 0-1, how strong the relationship
  createdAt: Date;
  createdBy: string;
}

export class SmartLink {
  private readonly props: SmartLinkProps;

  private constructor(props: SmartLinkProps) { this.props = props; }

  static create(
    sourceType: string, sourceId: string,
    targetType: string, targetId: string,
    linkType: LinkType, createdBy: string,
    metadata: Record<string, unknown> = {},
    strength = 1.0
  ): SmartLink {
    return new SmartLink({
      id: `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sourceType, sourceId, targetType, targetId,
      linkType, metadata, strength,
      createdAt: new Date(),
      createdBy,
    });
  }

  get id(): string { return this.props.id; }
  get sourceType(): string { return this.props.sourceType; }
  get sourceId(): string { return this.props.sourceId; }
  get targetType(): string { return this.props.targetType; }
  get targetId(): string { return this.props.targetId; }
  get linkType(): LinkType { return this.props.linkType; }
  get strength(): number { return this.props.strength; }

  get sourceKey(): string { return `${this.sourceType}:${this.sourceId}`; }
  get targetKey(): string { return `${this.targetType}:${this.targetId}`; }

  updateStrength(newStrength: number): SmartLink {
    return new SmartLink({ ...this.props, strength: Math.max(0, Math.min(1, newStrength)) });
  }

  toJSON() { return { ...this.props, createdAt: this.props.createdAt.toISOString() }; }
}
