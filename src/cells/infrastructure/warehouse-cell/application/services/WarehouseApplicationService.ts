/**
 * Warehouse Application Service
 * Cell: warehouse-cell | Layer: Application
 */
import { ReceiveGoods } from '../use-cases/ReceiveGoods';
import { ReleaseGoods } from '../use-cases/ReleaseGoods';

export class WarehouseApplicationService {
  constructor(
    private readonly receiveGoods: ReceiveGoods,
    private readonly releaseGoods: ReleaseGoods
  ) {}
}
