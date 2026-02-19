/**
 * NATT-OS — Promotion Cell
 * Application Service: PromotionService
 * Quản lý khuyến mãi Tâm Luxury — theo tier khách hàng
 */

import { Promotion, PromotionProps } from '../../domain/entities/promotion.entity';
import { PromotionEngine } from '../../domain/services/promotion.engine';
import { PromotionType, PromotionRule } from '../../domain/value-objects/promotion-types';

// ═══ COMMANDS ═══

export interface CreatePromotionCommand {
  code: string;
  name: string;
  type: PromotionType;
  discountValue: number;   // % nếu PERCENTAGE, VNĐ nếu FIXED_AMOUNT
  rules: PromotionRule;
  startDate: Date;
  endDate: Date;
  createdBy: string;
  branchCode?: string;
}

export interface ApplyPromotionCommand {
  code: string;
  orderValueVND: number;
  customerTier: 'STANDARD' | 'VIP' | 'VVIP';
  categoryCode?: string;
}

export interface ApplyPromotionResult {
  success: boolean;
  discountVND: number;
  promotionId?: string;
  promotionName?: string;
  error?: string;
}

// ═══ SERVICE ═══

export class PromotionService {
  private promos: Promotion[] = [];

  // ─── Create ───

  create(cmd: CreatePromotionCommand): { promotion: Promotion; errors: string[] } {
    const errors: string[] = [];

    if (!cmd.code?.trim()) errors.push('Mã khuyến mãi không được để trống');
    if (this.findByCode(cmd.code)) errors.push(`Mã ${cmd.code} đã tồn tại`);
    if (cmd.discountValue <= 0) errors.push('Giá trị giảm phải > 0');
    if (cmd.type === 'PERCENTAGE' && cmd.discountValue > 50)
      errors.push('Giảm % tối đa 50%');
    if (cmd.startDate >= cmd.endDate)
      errors.push('Ngày bắt đầu phải trước ngày kết thúc');

    const props: PromotionProps = {
      id: `PR-${Date.now()}`,
      code: cmd.code.toUpperCase(),
      name: cmd.name,
      type: cmd.type,
      status: 'DRAFT',
      discountValue: cmd.discountValue,
      rules: cmd.rules,
      startDate: cmd.startDate,
      endDate: cmd.endDate,
      usageCount: 0,
      createdBy: cmd.createdBy,
      branchCode: cmd.branchCode,
    };

    const promotion = new Promotion(props);
    if (errors.length === 0) {
      this.promos.push(promotion);
      // Auto-activate nếu startDate <= now
      if (cmd.startDate <= new Date()) promotion.activate();
    }
    return { promotion, errors };
  }

  // ─── Apply ───

  applyPromotion(cmd: ApplyPromotionCommand): ApplyPromotionResult {
    const promo = this.findByCode(cmd.code);
    if (!promo) return { success: false, discountVND: 0, error: `Mã ${cmd.code} không tồn tại` };
    if (!promo.isValid()) return { success: false, discountVND: 0, error: 'Mã khuyến mãi không còn hiệu lực' };

    // Kiểm tra tier restriction
    if (promo.rules.applicableTiers && promo.rules.applicableTiers.length > 0) {
      if (!promo.rules.applicableTiers.includes(cmd.customerTier))
        return { success: false, discountVND: 0, error: `Mã này chỉ áp dụng cho tier: ${promo.rules.applicableTiers.join(', ')}` };
    }

    // Kiểm tra category restriction
    if (cmd.categoryCode && promo.rules.applicableCategories && promo.rules.applicableCategories.length > 0) {
      if (!promo.rules.applicableCategories.includes(cmd.categoryCode))
        return { success: false, discountVND: 0, error: 'Mã không áp dụng cho danh mục này' };
    }

    const discountVND = promo.applyDiscount(cmd.orderValueVND);
    if (discountVND === 0)
      return { success: false, discountVND: 0, error: `Đơn hàng chưa đạt giá trị tối thiểu ${promo.rules.minOrderValueVND?.toLocaleString()}đ` };

    promo.recordUsage();
    return {
      success: true,
      discountVND,
      promotionId: promo.id,
      promotionName: promo.name,
    };
  }

  // ─── Best discount ───

  getBestDiscount(orderValueVND: number, customerTier: 'STANDARD' | 'VIP' | 'VVIP'): ApplyPromotionResult {
    const eligible = this.promos.filter(p => {
      if (!p.isValid()) return false;
      if (p.rules.applicableTiers && !p.rules.applicableTiers.includes(customerTier)) return false;
      return true;
    });

    const { promo, discount } = PromotionEngine.getBestDiscount(eligible, orderValueVND);
    if (!promo || discount === 0) return { success: false, discountVND: 0, error: 'Không có khuyến mãi phù hợp' };

    promo.recordUsage();
    return { success: true, discountVND: discount, promotionId: promo.id, promotionName: promo.name };
  }

  // ─── Lifecycle ───

  activatePromotion(id: string): boolean {
    const p = this.promos.find(p => p.id === id);
    if (!p || p.status !== 'DRAFT') return false;
    p.activate(); return true;
  }

  cleanupExpired(): number {
    const before = this.promos.filter(p => p.status === 'ACTIVE').length;
    PromotionEngine.checkExpired(this.promos);
    const after = this.promos.filter(p => p.status === 'ACTIVE').length;
    return before - after;
  }

  // ─── Queries ───

  findByCode(code: string): Promotion | undefined {
    return this.promos.find(p => p.code === code.toUpperCase());
  }

  getActive(): Promotion[] {
    return PromotionEngine.getActivePromotions(this.promos);
  }

  getActiveForTier(tier: 'STANDARD' | 'VIP' | 'VVIP'): Promotion[] {
    return this.getActive().filter(p =>
      !p.rules.applicableTiers || p.rules.applicableTiers.includes(tier)
    );
  }
}
