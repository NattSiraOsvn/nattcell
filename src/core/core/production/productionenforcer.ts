export class ProductionEnforcer {
  static validateService(service: string): boolean { return true; }

  static enforce() { return true; }
}
