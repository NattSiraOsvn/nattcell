import { EventEnvelope, SagaLog } from '../shared-kernel/shared.types';

export class EventBridgeService {
  private static instance: EventBridgeService;
  private handlers: Map<string, Function[]> = new Map();
  private sagaLedger: SagaLog[] = [];

  static getInstance() {
    if (!EventBridgeService.instance) EventBridgeService.instance = new EventBridgeService();
    return EventBridgeService.instance;
  }

  /**
   * Returns a list of all registered event types currently being handled by the bridge.
   */
  public getRegistry() {
    return Array.from(this.handlers.keys());
  }

  public subscribe(eventType: string, handler: Function) {
    if (!this.handlers.has(eventType)) this.handlers.set(eventType, []);
    this.handlers.get(eventType)?.push(handler);
    return () => {
      const h = this.handlers.get(eventType);
      if (h) this.handlers.set(eventType, h.filter(x => x !== handler));
    };
  }

  public async publish(eventType: string, event: EventEnvelope) {
    console.log(`[CELL:EVENT] 📡 Publishing: ${eventType}`, event);
    
    this.sagaLedger.unshift({
      id: `SAGA-${Date.now()}`,
      correlation_id: event.trace.correlation_id,
      step: eventType,
      status: 'SUCCESS',
      details: `From: ${event.producer}`,
      timestamp: Date.now()
    });

    const h = this.handlers.get(eventType) || [];
    h.forEach(fn => fn(event));
  }

  // Updated: getSagaHistory now accepts an optional correlationId
  public getSagaHistory(correlationId?: string) { 
    if (correlationId) {
        return this.sagaLedger.filter(l => l.correlation_id === correlationId);
    }
    return this.sagaLedger; 
  }
}

export const EventBridgeProvider = EventBridgeService.getInstance();