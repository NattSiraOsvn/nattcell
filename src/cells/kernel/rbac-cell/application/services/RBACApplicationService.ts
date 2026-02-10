import { CheckAccessUseCase, AssignRoleUseCase, RevokeRoleUseCase } from '../use-cases';
import { RBACValidationService } from '../../domain/services';
import { RBACRepository } from '../../ports/RBACRepository';
import { RBACEventEmitter } from '../../ports/RBACEventEmitter';

export class RBACApplicationService {
  private readonly checkAccessUseCase: CheckAccessUseCase;
  private readonly assignRoleUseCase: AssignRoleUseCase;
  private readonly revokeRoleUseCase: RevokeRoleUseCase;

  constructor(repository: RBACRepository, eventEmitter: RBACEventEmitter) {
    const validationService = new RBACValidationService();
    this.checkAccessUseCase = new CheckAccessUseCase(repository, eventEmitter, validationService);
    this.assignRoleUseCase = new AssignRoleUseCase(repository, eventEmitter);
    this.revokeRoleUseCase = new RevokeRoleUseCase(repository, eventEmitter);
  }

  checkAccess = (userId: string, resource: string, action: string) => 
    this.checkAccessUseCase.execute(userId, resource, action);
  
  assignRole = (userId: string, roleId: string, assignedBy: string, expiresAt?: Date) => 
    this.assignRoleUseCase.execute(userId, roleId, assignedBy, expiresAt);
  
  revokeRole = (userId: string, roleId: string, revokedBy: string) => 
    this.revokeRoleUseCase.execute(userId, roleId, revokedBy);
}
