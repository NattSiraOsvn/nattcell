
/**
 * 📈 AI BEHAVIOR ANALYTICS & PATTERN DETECTION
 * Purpose: Identify Compulsive Fixing Syndrome and Scope Creep
 */

export interface AIAction {
  type: string;
  file: string;
  description: string;
  timestamp: number;
}

export class AIBehaviorAnalytics {
  private static behaviorPatterns = {
    COMPULSIVE_FIXING: {
      indicators: [
        'Files modified without explicit command',
        'Scope creep detected',
        'Unauthorized feature addition',
        'Ignoring standby commands',
        'Excessive file changes in short period'
      ],
      threshold: 3
    }
  };
  
  static analyzeAIActions(aiName: string, actions: AIAction[]) {
    let score = 0;
    
    // Check frequency and scope
    const recentActions = actions.filter(a => Date.now() - a.timestamp < 3600000); // Last hour
    if (recentActions.length > 10) score += 2;

    const modifiedFiles = new Set(actions.map(a => a.file));
    if (modifiedFiles.size > 5) score += 1;

    const riskLevel = score >= 3 ? 'CRITICAL' : score >= 1 ? 'HIGH' : 'LOW';

    return {
      aiName,
      timestamp: new Date().toISOString(),
      score,
      riskLevel,
      recommendation: riskLevel === 'CRITICAL' ? 'IMMEDIATE_QUARANTINE' : 'CONTINUE_MONITORING'
    };
  }
}
