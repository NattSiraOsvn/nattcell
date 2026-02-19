/**
 * NATT-OS — Sales Cell
 * EDA Event Contracts v2.1.0
 */

import { CellContract } from '../../../infrastructure/shared-contracts-cell/domain/contract.types';

export const SALES_CONTRACT: CellContract<
  readonly [
    'sales.initiated',
    'sales.completed',
    'sales.lost',
    'sales.commission.calculated',
    'sales.discount.applied',
  ],
  readonly [
    'inventory.item.reserved',
    'pricing.product.calculated',
    'customer.tier.checked',
    'promotion.applied',
  ]
> = {
  cellId: 'sales-cell',
  version: '2.1.0',
  emits: [
    'sales.initiated',
    'sales.completed',
    'sales.lost',
    'sales.commission.calculated',
    'sales.discount.applied',
  ],
  consumes: [
    'inventory.item.reserved',
    'pricing.product.calculated',
    'customer.tier.checked',
    'promotion.applied',
  ],
} as const;

export interface SalesCompletedEvent {
  type: 'sales.completed';
  payload: {
    transactionId: string;
    customerId: string;
    salesPersonId: string;
    finalValueVND: number;
    commissionVND: number;
    branchCode: string;
    completedAt: string;
  };
}

export interface SalesDiscountAppliedEvent {
  type: 'sales.discount.applied';
  payload: {
    transactionId: string;
    discountVND: number;
    approvedBy?: string;
    appliedAt: string;
  };
}

export type SalesEmittedEvent = SalesCompletedEvent | SalesDiscountAppliedEvent;
