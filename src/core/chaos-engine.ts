
export class ChaosEngine {
  private enabled: boolean = false;

  constructor(env: string) {
    // 🛡️ KCS MANDATORY: Disabled in Production
    if (env === 'prod') {
      this.enabled = false;
      console.log('[CHAOS_GUARD] Chaos Engine permanently disabled for Production.');
    }
  }

  isEnabled() { return this.enabled; }
}
