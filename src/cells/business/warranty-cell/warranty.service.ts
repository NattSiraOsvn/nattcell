/**
 * Warranty Service — Core Business Logic
 * Cell: warranty-cell | Wave: 3.5
 *
 * Xử lý bảo hành & dịch vụ sửa chữa trang sức:
 * 1. Tiếp nhận → 2. Chẩn đoán → 3. Báo giá → 4. Thực hiện → 5. Kiểm tra → 6. Trả hàng
 */

import { WarrantyServiceType, FeePolicy, ServiceQuote, ProductDiagnosis } from './warranty.types';

/** Bảng giá dịch vụ cơ bản (VND) */
const BASE_PRICES: Record<WarrantyServiceType, number> = {
  POLISH: 0,
  REPLATE: 200000,
  RESIZE: 300000,
  STONE_RESET: 150000,
  STONE_REPLACE: 500000,
  SOLDER: 250000,
  CLASP_REPLACE: 200000,
  ENGRAVING: 100000,
  FULL_RESTORATION: 800000,
  CLEANING: 0,
};

/** Dịch vụ miễn phí trọn đời (nếu mua tại shop) */
const LIFETIME_FREE: WarrantyServiceType[] = ['POLISH', 'CLEANING', 'REPLATE'];

/** Dịch vụ miễn phí cho VIP */
const VIP_FREE: Record<string, WarrantyServiceType[]> = {
  GOLD: ['POLISH', 'CLEANING', 'REPLATE', 'STONE_RESET'],
  PLATINUM: ['POLISH', 'CLEANING', 'REPLATE', 'STONE_RESET', 'RESIZE', 'SOLDER'],
  DIAMOND: ['POLISH', 'CLEANING', 'REPLATE', 'STONE_RESET', 'RESIZE', 'SOLDER', 'CLASP_REPLACE', 'ENGRAVING'],
};

export class WarrantyService {

  /**
   * Xác định chính sách phí cho 1 dịch vụ
   */
  determineFeePolicy(
    service: WarrantyServiceType,
    purchasedAtShop: boolean,
    customerTier?: string
  ): FeePolicy {
    // Mua tại shop + dịch vụ nằm trong danh sách free trọn đời
    if (purchasedAtShop && LIFETIME_FREE.includes(service)) {
      return 'FREE_LIFETIME';
    }
    
    // VIP tier
    if (customerTier && VIP_FREE[customerTier]?.includes(service)) {
      return 'FREE_VIP';
    }

    // Mua tại shop nhưng dịch vụ không free → giảm giá
    if (purchasedAtShop) {
      return 'DISCOUNTED';
    }

    return 'FULL_PRICE';
  }

  /**
   * Tính giá cuối cùng cho 1 dịch vụ
   */
  calculateServicePrice(
    service: WarrantyServiceType,
    feePolicy: FeePolicy
  ): number {
    const base = BASE_PRICES[service];

    switch (feePolicy) {
      case 'FREE_LIFETIME':
      case 'FREE_VIP':
        return 0;
      case 'DISCOUNTED':
        return Math.round(base * 0.5); // Giảm 50%
      case 'FULL_PRICE':
        return base;
    }
  }

  /**
   * Tạo báo giá cho toàn bộ phiếu bảo hành
   */
  generateQuote(
    diagnosis: ProductDiagnosis,
    purchasedAtShop: boolean,
    customerTier?: string
  ): ServiceQuote {
    const services = diagnosis.recommendedServices.map(svc => {
      const feePolicy = this.determineFeePolicy(svc, purchasedAtShop, customerTier);
      const finalPrice = this.calculateServicePrice(svc, feePolicy);
      const reason = this.getFeeReason(feePolicy, customerTier);
      return {
        type: svc,
        basePrice: BASE_PRICES[svc],
        feePolicy,
        finalPrice,
        reason,
      };
    });

    const materialCost = (diagnosis.materialNeeded ?? [])
      .reduce((sum, m) => sum + m.estimatedCost, 0);

    const laborCost = services.reduce((sum, s) => sum + s.finalPrice, 0);
    const totalQuote = laborCost + materialCost;

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 7); // Báo giá có hiệu lực 7 ngày

    return { services, materialCost, laborCost, totalQuote, validUntil };
  }

  private getFeeReason(policy: FeePolicy, tier?: string): string {
    switch (policy) {
      case 'FREE_LIFETIME': return 'Miễn phí trọn đời — mua tại Tâm Luxury';
      case 'FREE_VIP': return `Miễn phí — VIP ${tier}`;
      case 'DISCOUNTED': return 'Giảm 50% — mua tại Tâm Luxury';
      case 'FULL_PRICE': return 'Giá đầy đủ';
    }
  }
}
