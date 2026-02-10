/**
 * Role Entity - Core RBAC role definition
 */

export interface RoleProps {
  id: string;
  name: string;
  description: string;
  permissions: Set<string>;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Role {
  private readonly props: RoleProps;

  private constructor(props: RoleProps) {
    this.props = props;
  }

  static create(id: string, name: string, description: string, permissions: string[] = [], isSystem = false): Role {
    const now = new Date();
    return new Role({
      id,
      name,
      description,
      permissions: new Set(permissions),
      isSystem,
      createdAt: now,
      updatedAt: now,
    });
  }

  get id(): string { return this.props.id; }
  get name(): string { return this.props.name; }
  get description(): string { return this.props.description; }
  get permissions(): Set<string> { return new Set(this.props.permissions); }
  get isSystem(): boolean { return this.props.isSystem; }

  hasPermission(permission: string): boolean {
    return this.props.permissions.has(permission) || this.props.permissions.has('*');
  }

  addPermission(permission: string): Role {
    if (this.isSystem) throw new Error('Cannot modify system role');
    const newPermissions = new Set(this.props.permissions);
    newPermissions.add(permission);
    return new Role({ ...this.props, permissions: newPermissions, updatedAt: new Date() });
  }

  removePermission(permission: string): Role {
    if (this.isSystem) throw new Error('Cannot modify system role');
    const newPermissions = new Set(this.props.permissions);
    newPermissions.delete(permission);
    return new Role({ ...this.props, permissions: newPermissions, updatedAt: new Date() });
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      permissions: Array.from(this.permissions),
      isSystem: this.isSystem,
      createdAt: this.props.createdAt.toISOString(),
      updatedAt: this.props.updatedAt.toISOString(),
    };
  }
}
