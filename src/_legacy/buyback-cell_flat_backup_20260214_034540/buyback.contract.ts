/**
 * Buyback Contract — EDA Events & Service Interface
 * Cell: buyback-cell | Wave: 3.5
 *
 * Business cells giao tiếp qua events, KHÔNG import trực tiếp.
 */

import { BuybackTransaction, BuybackItemStatus, PostBuybackClassification } from './buyback.types';

// ─── EVENTS EMITTED ───
export interface BuybackEvents {
  'buyback.transaction.created': {
    transactionId: string;
    customerId: string;
    type: string;
  };
  'buyback.inspection.completed': {
    transactionId: string;
    goldPurity: number;
    goldWeight: number;
    condition: string;
  };
  'buyback.price.calculated': {
    transactionId: string;
    finalPrice: number;
    marketGoldPrice: number;
  };
  'buyback.payment.completed': {
    transactionId: string;
    customerId: string;
    amount: number;
  };
  'buyback.classified': {
    transactionId: string;
    classification: PostBuybackClassification;
    destinationInventory: string;
  };
  'buyback.tradein.initiated': {
    transactionId: string;
    newOrderId: string;
    difference: number;
  };
}

// ─── EVENTS CONSUMED ───
export interface BuybackConsumedEvents {
  'pricing.gold.market.updated': { price: number; timestamp: string };
  'customer.verified': { customerId: string; tier: string };
  'inventory.item.received': { itemId: string; source: string };
}

// ─── SERVICE INTERFACE ───
export interface IBuybackService {
  createTransaction(customerId: string, itemDescription: string, type: string): Promise<BuybackTransaction>;
  submitInspection(transactionId: string, inspection: any): Promise<void>;
  calculatePrice(transactionId: string): Promise<number>;
  acceptAndPay(transactionId: string): Promise<void>;
  classifyItem(transactionId: string, classification: PostBuybackClassification): Promise<void>;
  initiateTradeIn(transactionId: string, newOrderId: string): Promise<void>;
}
