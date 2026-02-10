/**
 * Warehouse Repository Port
 * Cell: warehouse-cell | Layer: Ports
 */
import { WarehouseItem } from '../domain/entities/WarehouseEntity';

export interface IWarehouseRepository {
  findById(id: string): Promise<WarehouseItem | null>;
  save(item: WarehouseItem): Promise<void>;
  delete(id: string): Promise<boolean>;
  findByCategory(category: string): Promise<WarehouseItem[]>;
}
