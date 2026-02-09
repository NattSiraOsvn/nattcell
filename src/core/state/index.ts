export { ConstitutionalState } from './types';
export { StateRegistryService } from './registry';
export { StateValidator } from './validator';

// Singleton instance for system use
import { StateRegistryService } from './registry';
export const stateRegistry = StateRegistryService.getInstance();
