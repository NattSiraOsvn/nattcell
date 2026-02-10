/**
 * Buyback Types — Tâm Luxury
 * Cell: buyback-cell | Wave: 3.5
 *
 * Logic đặc thù ngành vàng:
 * - Khách bán lại trang sức cũ
 * - Giá thu mua ≠ Giá bán (có khấu hao, hao mòn, thời giá)
 * - Sau thu mua: phân loại Resell hoặc Scrap (nấu lại)
 */

/** Trạng thái món hàng thu mua */
export type BuybackItemStatus =
  | 'PENDING_INSPECTION'    // Chờ kiểm định
  | 'INSPECTED'             // Đã kiểm định
  | 'ACCEPTED'              // Chấp nhận thu mua
  | 'REJECTED'              // Từ chối
  | 'PAID'                  // Đã thanh toán cho khách
  | 'CLASSIFIED';           // Đã phân loại (Resell/Scrap)

/** Kết quả phân loại sau thu mua */
export type PostBuybackClassification =
  | 'RESELL'                // Bán lại (hàng còn tốt, có thể đánh bóng/làm mới)
  | 'SCRAP_GOLD'            // Nấu lại lấy vàng (hỏng, lỗi mốt)
  | 'SCRAP_STONE'           // Tháo đá giữ lại
  | 'REFURBISH';            // Tân trang rồi bán

/** Loại giao dịch thu mua */
export type BuybackTransactionType =
  | 'DIRECT_PURCHASE'       // Mua thẳng, trả tiền
  | 'TRADE_IN'              // Đổi cũ lấy mới (bù tiền)
  | 'CONSIGNMENT';          // Ký gửi bán hộ

/** Thông tin kiểm định */
export interface InspectionResult {
  goldPurity: number;         // Tuổi vàng thực tế (VD: 99.99, 75, 58.5)
  goldWeight: number;         // Trọng lượng vàng thực (gram) — sau khi trừ đá, phụ kiện
  stoneInfo?: {
    type: string;             // Loại đá: diamond, ruby, sapphire...
    caratWeight: number;
    quality: string;          // Chất lượng đánh giá
    estimatedValue: number;
  };
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'DAMAGED';
  hasOriginalCertificate: boolean;
  inspectedBy: string;
}

/** Công thức tính giá thu mua */
export interface BuybackPricing {
  marketGoldPrice: number;    // Giá vàng thị trường tại thời điểm
  goldValue: number;          // = goldWeight × marketGoldPrice × (goldPurity / 100)
  stoneValue: number;         // Giá trị đá (nếu có)
  depreciationRate: number;   // Tỷ lệ khấu hao (%) — phụ thuộc condition + tuổi
  laborDeduction: number;     // Trừ tiền công (không hoàn)
  finalBuybackPrice: number;  // = goldValue + stoneValue - depreciation - laborDeduction
}

/** Entity chính */
export interface BuybackTransaction {
  id: string;
  customerId: string;
  type: BuybackTransactionType;
  status: BuybackItemStatus;
  
  /** Thông tin món hàng */
  itemDescription: string;
  originalPurchaseId?: string;  // ID đơn mua gốc (nếu có)
  
  /** Kiểm định */
  inspection?: InspectionResult;
  
  /** Giá */
  pricing?: BuybackPricing;
  
  /** Phân loại sau thu mua */
  classification?: PostBuybackClassification;
  destinationInventoryType?: 'FINISHED_PRODUCT' | 'RAW_MATERIAL' | 'SCRAP';
  
  /** Nếu TRADE_IN */
  tradeInNewOrderId?: string;
  tradeInDifference?: number;   // Số tiền bù thêm (dương = khách trả, âm = shop trả)
  
  createdAt: Date;
  updatedAt: Date;
}
