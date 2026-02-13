/**
 * NATT-OS — Warranty Cell
 * Entity: WarrantyClaim — Yêu cầu bảo hành
 */

import { ClaimStatus, isValidClaimTransition } from '../value-objects/claim-status';
import { WarrantyType } from '../value-objects/warranty-policy';

export interface WarrantyClaimProps {
  id: string;
  itemId: string;
  serialNumber: string;
  customerId: string;
  warrantyType: WarrantyType;
  purchaseDate: Date;
  warrantyExpiry: Date;
  claimDate: Date;
  issueDescription: string;
  status: ClaimStatus;
  inspectionNotes?: string;
  repairDescription?: string;
  repairCost?: number;
  isCoveredByWarranty: boolean;
  branchCode: string;
  assignedTechnician?: string;
  completedDate?: Date;
  returnedDate?: Date;
}

export class WarrantyClaim {
  readonly id: string;
  readonly itemId: string;
  readonly serialNumber: string;
  readonly customerId: string;
  readonly warrantyType: WarrantyType;
  readonly purchaseDate: Date;
  readonly warrantyExpiry: Date;
  readonly claimDate: Date;
  readonly issueDescription: string;
  private _status: ClaimStatus;
  private _inspectionNotes?: string;
  private _repairDescription?: string;
  private _repairCost?: number;
  private _isCoveredByWarranty: boolean;
  readonly branchCode: string;
  private _assignedTechnician?: string;
  private _completedDate?: Date;
  private _returnedDate?: Date;

  constructor(props: WarrantyClaimProps) {
    this.id = props.id;
    this.itemId = props.itemId;
    this.serialNumber = props.serialNumber;
    this.customerId = props.customerId;
    this.warrantyType = props.warrantyType;
    this.purchaseDate = props.purchaseDate;
    this.warrantyExpiry = props.warrantyExpiry;
    this.claimDate = props.claimDate;
    this.issueDescription = props.issueDescription;
    this._status = props.status;
    this._inspectionNotes = props.inspectionNotes;
    this._repairDescription = props.repairDescription;
    this._repairCost = props.repairCost;
    this._isCoveredByWarranty = props.isCoveredByWarranty;
    this.branchCode = props.branchCode;
    this._assignedTechnician = props.assignedTechnician;
    this._completedDate = props.completedDate;
    this._returnedDate = props.returnedDate;
  }

  get status(): ClaimStatus { return this._status; }
  get isCoveredByWarranty(): boolean { return this._isCoveredByWarranty; }
  get repairCost(): number | undefined { return this._repairCost; }

  isWarrantyValid(): boolean {
    return this.claimDate <= this.warrantyExpiry;
  }

  transitionTo(newStatus: ClaimStatus): void {
    if (!isValidClaimTransition(this._status, newStatus)) {
      throw new Error(`[WARRANTY] Transition không hợp lệ: ${this._status} → ${newStatus}`);
    }
    this._status = newStatus;
  }

  startInspection(): void {
    this.transitionTo('INSPECTING');
  }

  approve(notes: string, technician: string): void {
    this._inspectionNotes = notes;
    this._isCoveredByWarranty = this.isWarrantyValid();
    this._assignedTechnician = technician;
    this.transitionTo('APPROVED');
  }

  reject(reason: string): void {
    this._inspectionNotes = reason;
    this._isCoveredByWarranty = false;
    this.transitionTo('REJECTED');
  }

  startRepair(description: string, cost: number): void {
    this._repairDescription = description;
    this._repairCost = this._isCoveredByWarranty ? 0 : cost;
    this.transitionTo('REPAIRING');
  }

  complete(): void {
    this._completedDate = new Date();
    this.transitionTo('COMPLETED');
  }

  returnToCustomer(): void {
    this._returnedDate = new Date();
    this.transitionTo('RETURNED');
  }

  toJSON(): WarrantyClaimProps {
    return {
      id: this.id, itemId: this.itemId, serialNumber: this.serialNumber,
      customerId: this.customerId, warrantyType: this.warrantyType,
      purchaseDate: this.purchaseDate, warrantyExpiry: this.warrantyExpiry,
      claimDate: this.claimDate, issueDescription: this.issueDescription,
      status: this._status, inspectionNotes: this._inspectionNotes,
      repairDescription: this._repairDescription, repairCost: this._repairCost,
      isCoveredByWarranty: this._isCoveredByWarranty, branchCode: this.branchCode,
      assignedTechnician: this._assignedTechnician, completedDate: this._completedDate,
      returnedDate: this._returnedDate,
    };
  }
}
