/**
 * NATT-OS — Inventory Cell
 * Domain Service: Reservation Engine
 * Domain: Tâm Luxury — Giữ hàng trang sức cao cấp
 *
 * Xử lý logic giữ hàng:
 * - Tính thời gian giữ theo tier khách
 * - Kiểm tra deposit
 * - Auto-release khi hết hạn
 * - Gia hạn giữ hàng
 */

import { InventoryItem } from '../entities/inventory-item.entity';
import {
  CustomerTier,
  RESERVATION_POLICIES,
  MAX_EXTENSION_COUNT,
  calculateReservationDuration,
} from '../value-objects/reservation-rules';

// --- Types ---

export interface ReservationRequest {
  item: InventoryItem;
  customerId: string;
  customerTier: CustomerTier;
  depositAmount?: number;
}

export interface ReservationResult {
  success: boolean;
  reservedUntil?: Date;
  requiredDeposit: number;
  message: string;
}

export interface ExtensionRequest {
  item: InventoryItem;
  customerTier: CustomerTier;
  currentExtensionCount: number;
}

export interface ExtensionResult {
  success: boolean;
  newExpiry?: Date;
  message: string;
}

// --- Engine ---

export class ReservationEngine {
  /**
   * Xử lý yêu cầu giữ hàng
   */
  static processReservation(request: ReservationRequest): ReservationResult {
    const { item, customerId, customerTier, depositAmount } = request;

    // 1. Kiểm tra item có sẵn không
    if (item.status !== 'AVAILABLE') {
      return {
        success: false,
        requiredDeposit: 0,
        message: `Item không sẵn sàng — trạng thái hiện tại: ${item.status}`,
      };
    }

    // 2. Tính thời gian giữ & deposit yêu cầu
    const { hours, requiredDeposit } = calculateReservationDuration(
      customerTier,
      item.retailPrice,
    );

    // 3. Kiểm tra deposit đủ chưa
    const actualDeposit = depositAmount ?? 0;
    if (requiredDeposit > 0 && actualDeposit < requiredDeposit) {
      return {
        success: false,
        requiredDeposit,
        message: `Cọc không đủ: cần ${requiredDeposit.toLocaleString()} VNĐ, ` +
                 `nhận ${actualDeposit.toLocaleString()} VNĐ ` +
                 `(Tier: ${customerTier}, Item: ${item.retailPrice.toLocaleString()} VNĐ)`,
      };
    }

    // 4. Thực hiện giữ hàng
    const reservedUntil = new Date();
    reservedUntil.setHours(reservedUntil.getHours() + hours);

    item.reserve(customerId, reservedUntil, actualDeposit);

    return {
      success: true,
      reservedUntil,
      requiredDeposit,
      message: `Giữ hàng thành công: ${hours}h (đến ${reservedUntil.toLocaleString('vi-VN')})`,
    };
  }

  /**
   * Giải phóng hàng giữ
   */
  static processRelease(item: InventoryItem, reason: string): {
    success: boolean;
    message: string;
    depositToRefund: number;
  } {
    if (item.status !== 'RESERVED') {
      return {
        success: false,
        message: `Item không ở trạng thái RESERVED (hiện tại: ${item.status})`,
        depositToRefund: 0,
      };
    }

    const depositToRefund = item.depositAmount ?? 0;
    item.releaseReservation();

    return {
      success: true,
      message: `Đã giải phóng hàng. Lý do: ${reason}. Cọc cần hoàn: ${depositToRefund.toLocaleString()} VNĐ`,
      depositToRefund,
    };
  }

  /**
   * Gia hạn giữ hàng
   */
  static processExtension(request: ExtensionRequest): ExtensionResult {
    const { item, customerTier, currentExtensionCount } = request;

    if (item.status !== 'RESERVED') {
      return {
        success: false,
        message: `Item không ở trạng thái RESERVED`,
      };
    }

    if (currentExtensionCount >= MAX_EXTENSION_COUNT) {
      return {
        success: false,
        message: `Đã gia hạn tối đa ${MAX_EXTENSION_COUNT} lần — không thể gia hạn thêm`,
      };
    }

    const policy = RESERVATION_POLICIES[customerTier];
    const currentExpiry = item.reservedUntil!;
    const newExpiry = new Date(currentExpiry);
    newExpiry.setHours(newExpiry.getHours() + policy.maxExtensionHours);

    return {
      success: true,
      newExpiry,
      message: `Gia hạn thêm ${policy.maxExtensionHours}h (đến ${newExpiry.toLocaleString('vi-VN')})`,
    };
  }

  /**
   * Quét và auto-release các reservation hết hạn
   * @returns danh sách item đã được giải phóng
   */
  static scanExpiredReservations(items: InventoryItem[]): InventoryItem[] {
    const released: InventoryItem[] = [];

    for (const item of items) {
      if (item.isReservationExpired()) {
        item.releaseReservation();
        released.push(item);
      }
    }

    return released;
  }
}
