/**
 * NATT-OS — Inventory Cell
 * Infrastructure: In-Memory Repository (Scaffold)
 *
 * Placeholder cho database adapter thật.
 * Hiện tại: in-memory cho development & testing.
 * Production: sẽ thay bằng PostgreSQL/Supabase adapter.
 */

import { InventoryItem, InventoryItemProps } from '../../domain/entities/inventory-item.entity';

export interface IInventoryRepository {
  findById(id: string): Promise<InventoryItem | null>;
  findBySerialNumber(serialNumber: string): Promise<InventoryItem | null>;
  findBySku(sku: string): Promise<InventoryItem[]>;
  findByLocation(locationCode: string): Promise<InventoryItem[]>;
  findByStatus(status: string): Promise<InventoryItem[]>;
  save(item: InventoryItem): Promise<void>;
  getAll(): Promise<InventoryItem[]>;
}

export class InMemoryInventoryRepository implements IInventoryRepository {
  private store: Map<string, InventoryItemProps> = new Map();

  async findById(id: string): Promise<InventoryItem | null> {
    const data = this.store.get(id);
    return data ? new InventoryItem(data) : null;
  }

  async findBySerialNumber(serialNumber: string): Promise<InventoryItem | null> {
    for (const data of this.store.values()) {
      if (data.serialNumber === serialNumber) {
        return new InventoryItem(data);
      }
    }
    return null;
  }

  async findBySku(sku: string): Promise<InventoryItem[]> {
    return Array.from(this.store.values())
      .filter(d => d.sku === sku)
      .map(d => new InventoryItem(d));
  }

  async findByLocation(locationCode: string): Promise<InventoryItem[]> {
    return Array.from(this.store.values())
      .filter(d => d.locationCode === locationCode)
      .map(d => new InventoryItem(d));
  }

  async findByStatus(status: string): Promise<InventoryItem[]> {
    return Array.from(this.store.values())
      .filter(d => d.status === status)
      .map(d => new InventoryItem(d));
  }

  async save(item: InventoryItem): Promise<void> {
    this.store.set(item.id, item.toJSON());
  }

  async getAll(): Promise<InventoryItem[]> {
    return Array.from(this.store.values()).map(d => new InventoryItem(d));
  }
}
