
/**
 * ⚖️ GOVERNANCE ENFORCEMENT ENGINE
 * Validate AI commands theo permission + scope + constitutional rules.
 */
export class GovernanceEnforcementEngine {
  static async validateAICommand(aiId: string, envelope: any, policy: any) {
    // 1) Kiểm tra Command ID
    if (!envelope?.command_id) {
      return { allowed: false, reason: 'NO_COMMAND' };
    }

    // 2) Kiểm tra Identity trong Registry
    const aiConfig = policy.ai_registry[aiId];
    if (!aiConfig) {
      return { allowed: false, reason: 'AI_NOT_REGISTERED' };
    }

    // 3) Kiểm tra ranh giới Shard (Scope Enforcement)
    if (!this.isWithinScope(envelope.target_path, aiConfig.scope_limit)) {
      return { allowed: false, reason: 'SCOPE_VIOLATION' };
    }

    // 4) Kiểm tra Trace Requirements
    const reqFields = policy.trace_requirements.required_fields;
    for (const field of reqFields) {
      if (!envelope[field]) {
        return { allowed: false, reason: 'TRACE_MISSING', details: { missing: field } };
      }
    }

    return { allowed: true, traceId: `trace-${Date.now()}-${Math.random().toString(36).substr(2, 5)}` };
  }

  private static isWithinScope(requestedPath: string, allowedScopes: string[]): boolean {
    if (!requestedPath) return true; // Generic commands
    return allowedScopes.some(scope => {
      const regex = new RegExp('^' + scope.replace(/\*/g, '.*') + '$');
      return regex.test(requestedPath);
    });
  }
}
