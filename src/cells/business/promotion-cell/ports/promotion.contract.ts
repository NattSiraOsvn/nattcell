/**
 * NATT-OS — Promotion Cell
 * EDA Event Contracts v2.1.0
 */

import { CellContract } from '../../../infrastructure/shared-contracts-cell/domain/contract.types';

export const PROMOTION_CONTRACT: CellContract<
  readonly [
    'promotion.applied',
    'promotion.expired',
    'promotion.created',
    'promotion.best.selected',
  ],
  readonly [
    'order.created',
    'customer.tier.upgraded',
  ]
> = {
  cellId: 'promotion-cell',
  version: '2.1.0',
  emits: [
    'promotion.applied',
    'promotion.expired',
    'promotion.created',
    'promotion.best.selected',
  ],
  consumes: [
    'order.created',
    'customer.tier.upgraded',
  ],
} as const;

export interface PromotionAppliedEvent {
  type: 'promotion.applied';
  payload: {
    promotionId: string;
    promotionCode: string;
    customerId: string;
    customerTier: string;
    orderValueVND: number;
    discountVND: number;
    appliedAt: string;
  };
}

export interface PromotionExpiredEvent {
  type: 'promotion.expired';
  payload: {
    promotionId: string;
    promotionCode: string;
    totalUsageCount: number;
    expiredAt: string;
  };
}

export type PromotionEmittedEvent = PromotionAppliedEvent | PromotionExpiredEvent;
