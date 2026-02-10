/**
 * UserRole Entity - Maps users to roles
 */

export interface UserRoleProps {
  userId: string;
  roleId: string;
  assignedAt: Date;
  assignedBy: string;
  expiresAt?: Date;
}

export class UserRole {
  private readonly props: UserRoleProps;

  private constructor(props: UserRoleProps) {
    this.props = props;
  }

  static create(userId: string, roleId: string, assignedBy: string, expiresAt?: Date): UserRole {
    return new UserRole({
      userId,
      roleId,
      assignedAt: new Date(),
      assignedBy,
      expiresAt,
    });
  }

  get userId(): string { return this.props.userId; }
  get roleId(): string { return this.props.roleId; }
  get assignedAt(): Date { return this.props.assignedAt; }
  get assignedBy(): string { return this.props.assignedBy; }
  get expiresAt(): Date | undefined { return this.props.expiresAt; }

  isExpired(): boolean {
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
  }

  isActive(): boolean {
    return !this.isExpired();
  }

  toJSON(): Record<string, unknown> {
    return {
      userId: this.userId,
      roleId: this.roleId,
      assignedAt: this.props.assignedAt.toISOString(),
      assignedBy: this.assignedBy,
      expiresAt: this.expiresAt?.toISOString(),
    };
  }
}
