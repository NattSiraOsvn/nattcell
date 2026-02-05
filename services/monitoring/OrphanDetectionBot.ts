
import { EventEnvelope, PersonaID } from '../../types.ts';
import { NotifyBus } from '../notificationService.ts';
import { ShardingService } from '../blockchainService.ts';

/**
 * 🤖 ORPHAN DETECTION BOT
 * Giám sát tính nhất quán của chuỗi Causation (Nguồn gốc sự kiện).
 */
export class OrphanDetectionBot {
  private static instance: OrphanDetectionBot;
  private readonly ORPHAN_THRESHOLD_MS = 300000; // 5 Phút

  public static getInstance() {
    if (!OrphanDetectionBot.instance) OrphanDetectionBot.instance = new OrphanDetectionBot();
    return OrphanDetectionBot.instance;
  }

  /**
   * Quét và phát hiện các sự kiện không có nguồn gốc (Orphans)
   */
  public async scanForOrphans(events: EventEnvelope[]) {
    const now = Date.now();
    const orphans = events.filter(e => {
        // Một sự kiện là Orphan nếu nó không phải root (USER_INIT) 
        // và không có causation_id hợp lệ trong chuỗi.
        if (e.event_name.includes('INIT')) return false;
        
        const hasCausation = !!e.trace.causation_id;
        const isOldEnough = (now - new Date(e.occurred_at).getTime()) > this.ORPHAN_THRESHOLD_MS;

        return !hasCausation && isOldEnough;
    });

    if (orphans.length > 0) {
        this.triggerAlert(orphans);
    }
  }

  private triggerAlert(orphans: EventEnvelope[]) {
    NotifyBus.push({
      type: 'RISK',
      title: 'ORPHAN EVENTS DETECTED',
      content: `Phát hiện ${orphans.length} sự kiện không rõ nguồn gốc. Khả năng rò rỉ dữ liệu hoặc xâm nhập Terminal.`,
      persona: PersonaID.KRIS,
      priority: 'HIGH'
    });

    console.error(`[ORPHAN-BOT] 🚨 Detected ${orphans.length} orphaned events!`, orphans);
  }
}

export const OrphanBot = OrphanDetectionBot.getInstance();
