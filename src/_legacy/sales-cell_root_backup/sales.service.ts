
import { EventBridgeProvider } from '../event-cell/event-bridge.service';
import { SmartLinkEnvelope } from '../shared-kernel/shared.types';

class SalesService {
  private static instance: SalesService;
  private orders: any[] = [];

  static getInstance() {
    if (!SalesService.instance) SalesService.instance = new SalesService();
    return SalesService.instance;
  }

  // Added: createOrder method for SalesTerminal component
  async createOrder(data: any) {
    const newOrder = { ...data, id: `ORD-${Date.now()}`, status: 'PENDING' };
    this.orders.unshift(newOrder);
    
    await EventBridgeProvider.publish('sales.order.created.v1', {
      event_name: 'sales.order.created.v1',
      event_version: '1.0',
      event_id: crypto.randomUUID(),
      occurred_at: new Date().toISOString(),
      producer: 'cell:sales',
      trace: { correlation_id: crypto.randomUUID(), causation_id: null, trace_id: crypto.randomUUID() },
      tenant: { org_id: 'tam-luxury', workspace_id: 'default' },
      payload: newOrder
    });
    return newOrder;
  }

  // Added: getRevenueStats for Dashboard component
  async getRevenueStats() {
    return this.orders.reduce((sum, o) => sum + (o.total || 0), 0);
  }

  async handleIntent(envelope: SmartLinkEnvelope) {
    const { action } = envelope.intent;
    if (action === 'CreateOrder') {
      return await this.createOrder(envelope.payload);
    }
    if (action === 'GetRevenueStats') {
        return await this.getRevenueStats();
    }
  }
}

export const SalesProvider = SalesService.getInstance();
