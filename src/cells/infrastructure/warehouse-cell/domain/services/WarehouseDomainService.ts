export type QAAuditResult = {
  healthScore: number;
  totalItems: number;
  totalValueVND: number;
  stockAlerts: any[];
  insuranceAlerts: any[];
  unregisteredCategories: any[];
};

export class WarehouseDomainService {
  static runQAAudit(items: any[]): QAAuditResult {
    // Implement logic thật
    return {
      healthScore: 0.95,
      totalItems: items.length,
      totalValueVND: items.reduce((sum, i) => sum + i.quantity * i.unitCostVND, 0),
      stockAlerts: [],
      insuranceAlerts: [],
      unregisteredCategories: [],
    };
  }

  static requiresInsurance(categoryCode: string): boolean {
    return categoryCode === 'MAIN' || categoryCode === 'BRANCH';
  }
}
