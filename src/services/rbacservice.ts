import { UserRole } from '../types';

export class RBACProvider {
  static getRoles(): UserRole[] {
    return Object.values(UserRole) as UserRole[];
  }
}
