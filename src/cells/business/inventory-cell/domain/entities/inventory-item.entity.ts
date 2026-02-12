/**
 * NATT-OS — Inventory Cell
 * Entity: InventoryItem — Đơn vị tồn kho
 * Domain: Tâm Luxury — Trang sức cao cấp
 *
 * Mỗi item là 1 món trang sức thật với serial number duy nhất.
 * Khác với hệ thống bán lẻ thông thường: luxury = mỗi món là duy nhất.
 */

import { ItemStatus, ItemCondition, isValidTransition, TERMINAL_STATUSES } from '../value-objects/item-status';

export interface InventoryItemProps {
  id: string;
  sku: string;              // Mã sản phẩm (VD: NT-DC-750-001)
  serialNumber: string;     // Số seri duy nhất — BẮT BUỘC cho luxury
  productName: string;      // Tên sản phẩm (VD: "Dây chuyền vàng 750 đính kim cương")
  categoryCode: string;     // Mã hạng mục từ pricing-cell (VD: 'DAY_CHUYEN')
  goldType?: string;        // Loại vàng (750, 585, 416, 990, 999)
  weightGram?: number;      // Trọng lượng vàng (gram)
  stoneValue?: number;      // Giá tấm/đá (VNĐ)
  retailPrice: number;      // Giá bán lẻ (VNĐ) — từ pricing-cell
  costPrice: number;        // Giá vốn (VNĐ)
  status: ItemStatus;
  condition: ItemCondition;
  locationCode: string;     // Mã vị trí hiện tại (VD: 'SR-HN')
  importDate: Date;
  lastAuditDate?: Date;
  reservedBy?: string;      // Customer ID đang giữ
  reservedUntil?: Date;     // Hết hạn giữ hàng
  depositAmount?: number;   // Số tiền cọc đã nhận
  notes?: string;
}

export class InventoryItem {
  readonly id: string;
  readonly sku: string;
  readonly serialNumber: string;
  readonly productName: string;
  readonly categoryCode: string;
  readonly goldType?: string;
  readonly weightGram?: number;
  readonly stoneValue?: number;
  readonly retailPrice: number;
  readonly costPrice: number;
  private _status: ItemStatus;
  private _condition: ItemCondition;
  private _locationCode: string;
  readonly importDate: Date;
  private _lastAuditDate?: Date;
  private _reservedBy?: string;
  private _reservedUntil?: Date;
  private _depositAmount?: number;
  private _notes?: string;

  constructor(props: InventoryItemProps) {
    this.id = props.id;
    this.sku = props.sku;
    this.serialNumber = props.serialNumber;
    this.productName = props.productName;
    this.categoryCode = props.categoryCode;
    this.goldType = props.goldType;
    this.weightGram = props.weightGram;
    this.stoneValue = props.stoneValue;
    this.retailPrice = props.retailPrice;
    this.costPrice = props.costPrice;
    this._status = props.status;
    this._condition = props.condition;
    this._locationCode = props.locationCode;
    this.importDate = props.importDate;
    this._lastAuditDate = props.lastAuditDate;
    this._reservedBy = props.reservedBy;
    this._reservedUntil = props.reservedUntil;
    this._depositAmount = props.depositAmount;
    this._notes = props.notes;
  }

  // --- Getters ---
  get status(): ItemStatus { return this._status; }
  get condition(): ItemCondition { return this._condition; }
  get locationCode(): string { return this._locationCode; }
  get lastAuditDate(): Date | undefined { return this._lastAuditDate; }
  get reservedBy(): string | undefined { return this._reservedBy; }
  get reservedUntil(): Date | undefined { return this._reservedUntil; }
  get depositAmount(): number | undefined { return this._depositAmount; }
  get notes(): string | undefined { return this._notes; }

  /**
   * Chuyển trạng thái — kiểm tra ma trận transition
   * @throws Error nếu transition không hợp lệ
   */
  transitionTo(newStatus: ItemStatus): void {
    if (!isValidTransition(this._status, newStatus)) {
      throw new Error(
        `[INVENTORY] Transition không hợp lệ: ${this._status} → ${newStatus} ` +
        `(Item: ${this.serialNumber})`
      );
    }
    this._status = newStatus;
  }

  /**
   * Đặt giữ hàng cho khách
   */
  reserve(customerId: string, untilDate: Date, deposit?: number): void {
    this.transitionTo('RESERVED');
    this._reservedBy = customerId;
    this._reservedUntil = untilDate;
    this._depositAmount = deposit;
  }

  /**
   * Giải phóng hàng giữ (khách hủy hoặc hết hạn)
   */
  releaseReservation(): void {
    this.transitionTo('AVAILABLE');
    this._reservedBy = undefined;
    this._reservedUntil = undefined;
    // depositAmount giữ lại để audit — xử lý hoàn cọc ở order-cell
  }

  /**
   * Xuất kho bán hàng
   */
  markAsSold(): void {
    this.transitionTo('SOLD');
    this._reservedBy = undefined;
    this._reservedUntil = undefined;
  }

  /**
   * Chuyển vị trí (cùng chi nhánh hoặc khác chi nhánh)
   */
  moveTo(newLocationCode: string): void {
    this._locationCode = newLocationCode;
  }

  /**
   * Đưa vào bảo dưỡng
   */
  sendToMaintenance(reason: string): void {
    this.transitionTo('MAINTENANCE');
    this._notes = reason;
  }

  /**
   * Kiểm tra reservation đã hết hạn chưa
   */
  isReservationExpired(): boolean {
    if (this._status !== 'RESERVED' || !this._reservedUntil) return false;
    return new Date() > this._reservedUntil;
  }

  /**
   * Kiểm tra item có phải terminal state không
   */
  isTerminal(): boolean {
    return TERMINAL_STATUSES.includes(this._status);
  }

  /**
   * Lợi nhuận gộp dự kiến
   */
  get grossMargin(): number {
    return this.retailPrice - this.costPrice;
  }

  /**
   * Tỷ suất lợi nhuận (%)
   */
  get marginPercentage(): number {
    if (this.costPrice === 0) return 0;
    return Math.round((this.grossMargin / this.costPrice) * 100 * 100) / 100;
  }

  /**
   * Export to plain object (for persistence/events)
   */
  toJSON(): InventoryItemProps {
    return {
      id: this.id,
      sku: this.sku,
      serialNumber: this.serialNumber,
      productName: this.productName,
      categoryCode: this.categoryCode,
      goldType: this.goldType,
      weightGram: this.weightGram,
      stoneValue: this.stoneValue,
      retailPrice: this.retailPrice,
      costPrice: this.costPrice,
      status: this._status,
      condition: this._condition,
      locationCode: this._locationCode,
      importDate: this.importDate,
      lastAuditDate: this._lastAuditDate,
      reservedBy: this._reservedBy,
      reservedUntil: this._reservedUntil,
      depositAmount: this._depositAmount,
      notes: this._notes,
    };
  }
}
