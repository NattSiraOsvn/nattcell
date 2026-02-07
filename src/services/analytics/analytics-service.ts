
import { EventEnvelope, PersonaID } from '@/types';
import { EventBridge } from '@/eventbridge';
import { AuditProvider } from '@/admin/auditservice';

/**
 * 🧠 ANALYTICS SERVICE (TEAM 4 - BĂNG)
 * Chịu trách nhiệm bóc tách sự kiện sang Read-models.
 */
export class AnalyticsService {
  private static instance: AnalyticsService;

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  public init() {
    console.log('[ANALYTICS] BĂNG is observing the Event Bus...');
    
    // Đăng ký nhận mọi sự kiện quan trọng để cập nhật Dashboard
    EventBridge.subscribe('sales.order.created.v1', (e) => this.handleOrderUpdate(e));
    EventBridge.subscribe('finance.payment.completed.v1', (e) => this.handleFinanceUpdate(e));
    EventBridge.subscribe('admin.role.assigned.v1', (e) => this.handleSecurityUpdate(e));
  }

  private async handleOrderUpdate(event: EventEnvelope) {
    await AuditProvider.logAction('ANALYTICS', 'ORDER_READ_MODEL_UPDATE', { id: event.payload.id }, 'analytics-service', event.event_id);
    console.log(`[ANALYTICS] Updated Order Read-Model for: ${event.payload.id}`);
  }

  private async handleFinanceUpdate(event: EventEnvelope) {
    console.log(`[ANALYTICS] Re-calculating Financial KPIs after payment: ${event.payload.payment_id}`);
  }

  private async handleSecurityUpdate(event: EventEnvelope) {
    console.warn(`[ANALYTICS] Security Signal detected. Correlation: ${event.trace.correlation_id}`);
  }
}

export const AnalyticsEngine = AnalyticsService.getInstance();
