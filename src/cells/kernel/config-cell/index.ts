export { ConfigService } from './config.service';
export type { ConfigEntry } from './config.service';

// Singleton instance
import { ConfigService } from './config.service';
export const configService = ConfigService.getInstance();

// Cell initialization
export function initializeConfigCell(): void {
  console.log('🔧 Config cell initialized');
  // Load initial config from persistence
  // Register with EventBus
  // Setup audit hooks
}
