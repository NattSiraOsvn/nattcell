/**
 * NATT-OS — Buyback Cell
 * Entity: BuybackTransaction
 */
import { BuybackStatus, BuybackCondition, VALID_BUYBACK_TRANSITIONS, DEPRECIATION_RATES, BUYBACK_FEE_RATE } from '../value-objects/buyback-rules';

export interface BuybackTransactionProps {
  id: string;
  customerId: string;
  serialNumber: string;
  productName: string;
  goldType: string;
  goldWeightGram: number;
  currentGoldPricePerGram: number;
  stoneValue: number;
  condition: BuybackCondition;
  status: BuybackStatus;
  assessedValue?: number;
  offerPrice?: number;
  buybackFee?: number;
  finalPayment?: number;
  requiresAuthentication: boolean;
  isAuthenticated: boolean;
  branchCode: string;
  assessedBy?: string;
  createdAt: Date;
  completedAt?: Date;
  notes?: string;
}

export class BuybackTransaction {
  readonly id: string;
  readonly customerId: string;
  readonly serialNumber: string;
  readonly productName: string;
  readonly goldType: string;
  readonly goldWeightGram: number;
  readonly currentGoldPricePerGram: number;
  readonly stoneValue: number;
  readonly condition: BuybackCondition;
  private _status: BuybackStatus;
  private _assessedValue?: number;
  private _offerPrice?: number;
  private _buybackFee?: number;
  private _finalPayment?: number;
  readonly requiresAuthentication: boolean;
  private _isAuthenticated: boolean;
  readonly branchCode: string;
  private _assessedBy?: string;
  readonly createdAt: Date;
  private _completedAt?: Date;
  private _notes?: string;

  constructor(props: BuybackTransactionProps) {
    Object.assign(this, props);
    this.id = props.id; this.customerId = props.customerId;
    this.serialNumber = props.serialNumber; this.productName = props.productName;
    this.goldType = props.goldType; this.goldWeightGram = props.goldWeightGram;
    this.currentGoldPricePerGram = props.currentGoldPricePerGram;
    this.stoneValue = props.stoneValue; this.condition = props.condition;
    this._status = props.status; this._assessedValue = props.assessedValue;
    this._offerPrice = props.offerPrice; this._buybackFee = props.buybackFee;
    this._finalPayment = props.finalPayment;
    this.requiresAuthentication = props.requiresAuthentication;
    this._isAuthenticated = props.isAuthenticated;
    this.branchCode = props.branchCode; this._assessedBy = props.assessedBy;
    this.createdAt = props.createdAt; this._completedAt = props.completedAt;
    this._notes = props.notes;
  }

  get status(): BuybackStatus { return this._status; }
  get offerPrice(): number | undefined { return this._offerPrice; }
  get finalPayment(): number | undefined { return this._finalPayment; }

  calculateOffer(): { assessedValue: number; fee: number; offerPrice: number } {
    const rates = DEPRECIATION_RATES[this.condition];
    const goldValue = this.goldWeightGram * this.currentGoldPricePerGram * rates.goldRetentionRate;
    const stoneVal = this.stoneValue * rates.stoneRetentionRate;
    const assessedValue = Math.round(goldValue + stoneVal);
    const fee = Math.round(assessedValue * BUYBACK_FEE_RATE);
    const offerPrice = assessedValue - fee;
    this._assessedValue = assessedValue;
    this._buybackFee = fee;
    this._offerPrice = offerPrice;
    return { assessedValue, fee, offerPrice };
  }

  transitionTo(newStatus: BuybackStatus): void {
    if (!(VALID_BUYBACK_TRANSITIONS[this._status]?.includes(newStatus))) {
      throw new Error(`[BUYBACK] Transition không hợp lệ: ${this._status} → ${newStatus}`);
    }
    this._status = newStatus;
    if (newStatus === 'COMPLETED') { this._completedAt = new Date(); this._finalPayment = this._offerPrice; }
  }

  toJSON(): BuybackTransactionProps {
    return {
      id: this.id, customerId: this.customerId, serialNumber: this.serialNumber,
      productName: this.productName, goldType: this.goldType, goldWeightGram: this.goldWeightGram,
      currentGoldPricePerGram: this.currentGoldPricePerGram, stoneValue: this.stoneValue,
      condition: this.condition, status: this._status, assessedValue: this._assessedValue,
      offerPrice: this._offerPrice, buybackFee: this._buybackFee, finalPayment: this._finalPayment,
      requiresAuthentication: this.requiresAuthentication, isAuthenticated: this._isAuthenticated,
      branchCode: this.branchCode, assessedBy: this._assessedBy, createdAt: this.createdAt,
      completedAt: this._completedAt, notes: this._notes,
    };
  }
}
