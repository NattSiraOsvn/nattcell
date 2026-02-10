/**
 * Warranty Contract — EDA Events & Service Interface
 * Cell: warranty-cell | Wave: 3.5
 */

import { WarrantyTicket, WarrantyServiceType, WarrantyTicketStatus } from './warranty.types';

// ─── EVENTS EMITTED ───
export interface WarrantyEvents {
  'warranty.ticket.created': {
    ticketId: string;
    customerId: string;
    purchasedAtShop: boolean;
  };
  'warranty.diagnosis.completed': {
    ticketId: string;
    issues: string[];
    recommendedServices: WarrantyServiceType[];
  };
  'warranty.quote.sent': {
    ticketId: string;
    totalQuote: number;
    freeServices: number;
  };
  'warranty.service.started': {
    ticketId: string;
    services: WarrantyServiceType[];
  };
  'warranty.service.completed': {
    ticketId: string;
    customerId: string;
    servicesPerformed: WarrantyServiceType[];
  };
  'warranty.item.returned': {
    ticketId: string;
    customerId: string;
  };
  'warranty.material.consumed': {
    ticketId: string;
    materialType: string;
    quantity: number;
    cost: number;
  };
}

// ─── EVENTS CONSUMED ───
export interface WarrantyConsumedEvents {
  'customer.tier.changed': { customerId: string; newTier: string };
  'sales.order.created': { orderId: string; customerId: string };
  'inventory.material.available': { materialType: string; quantity: number };
}

// ─── SERVICE INTERFACE ───
export interface IWarrantyService {
  createTicket(customerId: string, productDescription: string, purchasedAtShop: boolean): Promise<WarrantyTicket>;
  diagnose(ticketId: string, diagnosis: any): Promise<void>;
  generateQuote(ticketId: string): Promise<number>;
  startService(ticketId: string): Promise<void>;
  completeService(ticketId: string, qualityPassed: boolean): Promise<void>;
  returnToCustomer(ticketId: string): Promise<void>;
}
