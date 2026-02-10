/**
 * ReceiveGoods Use Case
 * Cell: warehouse-cell | Layer: Application
 */
import { IWarehouseRepository } from '../../ports/WarehouseRepository';
import { WarehouseItem } from '../../domain/entities/WarehouseEntity';

export class ReceiveGoods {
  constructor(private readonly repo: IWarehouseRepository) {}

  async execute(item: WarehouseItem): Promise<void> {
    await this.repo.save(item);
  }
}
