
import { BusinessContext, ScoreResult, DataPoint } from '../../types';

export class ContextScoringEngine {
  private static instance: ContextScoringEngine;

  // Trọng số cơ bản (Base Weights)
  private readonly SCORE_WEIGHTS = {
    sourceReliability: 0.35,  // Nguồn gốc (Ai nhập?)
    temporalRecency: 0.20,    // Độ mới (Khi nào?)
    dataCompleteness: 0.20,   // Độ đầy đủ (Có đủ trường ko?)
    businessValidation: 0.15, // Logic nghiệp vụ (Giá có âm ko?)
    crossReference: 0.10      // Đối chiếu chéo (Kho có khớp Sales ko?)
  };

  public static getInstance(): ContextScoringEngine {
    if (!ContextScoringEngine.instance) {
      ContextScoringEngine.instance = new ContextScoringEngine();
    }
    return ContextScoringEngine.instance;
  }

  /**
   * Hàm tính điểm chính: Kết hợp 5 chiều dữ liệu để ra Confidence Score cuối cùng
   */
  async scoreDataContext(dataPoint: DataPoint, context: BusinessContext): Promise<ScoreResult> {
    const data = dataPoint.payload;

    // 1. Tính điểm thành phần (Parallel Execution)
    const [sourceScore, temporalScore, completenessScore, validationScore, crossRefScore] = await Promise.all([
      this.calculateSourceScore(dataPoint.source),
      this.calculateTemporalScore(dataPoint.timestamp, context.dataType),
      this.calculateCompletenessScore(data, context.industry),
      this.validateBusinessRules(data, context),
      this.checkCrossReferences(dataPoint)
    ]);

    // 2. Tính điểm trọng số (Weighted Sum)
    let finalScore = 
      (sourceScore * this.SCORE_WEIGHTS.sourceReliability) +
      (temporalScore * this.SCORE_WEIGHTS.temporalRecency) +
      (completenessScore * this.SCORE_WEIGHTS.dataCompleteness) +
      (validationScore * this.SCORE_WEIGHTS.businessValidation) +
      (crossRefScore * this.SCORE_WEIGHTS.crossReference);

    // 3. Hiệu chỉnh đặc thù ngành (Industry Adjustment)
    // Ví dụ: Ngành Trang sức cực kỳ nhạy cảm với sai số -> Phạt nặng nếu dữ liệu không trọn vẹn
    if (context.industry === 'JEWELRY') {
        if (completenessScore < 0.8) finalScore *= 0.8; // Phạt 20% nếu thiếu thông tin đá/vàng
    }
    
    // Nếu là dữ liệu Tài chính, ưu tiên độ chính xác tuyệt đối
    if (context.industry === 'FINANCE') {
       if (validationScore < 1.0) finalScore *= 0.5; // Phạt 50% nếu vi phạm quy tắc kế toán
    }

    return {
      finalScore: parseFloat(finalScore.toFixed(4)),
      details: {
        source: sourceScore,
        temporal: temporalScore,
        completeness: completenessScore,
        validation: validationScore,
        crossRef: crossRefScore
      },
      confidenceLevel: finalScore >= 0.85 ? 'HIGH' : finalScore >= 0.6 ? 'MEDIUM' : 'LOW',
      recommendation: this.generateRecommendation(finalScore)
    };
  }

  // --- COMPONENT CALCULATORS ---

  private calculateSourceScore(source: string): number {
    const map: Record<string, number> = {
      'MASTER_MANUAL': 1.0, // Anh Natt nhập -> Tuyệt đối
      'DIRECT_API': 0.95,   // TCT/Bank API -> Rất cao
      'OMEGA_OCR': 0.85,    // AI bóc tách -> Khá
      'LEGACY_SYNC': 0.60,  // Hệ thống cũ -> Trung bình
      'UNKNOWN': 0.30
    };
    return map[source] || 0.5;
  }

  private calculateTemporalScore(timestamp: number, dataType: string): number {
    const ageInHours = (Date.now() - timestamp) / (1000 * 60 * 60);
    
    // Dữ liệu biến động nhanh (Giá vàng, Tỷ giá) -> Suy giảm nhanh (Decay fast)
    if (['GOLD_PRICE', 'STOCK_LEVEL', 'EXCHANGE_RATE'].includes(dataType)) {
       // Decay 50% sau 24h
       return Math.exp(-ageInHours / 24);
    }
    
    // Dữ liệu ổn định (Hồ sơ nhân sự, Danh mục) -> Suy giảm chậm (Decay slow)
    if (['EMPLOYEE_PROFILE', 'PRODUCT_CATALOG'].includes(dataType)) {
        // Decay 10% sau 1 năm (8760h)
        return Math.exp(-ageInHours / 87600);
    }

    // Mặc định: Decay 50% sau 7 ngày
    return Math.exp(-ageInHours / 168);
  }

  private calculateCompletenessScore(data: any, industry: string): number {
    if (!data || typeof data !== 'object') return 0;
    
    const keys = Object.keys(data);
    const filledKeys = keys.filter(k => data[k] !== null && data[k] !== undefined && data[k] !== '');
    let score = filledKeys.length / keys.length;

    // Critical fields check based on Industry
    if (industry === 'JEWELRY') {
       const criticals = ['weight', 'gold_type', 'stone_spec'];
       const hasCriticals = criticals.every(k => keys.includes(k) ? (data[k] ? true : false) : true);
       if (!hasCriticals) score *= 0.5; // Phạt nặng nếu thiếu thông tin vàng/đá
    }

    return score;
  }

  private validateBusinessRules(data: any, context: BusinessContext): number {
    // 1. Kiểm tra số âm với trường tiền tệ
    if (data.amount !== undefined && typeof data.amount === 'number' && data.amount < 0) return 0;
    if (data.price !== undefined && typeof data.price === 'number' && data.price < 0) return 0;

    // 2. Kiểm tra Logic Thuế (VAT không quá 100%)
    if (data.taxRate !== undefined && data.taxRate > 100) return 0.2;

    // 3. Kiểm tra Logic Tồn kho (Min Stock)
    if (context.industry === 'LOGISTICS' && data.quantity !== undefined && data.quantity < 0) return 0;

    return 1.0;
  }

  private async checkCrossReferences(dataPoint: DataPoint): Promise<number> {
    // Giả lập logic kiểm tra chéo (Trong thực tế sẽ query DB khác)
    // VD: Nếu Sales Order có Invoice ID -> Check xem Invoice ID có tồn tại bên Shard Finance không
    
    if (dataPoint.payload.invoiceId) {
       // Mock: 90% khớp
       return Math.random() > 0.1 ? 1.0 : 0.5; 
    }

    return 0.8; // Mặc định tin cậy mức khá nếu không có tham chiếu
  }

  private generateRecommendation(score: number): string {
    if (score >= 0.95) return "AUTO_MERGE: Dữ liệu hoàn hảo.";
    if (score >= 0.85) return "AUTO_ACCEPT: Dữ liệu đáng tin cậy.";
    if (score >= 0.60) return "MANUAL_REVIEW: Cần kiểm tra lại (Cảnh báo vàng).";
    return "REJECT: Dữ liệu rủi ro cao hoặc lỗi nghiêm trọng.";
  }
}

export const ContextScoring = ContextScoringEngine.getInstance();
