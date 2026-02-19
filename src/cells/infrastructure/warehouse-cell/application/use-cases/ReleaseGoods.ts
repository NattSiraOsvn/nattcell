import { IWarehouseRepository } from '../../ports/WarehouseRepository';

export class ReleaseGoods {
  constructor(private readonly repo: IWarehouseRepository) {}

  async execute(id: string, quantity: number, reason: string, releasedBy: string): Promise<boolean> {
    const item = await this.repo.findById(id);
    if (!item || item.quantity < quantity) return false;
    item.releaseStock(quantity, reason, releasedBy);
    await this.repo.save(item);
    return true;
  }
}
