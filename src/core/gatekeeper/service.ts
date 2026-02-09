import { GatekeeperDecision, EmergencyToken, GatekeeperState } from './types';
import { stateRegistry } from '../state';

export class GatekeeperService {
  private static instance: GatekeeperService;
  private state: GatekeeperState;

  private constructor() {
    this.state = {
      identity: 'NATT_SIRAWAT',
      roles: ['GATEKEEPER', 'THIEN'],
      currentCoolingOff: null,
      emergencyTokens: [],
      decisionJournal: [],
      biasChecks: {
        lastFamilyMemoryAccess: 0,
        stressLevel: 'LOW',
        recentDecisions: 0
      }
    };
  }

  static getInstance(): GatekeeperService {
    if (!GatekeeperService.instance) {
      GatekeeperService.instance = new GatekeeperService();
    }
    return GatekeeperService.instance;
  }

  // Critical decision making
  async makeDecision(
    type: GatekeeperDecision['type'],
    resource: string,
    reasoning: string,
    evidence: string[],
    options?: {
      bypassCoolingOff?: boolean;
      emergencyToken?: string;
    }
  ): Promise<{ success: boolean; decisionId?: string; errors: string[] }> {
    
    const errors: string[] = [];

    // 1. Apply cooling-off period for critical decisions
    if (type === 'OVERRIDE' || type === 'EMERGENCY') {
      if (!options?.bypassCoolingOff && !options?.emergencyToken) {
        if (this.state.currentCoolingOff === resource) {
          errors.push('Resource is in cooling-off period');
        } else {
          this.state.currentCoolingOff = resource;
          // Auto-clear after 24h
          setTimeout(() => {
            this.state.currentCoolingOff = null;
          }, 24 * 60 * 60 * 1000);
        }
      }
    }

    // 2. Validate emergency token if provided
    if (options?.emergencyToken) {
      const valid = this.validateEmergencyToken(options.emergencyToken, resource);
      if (!valid) {
        errors.push('Invalid or expired emergency token');
      }
    }

    // 3. Check bias (simplified)
    this.checkBias();

    if (errors.length > 0) {
      return { success: false, errors };
    }

    // Create decision
    const decision: GatekeeperDecision = {
      decisionId: `gk_dec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      resource,
      actor: this.state.identity,
      timestamp: Date.now(),
      reasoning,
      evidence,
      coolingOffApplied: !options?.bypassCoolingOff,
      aiCouncilNotified: await this.notifyAICouncil(resource, type),
      hash: this.hashDecision(resource, type, reasoning)
    };

    this.state.decisionJournal.push(decision);
    this.state.biasChecks.recentDecisions++;

    return { 
      success: true, 
      decisionId: decision.decisionId,
      errors: []
    };
  }

  // State transitions require Gatekeeper approval
  async approveStateTransition(
    targetState: string,
    evidence: string[]
  ): Promise<boolean> {
    const decision = await this.makeDecision(
      'APPROVAL',
      `state-transition:${targetState}`,
      `Approving transition to ${targetState}`,
      evidence
    );

    return decision.success;
  }

  // Emergency actions
  async emergencyLockdown(reason: string): Promise<boolean> {
    // Generate emergency token
    const token = this.generateEmergencyToken('lockdown');
    
    const decision = await this.makeDecision(
      'EMERGENCY',
      'system:lockdown',
      reason,
      ['emergency-detected'],
      { emergencyToken: token }
    );

    return decision.success;
  }

  private validateEmergencyToken(token: string, purpose: string): boolean {
    const now = Date.now();
    const validToken = this.state.emergencyTokens.find(t => 
      t.token === token && 
      t.purpose === purpose &&
      !t.used &&
      t.expires > now
    );

    if (validToken) {
      validToken.used = true;
      return true;
    }
    return false;
  }

  private generateEmergencyToken(purpose: string): string {
    const token = `emg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const hashedToken = btoa(token).slice(0, 32); // Simple hash
    
    this.state.emergencyTokens.push({
      token: hashedToken,
      created: Date.now(),
      expires: Date.now() + (15 * 60 * 1000), // 15 minutes
      purpose,
      used: false
    });

    // Cleanup expired tokens
    this.state.emergencyTokens = this.state.emergencyTokens.filter(
      t => t.expires > Date.now()
    );

    return hashedToken;
  }

  private async notifyAICouncil(resource: string, type: string): Promise<boolean> {
    // In production, this would send to EventBus
    console.log(`📢 AI Council notified: ${type} on ${resource}`);
    return true;
  }

  private hashDecision(resource: string, type: string, reasoning: string): string {
    const data = `${resource}:${type}:${reasoning}:${Date.now()}`;
    return `hash_${btoa(data).slice(0, 32)}`;
  }

  private checkBias(): void {
    const now = Date.now();
    const hoursSinceFamilyMemory = (now - this.state.biasChecks.lastFamilyMemoryAccess) / (1000 * 60 * 60);
    
    if (hoursSinceFamilyMemory < 1 && this.state.biasChecks.recentDecisions > 5) {
      this.state.biasChecks.stressLevel = 'HIGH';
      console.warn('⚠️ Gatekeeper bias check: Recent Family Memory access with multiple decisions');
    }
  }

  getState(): GatekeeperState {
    return JSON.parse(JSON.stringify(this.state));
  }
}
