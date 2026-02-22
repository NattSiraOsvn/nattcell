/**
 * Warehouse Event Emitter Port
 * Cell: WAREHOUSE-cell | Layer: Ports
 */
export interface IWarehouseEventEmitter {
  emit(eventType: string, payload: Record<string, unknown>): Promise<void>;
}
