/**
 * Warehouse Domain Entity
 * Cell: warehouse-cell | Wave: 2 | Layer: Domain
 * Status: QUARANTINED — scaffold only
 */
export interface IWarehouseItem {
  id: string;
  sku: string;
  category: 'RAW_MATERIAL' | 'SEMI_FINISHED' | 'FINISHED_PRODUCT';
  quantity: number;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

export class WarehouseItem implements IWarehouseItem {
  constructor(
    public readonly id: string,
    public readonly sku: string,
    public readonly category: IWarehouseItem['category'],
    public quantity: number,
    public location: string,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}
}
