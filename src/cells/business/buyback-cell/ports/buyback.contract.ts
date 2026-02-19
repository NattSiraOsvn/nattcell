/**
 * NATT-OS — Buyback Cell
 * EDA Event Contracts v2.1.0
 * Thu mua & Thu đổi Tâm Luxury
 */

import { CellContract } from '../../../infrastructure/shared-contracts-cell/domain/contract.types';

export const BUYBACK_CONTRACT: CellContract<
  readonly [
    'buyback.item.assessed',
    'buyback.offer.made',
    'buyback.accepted',
    'buyback.completed',
    'buyback.item.received',
    'buyback.exchange.policy.locked',
    'buyback.exchange.override.applied',
    'buyback.exchange.valuation.calculated',
  ],
  readonly [
    'pricing.gold.market.updated',
    'inventory.item.received',
    'customer.tier.checked',
  ]
> = {
  cellId: 'buyback-cell',
  version: '2.1.0',
  emits: [
    'buyback.item.assessed',
    'buyback.offer.made',
    'buyback.accepted',
    'buyback.completed',
    'buyback.item.received',
    'buyback.exchange.policy.locked',
    'buyback.exchange.override.applied',
    'buyback.exchange.valuation.calculated',
  ],
  consumes: [
    'pricing.gold.market.updated',
    'inventory.item.received',
    'customer.tier.checked',
  ],
} as const;

export interface BuybackExchangeValuationCalculatedEvent {
  type: 'buyback.exchange.valuation.calculated';
  payload: {
    transactionId: string;
    gdbRef: string;
    actionType: 'BUYBACK' | 'UPGRADE';
    originalValue: number;
    jewelryCaseValue: number;
    mainStoneValue: number;
    totalExchangeValue: number;
    isOverridden: boolean;
    calculatedAt: string;
  };
}

export interface BuybackExchangePolicyLockedEvent {
  type: 'buyback.exchange.policy.locked';
  payload: {
    transactionId: string;
    gdbRef: string;
    customerId: string;
    jewelryCaseBuyback: number;
    jewelryCaseUpgrade: number;
    hasMainStone: boolean;
    lockedAt: string;
  };
}

export interface BuybackExchangeOverrideAppliedEvent {
  type: 'buyback.exchange.override.applied';
  payload: {
    transactionId: string;
    approvedBy: string;
    reason: string;
    overriddenFields: Record<string, number>;
    appliedAt: string;
  };
}

export interface BuybackCompletedEvent {
  type: 'buyback.completed';
  payload: {
    transactionId: string;
    customerId: string;
    finalPayment: number;
    mode: 'BUYBACK' | 'EXCHANGE';
    completedAt: string;
  };
}

export type BuybackEmittedEvent =
  | BuybackExchangePolicyLockedEvent
  | BuybackExchangeOverrideAppliedEvent
  | BuybackExchangeValuationCalculatedEvent
  | BuybackCompletedEvent;
