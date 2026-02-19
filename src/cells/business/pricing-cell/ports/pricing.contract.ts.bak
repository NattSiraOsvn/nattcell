/**
 * Pricing Cell — EDA Event Contracts
 * Defines all events this cell emits and consumes.
 */

// ═══ EVENTS EMITTED ═══

/** Giá vàng thị trường được cập nhật */
export interface PricingGoldMarketUpdatedEvent {
  type: 'pricing.gold.market.updated';
  payload: {
    goldType: string;
    oldPricePerChi: number;
    newPricePerChi: number;
    source: string;
    updatedAt: string;
  };
}

/** Giá sản phẩm được tính xong */
export interface PricingProductCalculatedEvent {
  type: 'pricing.product.calculated';
  payload: {
    productCode: string;
    category: string;
    finalPriceVND: number;
    requiresCustomQuote: boolean;
    calculatedAt: string;
  };
}

/** Markup tier thay đổi cho sản phẩm */
export interface PricingMarkupChangedEvent {
  type: 'pricing.markup.changed';
  payload: {
    productCode: string;
    oldTier: string;
    newTier: string;
    changedAt: string;
  };
}

/** Sản phẩm cần báo giá riêng */
export interface PricingCustomQuoteRequiredEvent {
  type: 'pricing.custom_quote.required';
  payload: {
    productCode: string;
    category: string;
    reason: string;
    requestedAt: string;
  };
}

export type PricingEmittedEvent =
  | PricingGoldMarketUpdatedEvent
  | PricingProductCalculatedEvent
  | PricingMarkupChangedEvent
  | PricingCustomQuoteRequiredEvent;

// ═══ EVENTS CONSUMED ═══

/** Từ external: giá vàng SJC/PNJ cập nhật */
export interface ExternalGoldPriceUpdateEvent {
  type: 'external.gold.price.updated';
  payload: {
    goldType: string;
    pricePerChi: number;
    source: string;
  };
}

/** Từ inventory-cell: nguyên liệu mới nhập */
export interface InventoryMaterialReceivedEvent {
  type: 'inventory.material.received';
  payload: {
    materialType: string;
    goldType: string;
    weightGram: number;
    costPerGram: number;
  };
}

export type PricingConsumedEvent =
  | ExternalGoldPriceUpdateEvent
  | InventoryMaterialReceivedEvent;
