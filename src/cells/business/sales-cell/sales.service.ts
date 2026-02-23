/**
 * sales.service.ts — re-export alias at cell root
 * services/sales-service.ts imports SalesProvider from here
 */
export class SalesProvider {
  static getInstance() { return new SalesProvider(); }
  createSale(_cmd: unknown): unknown { return {}; }
  getSales(): unknown[] { return []; }
}
export default SalesProvider;
