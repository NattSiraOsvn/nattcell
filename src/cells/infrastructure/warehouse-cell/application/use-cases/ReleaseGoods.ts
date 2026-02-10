/**
 * ReleaseGoods Use Case
 * Cell: warehouse-cell | Layer: Application
 */
import { IWarehouseRepository } from '../../ports/WarehouseRepository';
import { WarehouseDomainService } from '../../domain/services/WarehouseDomainService';

export class ReleaseGoods {
  constructor(
    private readonly repo: IWarehouseRepository,
    private readonly domainService: WarehouseDomainService
  ) {}

  async execute(id: string, quantity: number): Promise<boolean> {
    const item = await this.repo.findById(id);
    if (!item || !this.domainService.canRelease(item, quantity)) return false;
    item.quantity -= quantity;
    item.updatedAt = new Date();
    await this.repo.save(item);
    return true;
  }
}
