import { WarehouseDomainService as DomainService } from '../domain/services/WarehouseDomainService';
export { DomainService as WarehouseDomainService };

export type QAAuditResult = {
  healthScore: number;
  totalItems: number;
  totalValueVND: number;
  stockAlerts: any[];
  insuranceAlerts: any[];
  unregisteredCategories: any[];
};
