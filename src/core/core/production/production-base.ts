import { AuditProvider } from '@/services/admin/audit-service';
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
//     const isValid = ProductionEnforcer.validateService(this.serviceName);
//     if (!isValid) {
//       throw new Error(`Service ${this.serviceName} chưa được khởi tạo hợp lệ.`);
//     }
// 
//     AuditProvider.logAction('SERVICE_START', { serviceName: this.serviceName, version: this.serviceVersion });
//   }
  }
}
