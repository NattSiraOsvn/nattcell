/**
 * Warehouse Event Emitter Port
 * Cell: warehouse-cell | Layer: Ports
 */
export interface IWarehouseEventEmitter {
  emit(eventType: string, payload: Record<string, unknown>): Promise<void>;
}
