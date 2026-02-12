/**
 * NATT-OS — Inventory Cell
 * Value Object: Item Status & Transitions
 * Domain: Tâm Luxury — Trang sức cao cấp
 *
 * Nguyên tắc Hiến pháp: Mỗi chuyển trạng thái PHẢI có audit trail
 * "no audit = doesn't exist"
 */

export type ItemStatus =
  | 'AVAILABLE'     // Sẵn sàng bán
  | 'RESERVED'      // Đang giữ hàng cho khách
  | 'SOLD'          // Đã bán — xuất kho
  | 'MAINTENANCE'   // Đang bảo dưỡng / đánh bóng / sửa chữa
  | 'QUARANTINE'    // Tạm giữ kiểm tra (xác thực, kiểm định)
  | 'IN_TRANSIT'    // Đang chuyển kho giữa chi nhánh
  | 'DISPOSED';     // Đã thanh lý (hư hỏng không sửa được)

export type ItemCondition = 'NEW' | 'LIKE_NEW' | 'USED' | 'REFURBISHED';

/**
 * Ma trận chuyển trạng thái hợp lệ
 * Key = trạng thái hiện tại, Value = danh sách trạng thái được phép chuyển đến
 */
export const VALID_TRANSITIONS: Record<ItemStatus, ItemStatus[]> = {
  AVAILABLE:   ['RESERVED', 'MAINTENANCE', 'QUARANTINE', 'IN_TRANSIT'],
  RESERVED:    ['AVAILABLE', 'SOLD'],
  SOLD:        [],  // Terminal state — không chuyển tiếp
  MAINTENANCE: ['AVAILABLE', 'QUARANTINE', 'DISPOSED'],
  QUARANTINE:  ['AVAILABLE', 'MAINTENANCE', 'DISPOSED'],
  IN_TRANSIT:  ['AVAILABLE', 'QUARANTINE'],
  DISPOSED:    [],  // Terminal state
};

/**
 * Kiểm tra chuyển trạng thái có hợp lệ không
 */
export function isValidTransition(from: ItemStatus, to: ItemStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Các trạng thái terminal (không thể chuyển tiếp)
 */
export const TERMINAL_STATUSES: ItemStatus[] = ['SOLD', 'DISPOSED'];

/**
 * Các trạng thái mà item vẫn thuộc tồn kho (chưa xuất)
 */
export const IN_STOCK_STATUSES: ItemStatus[] = [
  'AVAILABLE', 'RESERVED', 'MAINTENANCE', 'QUARANTINE', 'IN_TRANSIT'
];
