
import { SmartLinkCore } from '../../core/SmartLinkEngine';

export class SmartLinkMappingEngine {
  public static getInstance() {
    return SmartLinkCore; // Directly return the unified core instance
  }
}
