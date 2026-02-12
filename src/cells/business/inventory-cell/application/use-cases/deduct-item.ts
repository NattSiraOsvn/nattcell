/**
 * NATT-OS — Inventory Cell
 * Use Case: Deduct Item (Xuất kho bán hàng)
 * Write operation — chuyển item sang SOLD, emits event
 */

import { InventoryItem } from '../../domain/entities/inventory-item.entity';

export interface DeductItemInput {
  itemId: string;
  orderId: string;
}

export interface DeductItemOutput {
  success: boolean;
  message: string;
  finalPrice?: number;
}

export function executeDeductItem(
  items: InventoryItem[],
  input: DeductItemInput,
): DeductItemOutput {
  const item = items.find(i => i.id === input.itemId);

  if (!item) {
    return {
      success: false,
      message: `Item không tìm thấy: ${input.itemId}`,
    };
  }

  // Item phải đang RESERVED hoặc AVAILABLE mới xuất kho được
  if (item.status !== 'RESERVED' && item.status !== 'AVAILABLE') {
    return {
      success: false,
      message: `Không thể xuất kho — trạng thái hiện tại: ${item.status}`,
    };
  }

  try {
    item.markAsSold();
    return {
      success: true,
      message: `Xuất kho thành công: ${item.productName} (${item.serialNumber}) → Order ${input.orderId}`,
      finalPrice: item.retailPrice,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}
