import { RBACRepository } from '../../ports/RBACRepository';
import { RBACEventEmitter } from '../../ports/RBACEventEmitter';

export class RevokeRoleUseCase {
  constructor(
    private readonly repository: RBACRepository,
    private readonly eventEmitter: RBACEventEmitter
  ) {}

  async execute(userId: string, roleId: string, revokedBy: string) {
    const success = await this.repository.revokeRole(userId, roleId);
    if (success) {
      await this.eventEmitter.emitRoleRevoked(userId, roleId, revokedBy);
    }
    return { success };
  }
}
