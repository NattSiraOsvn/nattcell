/**
 * NATT-OS — Order Cell
 * EDA Event Contracts v2.1.0
 */

import { CellContract } from '../../../infrastructure/shared-contracts-cell/domain/contract.types';

export const ORDER_CONTRACT: CellContract<
  readonly [
    'order.created',
    'order.confirmed',
    'order.completed',
    'order.cancelled',
    'order.payment.received',
  ],
  readonly [
    'inventory.item.reserved',
    'inventory.item.sold',
    'pricing.product.calculated',
    'customer.tier.checked',
  ]
> = {
  cellId: 'order-cell',
  version: '2.1.0',
  emits: [
    'order.created',
    'order.confirmed',
    'order.completed',
    'order.cancelled',
    'order.payment.received',
  ],
  consumes: [
    'inventory.item.reserved',
    'inventory.item.sold',
    'pricing.product.calculated',
    'customer.tier.checked',
  ],
} as const;

export interface OrderCreatedEvent {
  type: 'order.created';
  payload: {
    orderId: string;
    customerId: string;
    branchCode: string;
    subtotalVND: number;
    vatAmountVND: number;
    totalVND: number;
    lineItemCount: number;
    createdAt: string;
  };
}

export interface OrderCompletedEvent {
  type: 'order.completed';
  payload: {
    orderId: string;
    customerId: string;
    totalVND: number;
    salesPersonId?: string;
    completedAt: string;
  };
}

export interface OrderPaymentReceivedEvent {
  type: 'order.payment.received';
  payload: {
    orderId: string;
    amount: number;
    method: string;
    paymentStatus: string;
    balanceVND: number;
    receivedAt: string;
  };
}

export type OrderEmittedEvent =
  | OrderCreatedEvent
  | OrderCompletedEvent
  | OrderPaymentReceivedEvent;
