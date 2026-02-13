import { SaleStatus, SalesChannel, VALID_SALE_TRANSITIONS, COMMISSION_RATES } from '../value-objects/sales-channel';

export interface SalesTransactionProps {
  id: string; customerId: string; salesPersonId: string; channel: SalesChannel;
  status: SaleStatus; itemIds: string[]; totalValueVND: number;
  discountVND: number; finalValueVND: number; commissionVND: number;
  branchCode: string; notes?: string; createdAt: Date; closedAt?: Date;
}

export class SalesTransaction {
  readonly id: string; readonly customerId: string; readonly salesPersonId: string;
  readonly channel: SalesChannel; private _status: SaleStatus;
  readonly itemIds: string[]; readonly totalValueVND: number;
  private _discountVND: number; private _finalValueVND: number;
  private _commissionVND: number; readonly branchCode: string;
  private _notes?: string; readonly createdAt: Date; private _closedAt?: Date;

  constructor(props: SalesTransactionProps) {
    this.id = props.id; this.customerId = props.customerId; this.salesPersonId = props.salesPersonId;
    this.channel = props.channel; this._status = props.status; this.itemIds = props.itemIds;
    this.totalValueVND = props.totalValueVND; this._discountVND = props.discountVND;
    this._finalValueVND = props.finalValueVND; this._commissionVND = props.commissionVND;
    this.branchCode = props.branchCode; this._notes = props.notes;
    this.createdAt = props.createdAt; this._closedAt = props.closedAt;
  }

  get status(): SaleStatus { return this._status; }
  get finalValueVND(): number { return this._finalValueVND; }
  get commissionVND(): number { return this._commissionVND; }

  transitionTo(s: SaleStatus) {
    if (!(VALID_SALE_TRANSITIONS[this._status]?.includes(s))) throw new Error(`[SALES] ${this._status} → ${s} không hợp lệ`);
    this._status = s;
    if (s === 'COMPLETED') { this._closedAt = new Date(); this._commissionVND = Math.round(this._finalValueVND * COMMISSION_RATES[0].ratePercent / 100); }
  }

  applyDiscount(amount: number) { this._discountVND = amount; this._finalValueVND = this.totalValueVND - amount; }

  toJSON(): SalesTransactionProps {
    return { id: this.id, customerId: this.customerId, salesPersonId: this.salesPersonId,
      channel: this.channel, status: this._status, itemIds: this.itemIds,
      totalValueVND: this.totalValueVND, discountVND: this._discountVND,
      finalValueVND: this._finalValueVND, commissionVND: this._commissionVND,
      branchCode: this.branchCode, notes: this._notes, createdAt: this.createdAt, closedAt: this._closedAt };
  }
}
