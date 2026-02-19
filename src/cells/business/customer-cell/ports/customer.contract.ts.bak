/**
 * NATT-OS — Customer Cell
 * EDA Event Contracts v2.1.0
 */

import { CellContract } from '../../../infrastructure/shared-contracts-cell/domain/contract.types';

export const CUSTOMER_CONTRACT: CellContract<
  readonly [
    'customer.registered',
    'customer.tier.upgraded',
    'customer.purchase.recorded',
    'customer.birthday.upcoming',
    'customer.tier.checked',
  ],
  readonly [
    'order.completed',
    'sales.completed',
  ]
> = {
  cellId: 'customer-cell',
  version: '2.1.0',
  emits: [
    'customer.registered',
    'customer.tier.upgraded',
    'customer.purchase.recorded',
    'customer.birthday.upcoming',
    'customer.tier.checked',
  ],
  consumes: [
    'order.completed',
    'sales.completed',
  ],
} as const;

export interface CustomerTierUpgradedEvent {
  type: 'customer.tier.upgraded';
  payload: {
    customerId: string;
    oldTier: 'STANDARD' | 'VIP' | 'VVIP';
    newTier: 'STANDARD' | 'VIP' | 'VVIP';
    totalSpendVND: number;
    unlockedBenefits: string[];
    upgradedAt: string;
  };
}

export interface CustomerBirthdayUpcomingEvent {
  type: 'customer.birthday.upcoming';
  payload: {
    customerId: string;
    fullName: string;
    phone: string;
    tier: string;
    daysUntil: number;
    birthdayDate: string;
  };
}

export type CustomerEmittedEvent = CustomerTierUpgradedEvent | CustomerBirthdayUpcomingEvent;
