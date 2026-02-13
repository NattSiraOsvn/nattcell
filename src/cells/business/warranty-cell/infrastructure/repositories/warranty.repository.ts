import { WarrantyClaim, WarrantyClaimProps } from '../../domain/entities/warranty-claim.entity';

export interface IWarrantyRepository {
  findById(id: string): Promise<WarrantyClaim | null>;
  findByItem(itemId: string): Promise<WarrantyClaim[]>;
  findByCustomer(customerId: string): Promise<WarrantyClaim[]>;
  save(claim: WarrantyClaim): Promise<void>;
  getAll(): Promise<WarrantyClaim[]>;
}

export class InMemoryWarrantyRepository implements IWarrantyRepository {
  private store: Map<string, WarrantyClaimProps> = new Map();
  async findById(id: string) { const d = this.store.get(id); return d ? new WarrantyClaim(d) : null; }
  async findByItem(itemId: string) { return Array.from(this.store.values()).filter(d => d.itemId === itemId).map(d => new WarrantyClaim(d)); }
  async findByCustomer(cid: string) { return Array.from(this.store.values()).filter(d => d.customerId === cid).map(d => new WarrantyClaim(d)); }
  async save(claim: WarrantyClaim) { this.store.set(claim.id, claim.toJSON()); }
  async getAll() { return Array.from(this.store.values()).map(d => new WarrantyClaim(d)); }
}
