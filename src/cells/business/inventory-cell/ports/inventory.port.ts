import { DomainEvent } from '../../../infrastructure/shared-contracts-cell/domain/contract.types';

export class InventoryReservedEvent implements DomainEvent {
  eventId: string;
  eventType = 'INVENTORY.RESERVED';
  aggregateId: string;
  aggregateType = 'inventory';
  timestamp: number;
  payload: { itemId: string; customerId: string; expiry: Date };

  constructor(
    payload: { itemId: string; customerId: string; expiry: Date },
    metadata?: any
  ) {
    this.eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.aggregateId = payload.itemId;
    this.timestamp = Date.now();
    this.payload = payload;
  }
}

export class InventorySoldEvent implements DomainEvent {
  eventId: string;
  eventType = 'INVENTORY.SOLD';
  aggregateId: string;
  aggregateType = 'inventory';
  timestamp: number;
  payload: { itemId: string; orderId: string };

  constructor(payload: { itemId: string; orderId: string }) {
    this.eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.aggregateId = payload.itemId;
    this.timestamp = Date.now();
    this.payload = payload;
  }
}
