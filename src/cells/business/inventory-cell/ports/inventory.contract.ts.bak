/**
 * NATT-OS — Inventory Cell
 * Ports Layer: EDA Contracts
 *
 * Events emitted & consumed bởi inventory-cell
 * Giao tiếp với cells khác qua shared-contracts-cell + EDA events
 *
 * Base: Bối's inventory.port.ts (IInventoryPort interface)
 * Upgraded: Thiên — thêm EDA events + audit contracts
 */

// ╔══════════════════════════════════════════════════════╗
// ║  EVENTS EMITTED (inventory-cell → hệ thống)         ║
// ╚══════════════════════════════════════════════════════╝

export interface InventoryEvent {
  type: string;
  timestamp: Date;
  payload: Record<string, any>;
  metadata: {
    cellId: 'inventory-cell';
    version: '2.0.0';
    auditTrail: string;  // Bắt buộc — Hiến pháp: no audit = doesn't exist
  };
}

/** Item mới nhập kho */
export const EVENT_ITEM_RECEIVED = 'inventory.item.received';

/** Item được giữ hàng cho khách */
export const EVENT_ITEM_RESERVED = 'inventory.item.reserved';

/** Giải phóng giữ hàng (hủy cọc / hết hạn) */
export const EVENT_RESERVATION_RELEASED = 'inventory.reservation.released';

/** Xuất kho bán hàng */
export const EVENT_ITEM_SOLD = 'inventory.item.sold';

/** Chuyển kho (cùng chi nhánh) */
export const EVENT_ITEM_TRANSFERRED = 'inventory.item.transferred';

/** Chuyển kho liên chi nhánh (cần phê duyệt) */
export const EVENT_CROSS_BRANCH_TRANSFER = 'inventory.cross_branch.transfer_requested';

/** Item đưa vào bảo dưỡng */
export const EVENT_ITEM_MAINTENANCE = 'inventory.item.maintenance';

/** Cảnh báo tồn kho */
export const EVENT_STOCK_ALERT = 'inventory.stock.alert';

/** Auto-release reservation hết hạn */
export const EVENT_RESERVATION_EXPIRED = 'inventory.reservation.expired';

// ╔══════════════════════════════════════════════════════╗
// ║  EVENTS CONSUMED (hệ thống → inventory-cell)         ║
// ╚══════════════════════════════════════════════════════╝

/** Pricing-cell cập nhật giá → inventory cập nhật retailPrice */
export const CONSUME_PRICE_UPDATED = 'pricing.product.calculated';

/** Order-cell xác nhận đơn → trigger deductItem */
export const CONSUME_ORDER_CONFIRMED = 'order.confirmed';

/** Buyback-cell nhận hàng cũ → trigger nhập kho */
export const CONSUME_BUYBACK_RECEIVED = 'buyback.item.received';

/** Warranty-cell gửi sửa chữa → trigger MAINTENANCE status */
export const CONSUME_WARRANTY_REPAIR = 'warranty.repair.requested';

// ╔══════════════════════════════════════════════════════╗
// ║  CONTRACT SUMMARY                                    ║
// ╚══════════════════════════════════════════════════════╝

export const INVENTORY_CONTRACT = {
  cellId: 'inventory-cell',
  version: '2.0.0',
  emits: [
    EVENT_ITEM_RECEIVED,
    EVENT_ITEM_RESERVED,
    EVENT_RESERVATION_RELEASED,
    EVENT_ITEM_SOLD,
    EVENT_ITEM_TRANSFERRED,
    EVENT_CROSS_BRANCH_TRANSFER,
    EVENT_ITEM_MAINTENANCE,
    EVENT_STOCK_ALERT,
    EVENT_RESERVATION_EXPIRED,
  ],
  consumes: [
    CONSUME_PRICE_UPDATED,
    CONSUME_ORDER_CONFIRMED,
    CONSUME_BUYBACK_RECEIVED,
    CONSUME_WARRANTY_REPAIR,
  ],
} as const;
