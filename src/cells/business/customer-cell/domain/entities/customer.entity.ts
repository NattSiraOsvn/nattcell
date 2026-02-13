import { CustomerTier, calculateTier } from '../value-objects/customer-tier';

export interface CustomerProps {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  tier: CustomerTier;
  totalSpendVND: number;
  purchaseCount: number;
  firstPurchaseDate?: Date;
  lastPurchaseDate?: Date;
  birthday?: Date;
  preferredBranch?: 'HANOI' | 'HCMC';
  notes?: string;
  createdAt: Date;
}

export class Customer {
  readonly id: string;
  private _fullName: string;
  readonly phone: string;
  private _email?: string;
  private _tier: CustomerTier;
  private _totalSpendVND: number;
  private _purchaseCount: number;
  private _firstPurchaseDate?: Date;
  private _lastPurchaseDate?: Date;
  private _birthday?: Date;
  private _preferredBranch?: 'HANOI' | 'HCMC';
  private _notes?: string;
  readonly createdAt: Date;

  constructor(props: CustomerProps) {
    this.id = props.id; this._fullName = props.fullName; this.phone = props.phone;
    this._email = props.email; this._tier = props.tier; this._totalSpendVND = props.totalSpendVND;
    this._purchaseCount = props.purchaseCount; this._firstPurchaseDate = props.firstPurchaseDate;
    this._lastPurchaseDate = props.lastPurchaseDate; this._birthday = props.birthday;
    this._preferredBranch = props.preferredBranch; this._notes = props.notes;
    this.createdAt = props.createdAt;
  }

  get tier(): CustomerTier { return this._tier; }
  get totalSpendVND(): number { return this._totalSpendVND; }
  get purchaseCount(): number { return this._purchaseCount; }
  get fullName(): string { return this._fullName; }

  recordPurchase(amountVND: number): { tierChanged: boolean; oldTier: CustomerTier; newTier: CustomerTier } {
    const oldTier = this._tier;
    this._totalSpendVND += amountVND;
    this._purchaseCount += 1;
    this._lastPurchaseDate = new Date();
    if (!this._firstPurchaseDate) this._firstPurchaseDate = new Date();
    this._tier = calculateTier(this._totalSpendVND, this._purchaseCount);
    return { tierChanged: oldTier !== this._tier, oldTier, newTier: this._tier };
  }

  toJSON(): CustomerProps {
    return {
      id: this.id, fullName: this._fullName, phone: this.phone, email: this._email,
      tier: this._tier, totalSpendVND: this._totalSpendVND, purchaseCount: this._purchaseCount,
      firstPurchaseDate: this._firstPurchaseDate, lastPurchaseDate: this._lastPurchaseDate,
      birthday: this._birthday, preferredBranch: this._preferredBranch, notes: this._notes,
      createdAt: this.createdAt,
    };
  }
}
