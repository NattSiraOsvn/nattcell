export class SalesProvider {
  static getInstance() { return new SalesProvider(); }
  
  async createOrder(params: Record<string, unknown>) {
    return { id: `ORD-${Date.now()}`, ...params };
  }
  
  async getOrders() {
    return [];
  }
}
