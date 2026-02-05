
import { EventEnvelope, PersonaID, SagaLog } from '../../types.ts';
import { EventBridge } from '../eventBridge.ts';
import { AuditProvider } from '../admin/AuditService.ts';

/**
 * 🧠 ANALYTICS SERVICE (TEAM 4 - BĂNG)
 * Chịu trách nhiệm bóc tách sự kiện sang Read-models và tính toán KPI điều hành.
 */
export class AnalyticsService {
  private static instance: AnalyticsService;
  private readonly RM_DAILY_METRICS = 'NATT_OS_RM_DAILY_METRICS';
  private readonly RM_ORDER_ANALYTICS = 'NATT_OS_RM_ORDER_ANALYTICS';
  private readonly RM_GOVERNANCE_KPIS = 'NATT_OS_RM_GOVERNANCE_KPIS';

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  public init() {
    console.log('🧊 [ANALYTICS] BĂNG Node activated. Observing system neural pulses...');
    
    // Subscribe to Core Events
    EventBridge.subscribe('sales.order.created.v1', (e) => this.projectOrderCreated(e));
    EventBridge.subscribe('finance.payment.completed.v1', (e) => this.projectPaymentSuccess(e));
    EventBridge.subscribe('finance.payment.failed.v1', (e) => this.projectPaymentFailure(e));
    EventBridge.subscribe('warehouse.inventory.reserved.v1', (e) => this.projectInventoryAction(e));
    
    // Tự động khởi tạo dữ liệu ngày hiện tại nếu chưa có
    this.ensureDailyMetrics();
  }

  private ensureDailyMetrics() {
    const date = new Date().toISOString().split('T')[0];
    const raw = localStorage.getItem(this.RM_DAILY_METRICS);
    const store = raw ? JSON.parse(raw) : {};
    
    if (!store[date]) {
      store[date] = {
        metric_date: date,
        total_orders: 0,
        total_revenue_vnd: 0,
        orders_confirmed: 0,
        payments_received: 0,
        payments_failed: 0,
        production_efficiency: 0,
        work_orders_created: 0,
        work_orders_completed: 0,
        updated_at: new Date().toISOString()
      };
      localStorage.setItem(this.RM_DAILY_METRICS, JSON.stringify(store));
    }
  }

  private async projectOrderCreated(event: EventEnvelope) {
    const date = event.occurred_at.split('T')[0];
    const { payload } = event;

    // 1. Update Order Read Model
    const ordersRaw = localStorage.getItem(this.RM_ORDER_ANALYTICS);
    const orders = ordersRaw ? JSON.parse(ordersRaw) : {};
    orders[payload.id] = {
      ...payload,
      status: 'PENDING',
      correlation_id: event.trace.correlation_id,
      updated_at: new Date().toISOString()
    };
    localStorage.setItem(this.RM_ORDER_ANALYTICS, JSON.stringify(orders));

    // 2. Update Daily Metrics
    const metricsRaw = localStorage.getItem(this.RM_DAILY_METRICS);
    const metrics = metricsRaw ? JSON.parse(metricsRaw) : {};
    if (metrics[date]) {
      metrics[date].total_orders += 1;
      metrics[date].total_revenue_vnd += (payload.total || 0);
      metrics[date].updated_at = new Date().toISOString();
      localStorage.setItem(this.RM_DAILY_METRICS, JSON.stringify(metrics));
    }

    console.log(`[ANALYTICS] Projected Order ${payload.id} to Read Models.`);
  }

  private async projectPaymentSuccess(event: EventEnvelope) {
    const date = event.occurred_at.split('T')[0];
    const { payload } = event;

    // Update Daily Metrics
    const metricsRaw = localStorage.getItem(this.RM_DAILY_METRICS);
    const metrics = metricsRaw ? JSON.parse(metricsRaw) : {};
    if (metrics[date]) {
      metrics[date].payments_received += 1;
      metrics[date].updated_at = new Date().toISOString();
      localStorage.setItem(this.RM_DAILY_METRICS, JSON.stringify(metrics));
    }
    
    // Update KPI: Tỷ lệ thanh toán
    this.updateKPI('KPI-004', 98); // Giả lập update KPI tỷ lệ thanh toán lên 98%
  }

  private async projectPaymentFailure(event: EventEnvelope) {
    const date = event.occurred_at.split('T')[0];
    const metricsRaw = localStorage.getItem(this.RM_DAILY_METRICS);
    const metrics = metricsRaw ? JSON.parse(metricsRaw) : {};
    if (metrics[date]) {
      metrics[date].payments_failed += 1;
      metrics[date].updated_at = new Date().toISOString();
      localStorage.setItem(this.RM_DAILY_METRICS, JSON.stringify(metrics));
    }
  }

  private async projectInventoryAction(event: EventEnvelope) {
    // Tương tự cho các logic bóc tách kho...
  }

  private updateKPI(id: string, actual: number) {
    const kpisRaw = localStorage.getItem(this.RM_GOVERNANCE_KPIS);
    const kpis = kpisRaw ? JSON.parse(kpisRaw) : {};
    if (kpis[id]) {
      kpis[id].actual_value = actual;
      kpis[id].updated_at = new Date().toISOString();
      localStorage.setItem(this.RM_GOVERNANCE_KPIS, JSON.stringify(kpis));
    }
  }
}

export const AnalyticsEngine = AnalyticsService.getInstance();
