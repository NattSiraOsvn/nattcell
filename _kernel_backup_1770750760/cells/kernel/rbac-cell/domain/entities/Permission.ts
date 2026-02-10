/**
 * Permission Entity - Granular access control
 */

export interface PermissionProps {
  id: string;
  resource: string;
  action: string;
  conditions?: Record<string, unknown>;
  createdAt: Date;
}

export class Permission {
  private readonly props: PermissionProps;

  private constructor(props: PermissionProps) {
    this.props = props;
  }

  static create(resource: string, action: string, conditions?: Record<string, unknown>): Permission {
    return new Permission({
      id: `${resource}:${action}`,
      resource,
      action,
      conditions,
      createdAt: new Date(),
    });
  }

  get id(): string { return this.props.id; }
  get resource(): string { return this.props.resource; }
  get action(): string { return this.props.action; }
  get conditions(): Record<string, unknown> | undefined { return this.props.conditions; }

  matches(resource: string, action: string): boolean {
    const resourceMatch = this.resource === '*' || this.resource === resource;
    const actionMatch = this.action === '*' || this.action === action;
    return resourceMatch && actionMatch;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      resource: this.resource,
      action: this.action,
      conditions: this.conditions,
    };
  }
}
