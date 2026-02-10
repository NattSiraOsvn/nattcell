/**
 * Warehouse Domain Service
 * Cell: warehouse-cell | Layer: Domain
 */
import { WarehouseItem } from '../entities/WarehouseEntity';

export class WarehouseDomainService {
  validate(item: WarehouseItem): boolean {
    return item.id !== '' && item.sku !== '' && item.quantity >= 0;
  }

  canRelease(item: WarehouseItem, qty: number): boolean {
    return item.quantity >= qty;
  }
}
