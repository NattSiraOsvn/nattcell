import { OrderStatus, PaymentStatus, PaymentMethod, isValidOrderTransition } from '../value-objects/order-status';

export interface OrderLineItem { itemId: string; serialNumber: string; productName: string; unitPrice: number; quantity: number; }
export interface OrderProps {
  id: string; customerId: string; branchCode: string; status: OrderStatus;
  paymentStatus: PaymentStatus; paymentMethod?: PaymentMethod;
  lineItems: OrderLineItem[]; subtotalVND: number; vatAmountVND: number;
  totalVND: number; depositVND: number; balanceVND: number;
  salesPersonId?: string; notes?: string; createdAt: Date; completedAt?: Date;
}

export class Order {
  readonly id: string;
  readonly customerId: string;
  readonly branchCode: string;
  private _status: OrderStatus;
  private _paymentStatus: PaymentStatus;
  private _paymentMethod?: PaymentMethod;
  readonly lineItems: OrderLineItem[];
  readonly subtotalVND: number;
  readonly vatAmountVND: number;
  readonly totalVND: number;
  private _depositVND: number;
  private _balanceVND: number;
  private _salesPersonId?: string;
  private _notes?: string;
  readonly createdAt: Date;
  private _completedAt?: Date;

  constructor(props: OrderProps) {
    this.id = props.id; this.customerId = props.customerId; this.branchCode = props.branchCode;
    this._status = props.status; this._paymentStatus = props.paymentStatus;
    this._paymentMethod = props.paymentMethod; this.lineItems = props.lineItems;
    this.subtotalVND = props.subtotalVND; this.vatAmountVND = props.vatAmountVND;
    this.totalVND = props.totalVND; this._depositVND = props.depositVND;
    this._balanceVND = props.balanceVND; this._salesPersonId = props.salesPersonId;
    this._notes = props.notes; this.createdAt = props.createdAt; this._completedAt = props.completedAt;
  }

  get status(): OrderStatus { return this._status; }
  get paymentStatus(): PaymentStatus { return this._paymentStatus; }
  get balanceVND(): number { return this._balanceVND; }

  transitionTo(s: OrderStatus) {
    if (!isValidOrderTransition(this._status, s)) throw new Error(`[ORDER] ${this._status} → ${s} không hợp lệ`);
    this._status = s;
    if (s === 'COMPLETED') this._completedAt = new Date();
  }

  recordPayment(amount: number, method: PaymentMethod) {
    this._depositVND += amount; this._balanceVND = this.totalVND - this._depositVND;
    this._paymentMethod = method;
    this._paymentStatus = this._balanceVND <= 0 ? 'FULLY_PAID' : 'DEPOSIT_PAID';
  }

  confirm() { this.transitionTo('CONFIRMED'); }
  process() { this.transitionTo('PROCESSING'); }
  ready() { this.transitionTo('READY'); }
  complete() { if (this._paymentStatus !== 'FULLY_PAID') throw new Error('[ORDER] Chưa thanh toán đủ'); this.transitionTo('COMPLETED'); }
  cancel() { this.transitionTo('CANCELLED'); if (this._depositVND > 0) this._paymentStatus = 'REFUNDED'; }

  toJSON(): OrderProps {
    return {
      id: this.id, customerId: this.customerId, branchCode: this.branchCode,
      status: this._status, paymentStatus: this._paymentStatus, paymentMethod: this._paymentMethod,
      lineItems: this.lineItems, subtotalVND: this.subtotalVND, vatAmountVND: this.vatAmountVND,
      totalVND: this.totalVND, depositVND: this._depositVND, balanceVND: this._balanceVND,
      salesPersonId: this._salesPersonId, notes: this._notes, createdAt: this.createdAt,
      completedAt: this._completedAt,
    };
  }
}
