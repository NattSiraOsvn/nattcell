import { RBACRepository } from '../../ports/RBACRepository';
import { RBACEventEmitter } from '../../ports/RBACEventEmitter';
import { RBACValidationService, AccessCheckResult } from '../../domain/services';

export class CheckAccessUseCase {
  constructor(
    private readonly repository: RBACRepository,
    private readonly eventEmitter: RBACEventEmitter,
    private readonly validationService: RBACValidationService
  ) {}

  async execute(userId: string, resource: string, action: string): Promise<AccessCheckResult> {
    const userRoles = await this.repository.getUserRoles(userId);
    const activeRoles = userRoles.filter(ur => ur.isActive());
    
    const roles = await Promise.all(
      activeRoles.map(ur => this.repository.getRole(ur.roleId))
    );
    const validRoles = roles.filter((r): r is NonNullable<typeof r> => r !== null);

    const result = this.validationService.checkAccess(validRoles, resource, action);
    
    if (!result.allowed) {
      await this.eventEmitter.emitAccessDenied(userId, resource, action);
    }

    return result;
  }
}
