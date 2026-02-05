
import { QuoteRequest } from '../../types';

/**
 * ⚛️ RULE ENGINE - OMEGA PRICING
 * Logic bóc tách từ Total Bảng Giá (Sheet: Total Bảng Giá, Column O)
 */
export function evaluateRules(input: QuoteRequest): { labor_price: number; type: string } {
  const { product_group, specs } = input;
  const E = specs.weight;      // TLV sau nguội (gram)
  const H = specs.designText;  // Mô tả thiết kế
  const J = product_group;     // Nhóm hàng
  const L = specs.unit;        // Đơn vị tính
  const N = specs.stonePrice;  // Tổng giá trị đá tấm (VND)

  // ===== BÔNG TAI (Source: Column O) =====
  if (J === 'Bông Tai') {
    if (!L || !E) throw new Error('MISSING_SPECS: Yêu cầu trọng lượng và đơn vị tính.');
    
    // Check VIP Pattern (Executive Manual Quote Required)
    if (/VIP|siêu to|full tấm|đặc biệt|cao cấp|KAT/i.test(H)) {
        return { labor_price: 0, type: 'MANUAL_QUOTE' };
    }

    if (L === 'Chiếc') {
      if (E <= 0.6) return { labor_price: 500000, type: 'FIXED' };
      if (E <= 1.2) return { labor_price: 1000000, type: 'FIXED' };
      if (E <= 2) {
         if (N <= 20000000) return { labor_price: 1000000, type: 'FIXED' };
         if (N <= 30000000) return { labor_price: 1500000, type: 'FIXED' };
         if (N <= 80000000) return { labor_price: 2500000, type: 'FIXED' };
      }
    }

    if (L === 'Đôi') {
      if (E <= 2 && N <= 20000000) return { labor_price: 2000000, type: 'FIXED' };
      if (E <= 2.5 && N <= 30000000) return { labor_price: 3000000, type: 'FIXED' };
      if (E <= 3.5 && N <= 80000000) return { labor_price: 5000000, type: 'FIXED' };
      if (E <= 8 && N <= 120000000) return { labor_price: 7000000, type: 'FIXED' };
      if (E > 8) return { labor_price: 10000000, type: 'FIXED' };
    }
  }

  // ===== DÂY CHUYỀN =====
  if (J === 'Dây chuyền') {
    if (/VIP|siêu to|khủng|KAT|hàng nhập/i.test(H)) {
        return { labor_price: 0, type: 'MANUAL_QUOTE' };
    }
    // Công thức tính lũy tiến dựa trên giá trị đá & trọng lượng
    const baseLabor = E * 500000; 
    const adjustment = N > 50000000 ? (N / 50000000) * 0.4 : 0;
    return { labor_price: Math.round(baseLabor * (1 + adjustment)), type: 'ALGORITHMIC' };
  }

  // ===== NHẪN / VÒNG (Fallback) =====
  return { labor_price: 0, type: 'MANUAL_QUOTE' };
}
