export interface WarehouseItemProps {
  id: string;
  sku: string;
  name: string;
  categoryCode: string;
  unit: string;
  quantity: number;
  unitCostVND: number;
  location: string;
  locationNote?: string;
  minThreshold: number;
  supplierId?: string;
  notes?: string;
  insuranceStatus: 'COVERED' | 'NOT_COVERED' | 'EXPIRED';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export class WarehouseItem {
  public readonly id: string;
  public readonly sku: string;
  public readonly name: string;
  public readonly categoryCode: string;
  public readonly unit: string;
  private _quantity: number;
  private _unitCostVND: number;
  public readonly location: string;
  public readonly locationNote?: string;
  public readonly minThreshold: number;
  public readonly supplierId?: string;
  public readonly notes?: string;
  private _insuranceStatus: 'COVERED' | 'NOT_COVERED' | 'EXPIRED';
  public readonly createdAt: Date;
  private _updatedAt: Date;
  public readonly createdBy: string;
  public readonly movements: Array<{
    type: 'IN' | 'OUT' | 'ADJUST' | 'DAMAGED';
    quantity: number;
    unitCostVND?: number;
    reason?: string;
    timestamp: Date;
    by: string;
  }> = [];

  constructor(props: WarehouseItemProps) {
    this.id = props.id;
    this.sku = props.sku;
    this.name = props.name;
    this.categoryCode = props.categoryCode;
    this.unit = props.unit;
    this._quantity = props.quantity;
    this._unitCostVND = props.unitCostVND;
    this.location = props.location;
    this.locationNote = props.locationNote;
    this.minThreshold = props.minThreshold;
    this.supplierId = props.supplierId;
    this.notes = props.notes;
    this._insuranceStatus = props.insuranceStatus;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this.createdBy = props.createdBy;
  }

  get quantity(): number { return this._quantity; }
  get unitCostVND(): number { return this._unitCostVND; }
  get insuranceStatus(): string { return this._insuranceStatus; }
  get updatedAt(): Date { return this._updatedAt; }

  receiveStock(quantity: number, unitCostVND: number, receivedBy: string) {
    // Tính bình quân gia quyền
    const totalValue = this._quantity * this._unitCostVND + quantity * unitCostVND;
    this._quantity += quantity;
    this._unitCostVND = totalValue / this._quantity;
    this._updatedAt = new Date();
    this.movements.push({ type: 'IN', quantity, unitCostVND, timestamp: new Date(), by: receivedBy });
  }

  releaseStock(quantity: number, reason: string, releasedBy: string) {
    if (quantity > this._quantity) throw new Error('Not enough stock');
    this._quantity -= quantity;
    this._updatedAt = new Date();
    this.movements.push({ type: 'OUT', quantity, reason, timestamp: new Date(), by: releasedBy });
  }

  adjustStock(newQuantity: number, reason: string, adjustedBy: string) {
    const oldQty = this._quantity;
    this._quantity = newQuantity;
    this._updatedAt = new Date();
    this.movements.push({ type: 'ADJUST', quantity: newQuantity - oldQty, reason, timestamp: new Date(), by: adjustedBy });
  }

  markDamaged(notes: string) {
    this.movements.push({ type: 'DAMAGED', quantity: 0, reason: notes, timestamp: new Date(), by: 'system' });
  }

  updateInsurance(status: 'COVERED' | 'NOT_COVERED' | 'EXPIRED') {
    this._insuranceStatus = status;
    this._updatedAt = new Date();
  }

  isLowStock(): boolean {
    return this._quantity > 0 && this._quantity <= this.minThreshold;
  }

  isOutOfStock(): boolean {
    return this._quantity === 0;
  }
}
