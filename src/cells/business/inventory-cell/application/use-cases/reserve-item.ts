/**
 * NATT-OS — Inventory Cell
 * Use Case: Reserve Item
 * Giữ hàng cho khách — Write operation, emits event
 */

import { InventoryItem } from '../../domain/entities/inventory-item.entity';
import { ReservationEngine, ReservationResult } from '../../domain/services/reservation.engine';
import { CustomerTier } from '../../domain/value-objects/reservation-rules';

export interface ReserveItemInput {
  itemId: string;
  customerId: string;
  customerTier: CustomerTier;
  depositAmount?: number;
}

export function executeReserveItem(
  items: InventoryItem[],
  input: ReserveItemInput,
): ReservationResult {
  const item = items.find(i => i.id === input.itemId);

  if (!item) {
    return {
      success: false,
      requiredDeposit: 0,
      message: `Item không tìm thấy: ${input.itemId}`,
    };
  }

  return ReservationEngine.processReservation({
    item,
    customerId: input.customerId,
    customerTier: input.customerTier,
    depositAmount: input.depositAmount,
  });
}
