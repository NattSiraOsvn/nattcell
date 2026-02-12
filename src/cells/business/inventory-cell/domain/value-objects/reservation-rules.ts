/**
 * NATT-OS — Inventory Cell
 * Value Object: Reservation Rules — Quy tắc giữ hàng
 * Domain: Tâm Luxury
 *
 * Quy tắc giữ hàng dựa trên giá trị & loại khách
 */

export interface ReservationPolicy {
  /** Thời gian giữ hàng mặc định (giờ) */
  defaultHours: number;
  /** Thời gian tối đa được gia hạn (giờ) */
  maxExtensionHours: number;
  /** Yêu cầu đặt cọc tối thiểu (VNĐ), 0 = không cần */
  minDeposit: number;
  /** Tỷ lệ cọc theo giá trị item (%) */
  depositPercentage: number;
}

export type CustomerTier = 'STANDARD' | 'VIP' | 'VVIP';

/**
 * Chính sách giữ hàng theo loại khách
 *
 * STANDARD: Khách thường — giữ 24h, cọc 10%
 * VIP: Khách quen / giá trị cao — giữ 48h, cọc 5%
 * VVIP: Khách đặc biệt (Gatekeeper approve) — giữ 72h, không cần cọc
 */
export const RESERVATION_POLICIES: Record<CustomerTier, ReservationPolicy> = {
  STANDARD: {
    defaultHours: 24,
    maxExtensionHours: 24,
    minDeposit: 2_000_000,       // 2 triệu VNĐ
    depositPercentage: 10,
  },
  VIP: {
    defaultHours: 48,
    maxExtensionHours: 48,
    minDeposit: 0,
    depositPercentage: 5,
  },
  VVIP: {
    defaultHours: 72,
    maxExtensionHours: 72,
    minDeposit: 0,
    depositPercentage: 0,
  },
};

/**
 * Ngưỡng giá trị item BẮT BUỘC có số seri (VNĐ)
 * Item >= 5 triệu phải có serialNumber
 */
export const SERIAL_NUMBER_THRESHOLD = 5_000_000;

/**
 * Số lần gia hạn tối đa cho 1 reservation
 */
export const MAX_EXTENSION_COUNT = 2;

/**
 * Tính thời gian giữ hàng thực tế
 */
export function calculateReservationDuration(
  customerTier: CustomerTier,
  itemValueVND: number,
): { hours: number; requiredDeposit: number } {
  const policy = RESERVATION_POLICIES[customerTier];

  // Item > 100 triệu VNĐ: luôn yêu cầu cọc tối thiểu 10 triệu
  const highValueMinDeposit = itemValueVND > 100_000_000 ? 10_000_000 : 0;

  const depositFromPercentage = Math.round(itemValueVND * policy.depositPercentage / 100);
  const requiredDeposit = Math.max(policy.minDeposit, depositFromPercentage, highValueMinDeposit);

  return {
    hours: policy.defaultHours,
    requiredDeposit,
  };
}
