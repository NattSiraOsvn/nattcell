/**
 * InMemory Warehouse Repository
 * Cell: warehouse-cell | Layer: Infrastructure
 */
import { IWarehouseRepository } from '../../ports/WarehouseRepository';
import { WarehouseItem } from '../../domain/entities/WarehouseEntity';

export class InMemoryWarehouseRepository implements IWarehouseRepository {
  private store: Map<string, WarehouseItem> = new Map();

  async findById(id: string): Promise<WarehouseItem | null> {
    return this.store.get(id) || null;
  }

  async save(item: WarehouseItem): Promise<void> {
    this.store.set(item.id, item);
  }

  async delete(id: string): Promise<boolean> {
    return this.store.delete(id);
  }

  async findByCategory(cat: string): Promise<WarehouseItem[]> {
    return [...this.store.values()].filter(i => i.category === cat);
  }
}
