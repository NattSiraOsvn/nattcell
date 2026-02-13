import { AppointmentStatus } from '../value-objects/display-zone';

export interface AppointmentProps {
  id: string; customerId: string; customerName: string; phone: string;
  branchCode: string; scheduledAt: Date; durationMinutes: number;
  status: AppointmentStatus; purpose: string; assignedStaff?: string;
  itemsRequested?: string[]; notes?: string; createdAt: Date;
}

export class Appointment {
  readonly id: string; readonly customerId: string; readonly customerName: string;
  readonly phone: string; readonly branchCode: string; readonly scheduledAt: Date;
  readonly durationMinutes: number; private _status: AppointmentStatus;
  readonly purpose: string; private _assignedStaff?: string;
  readonly itemsRequested?: string[]; private _notes?: string; readonly createdAt: Date;

  constructor(props: AppointmentProps) {
    this.id = props.id; this.customerId = props.customerId; this.customerName = props.customerName;
    this.phone = props.phone; this.branchCode = props.branchCode; this.scheduledAt = props.scheduledAt;
    this.durationMinutes = props.durationMinutes; this._status = props.status;
    this.purpose = props.purpose; this._assignedStaff = props.assignedStaff;
    this.itemsRequested = props.itemsRequested; this._notes = props.notes; this.createdAt = props.createdAt;
  }

  get status(): AppointmentStatus { return this._status; }
  confirm(staff: string) { this._assignedStaff = staff; this._status = 'CONFIRMED'; }
  start() { this._status = 'IN_PROGRESS'; }
  complete(notes?: string) { this._status = 'COMPLETED'; this._notes = notes; }
  noShow() { this._status = 'NO_SHOW'; }
  cancel() { this._status = 'CANCELLED'; }

  toJSON(): AppointmentProps {
    return { id: this.id, customerId: this.customerId, customerName: this.customerName,
      phone: this.phone, branchCode: this.branchCode, scheduledAt: this.scheduledAt,
      durationMinutes: this.durationMinutes, status: this._status, purpose: this.purpose,
      assignedStaff: this._assignedStaff, itemsRequested: this.itemsRequested,
      notes: this._notes, createdAt: this.createdAt };
  }
}
