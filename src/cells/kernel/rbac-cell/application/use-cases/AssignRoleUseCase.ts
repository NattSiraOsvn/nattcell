import { UserRole } from '../../domain/entities';
import { RBACRepository } from '../../ports/RBACRepository';
import { RBACEventEmitter } from '../../ports/RBACEventEmitter';

export class AssignRoleUseCase {
  constructor(
    private readonly repository: RBACRepository,
    private readonly eventEmitter: RBACEventEmitter
  ) {}

  async execute(userId: string, roleId: string, assignedBy: string, expiresAt?: Date) {
    const role = await this.repository.getRole(roleId);
    if (!role) throw new Error(`Role not found: ${roleId}`);

    const userRole = UserRole.create(userId, roleId, assignedBy, expiresAt);
    await this.repository.assignRole(userRole);
    await this.eventEmitter.emitRoleAssigned(userId, roleId, assignedBy);

    return { userRole, role };
  }
}
