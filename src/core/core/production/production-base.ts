
import { AuditProvider } from '../../services/admin/auditservice';
import { ProductionEnforcer } from './productionenforcer';

export interface LegalCompliance {
  gdprCompliant: boolean;
  dataRetentionDays: number;
  dataJurisdiction: string[];
  accessLogRetention: number;
  incidentResponsePlan: string;
}

export interface ProductionCertificate {
  issuedAt: Date;
  expiresAt: Date;
  issuer: 'Gatekeeper';
  checks: string[];
  signature: string;
}

export interface RollbackResult {
  success: boolean;
  rolledBackAt: Date;
  compensationActions: string[];
  auditTrailId: string;
  durationMs: number;
}

/**
 * 🛡️ PRODUCTION BASE CLASS
 * Mọi service chính tắc trong NATT-OS bắt buộc phải kế thừa lớp này.
 */
export abstract class ProductionBase {
  abstract readonly serviceName: string;
  abstract readonly serviceVersion: string;
  abstract readonly ownership: string;
  abstract readonly legalEntity: string;
  
  constructor() {
    // Chặn các implementation mang danh nghĩa Demo/Mock/Prototype
    const className = this.constructor.name;
    if (className.includes('Prototype') || 
        className.includes('Demo') ||
        className.includes('Mock')) {
      throw new Error(
        `Service ${className} vi phạm quy tắc Production-Only. Tuyệt đối không dùng bản demo trong lõi hệ thống.`
      );
    }

    // Kiểm tra tính sẵn sàng của Service
    const check = ProductionEnforcer.validateService(this);
    if (!check.valid) {
      throw new Error(check.message);
    }
    
    // Ghi nhận khởi tạo vào Sổ cái Audit
    AuditProvider.logAction(
      'SYSTEM', 
      'SERVICE_INITIALIZED', 
      { service: className, version: "v1.0.0" }, 
      'system'
    );
  }
  
  // Phương thức bắt buộc cho cơ chế bù trừ (Compensation)
  abstract rollback(transactionId: string): Promise<RollbackResult>;
  abstract getLegalCompliance(): LegalCompliance;
  abstract getProductionCertificate(): ProductionCertificate;
  
  /**
   * Công cụ Audit nội bộ cho các phương thức nhạy cảm
   */
  protected async auditMethodCall(
    methodName: string,
    params: any,
    userId: string = 'system'
  ): Promise<string> {
    return await AuditProvider.logAction(
      this.serviceName,
      `METHOD_${methodName.toUpperCase()}`,
      { params, timestamp: new Date().toISOString() },
      userId
    );
  }
}
