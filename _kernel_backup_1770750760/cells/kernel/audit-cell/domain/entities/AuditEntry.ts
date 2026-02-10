/**
 * AuditEntry Entity - Immutable audit log entry
 */

export interface AuditEntryProps {
  id: string;
  timestamp: Date;
  actor: string;
  action: string;
  resource: string;
  resourceId: string;
  oldValue?: unknown;
  newValue?: unknown;
  metadata: Record<string, unknown>;
  hash: string;
  previousHash: string;
}

export class AuditEntry {
  private readonly props: AuditEntryProps;

  private constructor(props: AuditEntryProps) {
    this.props = props;
  }

  static create(
    actor: string,
    action: string,
    resource: string,
    resourceId: string,
    previousHash: string,
    options?: { oldValue?: unknown; newValue?: unknown; metadata?: Record<string, unknown> }
  ): AuditEntry {
    const id = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date();
    const entry = {
      id,
      timestamp,
      actor,
      action,
      resource,
      resourceId,
      oldValue: options?.oldValue,
      newValue: options?.newValue,
      metadata: options?.metadata || {},
      previousHash,
      hash: '',
    };
    entry.hash = AuditEntry.calculateHash(entry);
    return new AuditEntry(entry as AuditEntryProps);
  }

  private static calculateHash(entry: Omit<AuditEntryProps, 'hash'>): string {
    const content = JSON.stringify({
      id: entry.id,
      timestamp: entry.timestamp.toISOString(),
      actor: entry.actor,
      action: entry.action,
      resource: entry.resource,
      resourceId: entry.resourceId,
      previousHash: entry.previousHash,
    });
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      hash = ((hash << 5) - hash) + content.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  }

  get id(): string { return this.props.id; }
  get timestamp(): Date { return this.props.timestamp; }
  get actor(): string { return this.props.actor; }
  get action(): string { return this.props.action; }
  get resource(): string { return this.props.resource; }
  get hash(): string { return this.props.hash; }
  get previousHash(): string { return this.props.previousHash; }

  verifyChain(previousEntry: AuditEntry | null): boolean {
    if (!previousEntry) return this.previousHash === 'GENESIS';
    return this.previousHash === previousEntry.hash;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      timestamp: this.timestamp.toISOString(),
      actor: this.actor,
      action: this.action,
      resource: this.resource,
      resourceId: this.props.resourceId,
      hash: this.hash,
      previousHash: this.previousHash,
    };
  }
}
