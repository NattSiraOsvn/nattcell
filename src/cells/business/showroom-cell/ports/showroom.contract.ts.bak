/**
 * NATT-OS — Showroom Cell
 * EDA Event Contracts v2.1.0
 */

import { CellContract } from '../../../infrastructure/shared-contracts-cell/domain/contract.types';

export const SHOWROOM_CONTRACT: CellContract<
  readonly [
    'showroom.appointment.booked',
    'showroom.appointment.completed',
    'showroom.appointment.cancelled',
    'showroom.display.updated',
    'showroom.noshow',
  ],
  readonly [
    'inventory.item.transferred',
    'customer.registered',
    'sales.initiated',
  ]
> = {
  cellId: 'showroom-cell',
  version: '2.1.0',
  emits: [
    'showroom.appointment.booked',
    'showroom.appointment.completed',
    'showroom.appointment.cancelled',
    'showroom.display.updated',
    'showroom.noshow',
  ],
  consumes: [
    'inventory.item.transferred',
    'customer.registered',
    'sales.initiated',
  ],
} as const;

export interface ShowroomAppointmentBookedEvent {
  type: 'showroom.appointment.booked';
  payload: {
    appointmentId: string;
    customerId: string;
    customerName: string;
    branchCode: string;
    scheduledAt: string;
    durationMinutes: number;
    purpose: string;
    bookedAt: string;
  };
}

export interface ShowroomNoShowEvent {
  type: 'showroom.noshow';
  payload: {
    appointmentId: string;
    customerId: string;
    branchCode: string;
    scheduledAt: string;
    markedAt: string;
  };
}

export type ShowroomEmittedEvent = ShowroomAppointmentBookedEvent | ShowroomNoShowEvent;
