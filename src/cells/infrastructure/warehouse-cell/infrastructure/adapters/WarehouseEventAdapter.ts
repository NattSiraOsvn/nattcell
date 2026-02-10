/**
 * Warehouse Event Adapter
 * Cell: warehouse-cell | Layer: Infrastructure
 */
export class WarehouseEventAdapter {
  async emit(eventType: string, payload: Record<string, unknown>): Promise<void> {
    console.log(`[warehouse-cell] Event: ${eventType}`, payload);
  }
}
