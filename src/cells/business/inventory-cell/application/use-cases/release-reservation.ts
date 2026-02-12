/**
 * NATT-OS — Inventory Cell
 * Use Case: Release Reservation
 * Giải phóng hàng giữ — khi khách hủy hoặc hết hạn
 */

import { InventoryItem } from '../../domain/entities/inventory-item.entity';
import { ReservationEngine } from '../../domain/services/reservation.engine';

export interface ReleaseReservationInput {
  itemId: string;
  reason: string;
}

export interface ReleaseReservationOutput {
  success: boolean;
  message: string;
  depositToRefund: number;
}

export function executeReleaseReservation(
  items: InventoryItem[],
  input: ReleaseReservationInput,
): ReleaseReservationOutput {
  const item = items.find(i => i.id === input.itemId);

  if (!item) {
    return {
      success: false,
      message: `Item không tìm thấy: ${input.itemId}`,
      depositToRefund: 0,
    };
  }

  return ReservationEngine.processRelease(item, input.reason);
}
