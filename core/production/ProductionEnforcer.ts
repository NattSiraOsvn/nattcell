
/**
 * 🏛️ PRODUCTION ENFORCER - NATT-OS GLOBAL POLICY
 * Đảm bảo không có mã nguồn prototype hoặc demo lọt vào hệ thống vận hành.
 */

export interface ValidationResult {
  valid: boolean;
  violations?: Array<{ file: string; reason: string; matches: string[] }>;
}

export class ProductionEnforcer {
  static readonly GLOBAL_FLAG_NO_PROTOTYPE = true;
  
  /**
   * Quét nội dung tập tin tìm các dấu hiệu "Prototype/Demo" bị cấm.
   */
  static validateCode(filePath: string, content: string): ValidationResult {
    const prohibitedPatterns = [
      { pattern: /prototype/i, reason: "PROTOTYPE_CODE_FORBIDDEN" },
      { pattern: /demo[^S]/i, reason: "DEMO_CODE_FORBIDDEN" },
      { pattern: /temp\s*solution/i, reason: "TEMPORARY_SOLUTION_FORBIDDEN" },
      { pattern: /quick\s*fix/i, reason: "QUICK_FIX_FORBIDDEN" },
      { pattern: /TODO:|FIXME:/i, reason: "UNRESOLVED_TASK_FORBIDDEN" }
    ];
    
    const violations = [];
    for (const { pattern, reason } of prohibitedPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        violations.push({
          file: filePath,
          reason,
          matches: matches.slice(0, 3)
        });
      }
    }
    
    return { valid: violations.length === 0, violations: violations.length > 0 ? violations : undefined };
  }
  
  /**
   * Xác thực Service đạt chuẩn Production-Grade.
   */
  static validateService(service: any): { valid: boolean; message?: string } {
    const requiredMethods = ['rollback', 'getLegalCompliance', 'getProductionCertificate'];
    const missing = requiredMethods.filter(m => typeof service[m] !== 'function');
    
    if (missing.length > 0) {
      return {
        valid: false,
        message: `Service không đạt chuẩn Production: Thiếu [${missing.join(', ')}]`
      };
    }
    
    return { valid: true };
  }
}
