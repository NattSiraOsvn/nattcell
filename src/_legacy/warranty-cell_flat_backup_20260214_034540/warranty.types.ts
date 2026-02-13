/**
 * Warranty Types — Tâm Luxury
 * Cell: warranty-cell | Wave: 3.5
 *
 * Logic đặc thù ngành trang sức:
 * - Bảo hành trọn đời (xi, mạ, làm mới)
 * - Dịch vụ sửa chữa có phí (hàn, gắn đá, thay khóa)
 * - Chính sách VIP: free dịch vụ theo tier
 */

/** Loại dịch vụ bảo hành */
export type WarrantyServiceType =
  | 'POLISH'            // Đánh bóng
  | 'REPLATE'           // Xi mạ lại (vàng trắng, vàng hồng)
  | 'RESIZE'            // Thay đổi size nhẫn/vòng
  | 'STONE_RESET'       // Gắn lại đá
  | 'STONE_REPLACE'     // Thay đá mới
  | 'SOLDER'            // Hàn
  | 'CLASP_REPLACE'     // Thay khóa
  | 'ENGRAVING'         // Khắc chữ
  | 'FULL_RESTORATION'  // Tân trang toàn bộ
  | 'CLEANING';         // Vệ sinh siêu âm

/** Chính sách phí */
export type FeePolicy =
  | 'FREE_LIFETIME'     // Miễn phí trọn đời (mua tại shop)
  | 'FREE_VIP'          // Miễn phí theo tier VIP
  | 'DISCOUNTED'        // Giảm giá
  | 'FULL_PRICE';       // Trả đủ

/** Trạng thái phiếu bảo hành */
export type WarrantyTicketStatus =
  | 'RECEIVED'          // Đã tiếp nhận
  | 'DIAGNOSING'        // Đang chẩn đoán
  | 'QUOTED'            // Đã báo giá
  | 'CUSTOMER_APPROVED' // Khách đồng ý
  | 'IN_PROGRESS'       // Đang thực hiện
  | 'QUALITY_CHECK'     // Kiểm tra chất lượng
  | 'READY'             // Sẵn sàng trả
  | 'RETURNED'          // Đã trả khách
  | 'CANCELLED';        // Hủy

/** Chẩn đoán sản phẩm */
export interface ProductDiagnosis {
  issues: string[];
  recommendedServices: WarrantyServiceType[];
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  estimatedDuration: string;   // VD: "2 ngày", "1 tuần"
  materialNeeded?: {
    type: string;              // VD: "Vàng 18K", "Kim cương 3ly"
    quantity: number;
    estimatedCost: number;
  }[];
}

/** Báo giá dịch vụ */
export interface ServiceQuote {
  services: {
    type: WarrantyServiceType;
    basePrice: number;
    feePolicy: FeePolicy;
    finalPrice: number;        // Sau khi áp dụng policy
    reason: string;            // VD: "Free - VIP Gold", "Giảm 50% - mua tại shop"
  }[];
  materialCost: number;
  laborCost: number;
  totalQuote: number;
  validUntil: Date;
}

/** Entity chính */
export interface WarrantyTicket {
  id: string;
  customerId: string;
  customerTier?: string;        // VIP tier (ảnh hưởng fee policy)
  
  /** Sản phẩm */
  productDescription: string;
  originalPurchaseId?: string;  // ID đơn mua gốc → quyết định bảo hành free hay không
  purchasedAtShop: boolean;     // Mua tại Tâm Luxury?
  
  /** Chẩn đoán */
  diagnosis?: ProductDiagnosis;
  
  /** Báo giá */
  quote?: ServiceQuote;
  
  /** Trạng thái */
  status: WarrantyTicketStatus;
  servicesPerformed: WarrantyServiceType[];
  
  /** Tracking */
  receivedAt: Date;
  estimatedCompletion?: Date;
  actualCompletion?: Date;
  returnedAt?: Date;
  
  /** Ghi chú nội bộ */
  technicianNotes?: string;
  qualityCheckPassed?: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}
