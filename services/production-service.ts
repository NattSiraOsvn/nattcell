
import { 
  ProductionOrder, MaterialTransaction, WeightTracking, 
  OrderStatus, UserPosition, WorkerPerformance 
} from '../types';

/**
 * NATT-OS PRODUCTION ENGINE
 * Chuyên trách logic SNT, WAC và Bóc tách Hao hụt.
 */
export class ProductionService {
  
  /**
   * Tạo số Serial Number duy nhất (SNT) cho sản phẩm
   */
  static generateSerialNumber(sku: string): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    // Sanitize SKU to be safe for ID
    const safeSku = sku.replace(/[^a-zA-Z0-9]/g, '').substring(0, 5).toUpperCase();
    return `TL-${year}-${safeSku}-${random}`;
  }

  /**
   * Logic Bình Quân Gia Quyền (Moving Weighted Average)
   * Tính toán giá vốn mới khi có giao dịch nhập/xuất kho.
   */
  static calculateMovingAverage(
    currentStock: number, 
    currentAvgCost: number, 
    newQty: number, 
    newCost: number
  ): number {
    if (currentStock + newQty === 0) return 0;
    const totalValue = (currentStock * currentAvgCost) + (newQty * newCost);
    return totalValue / (currentStock + newQty);
  }

  /**
   * Bóc tách hao hụt thực tế
   */
  static calculateLoss(tracking: WeightTracking): { loss: number; percentage: number; isCritical: boolean } {
    const loss = tracking.weight_before - (tracking.weight_after + tracking.recovery_gold);
    const percentage = (loss / tracking.weight_before) * 100;
    
    // Ngưỡng hao hụt đặc thù (VD: 1.5% cho đúc, 3% cho nguội)
    const threshold = tracking.stage === OrderStatus.CASTING ? 1.5 : 3.0;
    
    return {
      loss,
      percentage,
      isCritical: percentage > threshold
    };
  }

  /**
   * Khởi tạo một thực thể ProductionOrder mới
   */
  static createOrder(data: Partial<ProductionOrder>): ProductionOrder {
    const now = Date.now();
    return {
      id: Math.random().toString(36).substring(7),
      serial_number: this.generateSerialNumber(data.sku || 'UNK'),
      production_code: `PO-${now}`,
      sku: data.sku || 'UNKNOWN_PRODUCT',
      customer_id: data.customer_id || 'WALK-IN',
      // Fixed: OrderStatus.DRAFT is now part of the consolidated enum
      status: data.status || OrderStatus.DRAFT,
      priority: data.priority || 'TRUNG_BÌNH',
      deadline: data.deadline || now + (7 * 24 * 60 * 60 * 1000),
      gold_type: data.gold_type || '18K',
      target_weight: data.target_weight || 0,
      stone_specs: [],
      weight_history: [],
      transactions: [],
      qc_reports: [],
      created_at: now,
      updated_at: now
    };
  }

  /**
   * AI AUTOMATION: Biến đổi dữ liệu thô từ AI thành Quy trình Sản xuất chuẩn
   */
  static generateWorkflowFromAI(aiData: any): ProductionOrder {
    console.log("[PROD-ENGINE] AI Auto-generating workflow for:", aiData);
    
    // 1. Phân tích Deadline (Nếu AI trả về string "7 ngày" hoặc date)
    let deadlineTimestamp = Date.now() + (7 * 86400000);
    if (aiData.deadline) {
        // Simple heuristic check
        if (!isNaN(Date.parse(aiData.deadline))) {
            deadlineTimestamp = Date.parse(aiData.deadline);
        }
    }

    // 2. Map dữ liệu
    return this.createOrder({
        sku: aiData.sku || "AI_DETECTED_ITEM",
        customer_id: aiData.customer || "UNKNOWN_CUSTOMER",
        gold_type: aiData.gold_type || "18K",
        priority: "CAO", // Ưu tiên cao cho đơn tự động
        deadline: deadlineTimestamp,
        // Tự động chuyển trạng thái sang DESIGNING nếu có thông tin
        status: aiData.sku ? OrderStatus.DESIGNING : OrderStatus.SALE_ORDER
    });
  }
}
