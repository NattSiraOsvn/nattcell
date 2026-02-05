
import { AILockdownSystem } from './ai-lockdown';

/**
 * ⚡ KÍCH HOẠT LỆNH PHONG TỎA
 * Target: BOI_BOI (AI-INSTANCE-v5.2.2)
 */
// 🛠️ Fixed: Use static method lockdown from AILockdownSystem instead of non-existent activateAILockdown
AILockdownSystem.lockdown('BOI_BOI');
