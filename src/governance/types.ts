// Governance types - UserRole exported as VALUE (not type) for computed property use
export { UserRole } from '../types';
export type { UserPosition } from '../types';

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}
