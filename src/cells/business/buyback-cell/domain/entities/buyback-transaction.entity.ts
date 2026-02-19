/**
 * NATT-OS — Buyback Cell
 * Entity: BuybackTransaction — Thu mua & Thu đổi Tâm Luxury
 *
 * 2 luồng chính:
 *   1. BUYBACK thuần — khách bán lại, không mua mới
 *   2. EXCHANGE — khách đổi lên sản phẩm lớn hơn, cấn trừ giá trị GĐB
 */

import { BuybackStatus, BuybackCondition, VALID_BUYBACK_TRANSITIONS, DEPRECIATION_RATES, BUYBACK_FEE_RATE } from '../value-objects/buyback-rules';
import {
  GDBLockedPolicy,
  ExchangeOverride,
  ExchangeValuation,
  ExchangeActionType,
  validateGDBLockedPolicy,
  validateExchangeOverride,
  calculateExchangeValuation,
} from '../value-objects/exchange-policy';

// ═══ TRANSACTION TYPE ═══

export type TransactionMode = 'BUYBACK' | 'EXCHANGE';

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
  mode: TransactionMode;

  // GĐB Exchange fields — chỉ dùng khi mode = EXCHANGE
  gdbRef?: string;                    // Mã GĐB quét được
  gdbOriginalValue?: number;          // Giá gốc trên GĐB
  gdbLockedPolicy?: GDBLockedPolicy;  // Policy lock từ GĐB
  exchangeOverride?: ExchangeOverride; // Override door — sếp duyệt
  exchangeActionType?: ExchangeActionType;
  exchangeValuation?: ExchangeValuation;

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
  readonly mode: TransactionMode;
  readonly requiresAuthentication: boolean;
  readonly branchCode: string;
  readonly createdAt: Date;

  // GĐB fields
  readonly gdbRef?: string;
  readonly gdbOriginalValue?: number;
  private _gdbLockedPolicy?: GDBLockedPolicy;
  private _exchangeOverride?: ExchangeOverride;
  private _exchangeActionType?: ExchangeActionType;
  private _exchangeValuation?: ExchangeValuation;

  private _status: BuybackStatus;
  private _assessedValue?: number;
  private _offerPrice?: number;
  private _buybackFee?: number;
  private _finalPayment?: number;
  private _isAuthenticated: boolean;
  private _assessedBy?: string;
  private _completedAt?: Date;
  private _notes?: string;

  constructor(props: BuybackTransactionProps) {
    this.id = props.id;
    this.customerId = props.customerId;
    this.serialNumber = props.serialNumber;
    this.productName = props.productName;
    this.goldType = props.goldType;
    this.goldWeightGram = props.goldWeightGram;
    this.currentGoldPricePerGram = props.currentGoldPricePerGram;
    this.stoneValue = props.stoneValue;
    this.condition = props.condition;
    this.mode = props.mode;
    this.requiresAuthentication = props.requiresAuthentication;
    this.branchCode = props.branchCode;
    this.createdAt = props.createdAt;

    this._status = props.status;
    this._assessedValue = props.assessedValue;
    this._offerPrice = props.offerPrice;
    this._buybackFee = props.buybackFee;
    this._finalPayment = props.finalPayment;
    this._isAuthenticated = props.isAuthenticated;
    this._assessedBy = props.assessedBy;
    this._completedAt = props.completedAt;
    this._notes = props.notes;

    // GĐB exchange fields
    this.gdbRef = props.gdbRef;
    this.gdbOriginalValue = props.gdbOriginalValue;
    this._gdbLockedPolicy = props.gdbLockedPolicy;
    this._exchangeOverride = props.exchangeOverride;
    this._exchangeActionType = props.exchangeActionType;
    this._exchangeValuation = props.exchangeValuation;
  }

  // ═══ GETTERS ═══

  get status(): BuybackStatus { return this._status; }
  get offerPrice(): number | undefined { return this._offerPrice; }
  get finalPayment(): number | undefined { return this._finalPayment; }
  get exchangeValuation(): ExchangeValuation | undefined { return this._exchangeValuation; }
  get gdbLockedPolicy(): GDBLockedPolicy | undefined { return this._gdbLockedPolicy; }

  // ═══ BUYBACK thuần — tính giá dựa trên condition + gold price ═══

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

  // ═══ EXCHANGE — lock policy từ GĐB ═══

  /**
   * Lock chính sách từ GĐB — bắt buộc trước khi tính exchange value
   * Không thể thay đổi sau khi đã lock
   */
  lockGDBPolicy(policy: GDBLockedPolicy): void {
    if (this.mode !== 'EXCHANGE') throw new Error('[BUYBACK] lockGDBPolicy chỉ dùng cho mode EXCHANGE');
    if (this._gdbLockedPolicy) throw new Error('[BUYBACK] GDB policy đã được lock, không thể thay đổi');

    const err = validateGDBLockedPolicy(policy);
    if (err) throw new Error(`[BUYBACK] GDB policy không hợp lệ: ${err}`);

    this._gdbLockedPolicy = policy;
  }

  /**
   * Áp dụng override — bắt buộc có approvedBy + reason
   */
  applyOverride(override: ExchangeOverride): void {
    if (this.mode !== 'EXCHANGE') throw new Error('[BUYBACK] applyOverride chỉ dùng cho mode EXCHANGE');
    if (!this._gdbLockedPolicy) throw new Error('[BUYBACK] Phải lock GDB policy trước khi override');

    const err = validateExchangeOverride(override);
    if (err) throw new Error(`[BUYBACK] Override không hợp lệ: ${err}`);

    this._exchangeOverride = override;
  }

  /**
   * Tính giá trị exchange — dùng locked policy + giá thật từ GĐB
   * GĐB luôn tách bạch: gdbJewelryCaseValue + gdbMainStoneValue
   */
  calculateExchangeValue(
    actionType: ExchangeActionType,
    jewelryCaseValueOnGDB: number,
    mainStoneValueOnGDB: number | null,
  ): ExchangeValuation {
    if (this.mode !== 'EXCHANGE') throw new Error('[BUYBACK] calculateExchangeValue chỉ dùng cho mode EXCHANGE');
    if (!this._gdbLockedPolicy) throw new Error('[BUYBACK] Chưa lock GDB policy');

    this._exchangeActionType = actionType;
    this._exchangeValuation = calculateExchangeValuation(
      jewelryCaseValueOnGDB,
      mainStoneValueOnGDB,
      actionType,
      this._gdbLockedPolicy,
      this._exchangeOverride,
    );
    this._offerPrice = this._exchangeValuation.totalExchangeValue;
    return this._exchangeValuation;
  }

  // ═══ STATE MACHINE ═══

  transitionTo(newStatus: BuybackStatus): void {
    if (!VALID_BUYBACK_TRANSITIONS[this._status]?.includes(newStatus)) {
      throw new Error(`[BUYBACK] Transition không hợp lệ: ${this._status} → ${newStatus}`);
    }
    this._status = newStatus;
    if (newStatus === 'COMPLETED') {
      this._completedAt = new Date();
      this._finalPayment = this._offerPrice;
    }
  }

  // ═══ SERIALIZATION ═══

  toJSON(): BuybackTransactionProps {
    return {
      id: this.id,
      customerId: this.customerId,
      serialNumber: this.serialNumber,
      productName: this.productName,
      goldType: this.goldType,
      goldWeightGram: this.goldWeightGram,
      currentGoldPricePerGram: this.currentGoldPricePerGram,
      stoneValue: this.stoneValue,
      condition: this.condition,
      status: this._status,
      mode: this.mode,
      gdbRef: this.gdbRef,
      gdbOriginalValue: this.gdbOriginalValue,
      gdbLockedPolicy: this._gdbLockedPolicy,
      exchangeOverride: this._exchangeOverride,
      exchangeActionType: this._exchangeActionType,
      exchangeValuation: this._exchangeValuation,
      assessedValue: this._assessedValue,
      offerPrice: this._offerPrice,
      buybackFee: this._buybackFee,
      finalPayment: this._finalPayment,
      requiresAuthentication: this.requiresAuthentication,
      isAuthenticated: this._isAuthenticated,
      branchCode: this.branchCode,
      assessedBy: this._assessedBy,
      createdAt: this.createdAt,
      completedAt: this._completedAt,
      notes: this._notes,
    };
  }
}
