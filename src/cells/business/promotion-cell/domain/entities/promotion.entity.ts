import { PromotionType, PromotionStatus, PromotionRule } from '../value-objects/promotion-types';

export interface PromotionProps {
  id: string; code: string; name: string; type: PromotionType; status: PromotionStatus;
  discountValue: number; rules: PromotionRule; startDate: Date; endDate: Date;
  usageCount: number; createdBy: string; branchCode?: string;
}

export class Promotion {
  readonly id: string; readonly code: string; readonly name: string;
  readonly type: PromotionType; private _status: PromotionStatus;
  readonly discountValue: number; readonly rules: PromotionRule;
  readonly startDate: Date; readonly endDate: Date;
  private _usageCount: number; readonly createdBy: string; readonly branchCode?: string;

  constructor(props: PromotionProps) {
    this.id = props.id; this.code = props.code; this.name = props.name;
    this.type = props.type; this._status = props.status; this.discountValue = props.discountValue;
    this.rules = props.rules; this.startDate = props.startDate; this.endDate = props.endDate;
    this._usageCount = props.usageCount; this.createdBy = props.createdBy; this.branchCode = props.branchCode;
  }

  get status(): PromotionStatus { return this._status; }
  get usageCount(): number { return this._usageCount; }

  isValid(): boolean {
    const now = new Date();
    return this._status === 'ACTIVE' && now >= this.startDate && now <= this.endDate
      && (!this.rules.maxUsageCount || this._usageCount < this.rules.maxUsageCount);
  }

  applyDiscount(orderValue: number): number {
    if (!this.isValid()) return 0;
    if (this.rules.minOrderValueVND && orderValue < this.rules.minOrderValueVND) return 0;
    if (this.type === 'PERCENTAGE') return Math.round(orderValue * this.discountValue / 100);
    if (this.type === 'FIXED_AMOUNT') return this.discountValue;
    return 0;
  }

  recordUsage() { this._usageCount += 1; }
  activate() { this._status = 'ACTIVE'; }
  cancel() { this._status = 'CANCELLED'; }
  expire() { this._status = 'EXPIRED'; }

  toJSON(): PromotionProps {
    return { id: this.id, code: this.code, name: this.name, type: this.type, status: this._status,
      discountValue: this.discountValue, rules: this.rules, startDate: this.startDate,
      endDate: this.endDate, usageCount: this._usageCount, createdBy: this.createdBy, branchCode: this.branchCode };
  }
}
