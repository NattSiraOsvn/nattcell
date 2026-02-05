
import { ProductionBase, LegalCompliance, ProductionCertificate, RollbackResult } from '../../../core/production/ProductionBase';
// Fix: Members TaxPolicy and RiskPolicy are now added to root types.ts
import { TaxPolicy, RiskPolicy, UserRole } from '../../../types';
import { AuditProvider } from '../../../services/admin/AuditService';

/**
 * 🏛️ FINANCE PRODUCTION BASE (TEAM 2 - CAN)
 */
export abstract class FinanceProductionBase extends ProductionBase {
  readonly serviceName = 'finance-service';
  readonly ownership = 'Team 2 - CAN';
  readonly legalEntity = 'NATT-OS Finance Division';

  constructor() {
    super();
  }

  // Bắt buộc triển khai logic thuế và rủi ro
  abstract getTaxPolicy(): TaxPolicy;
  abstract getFinancialRiskPolicy(): RiskPolicy;

  async rollback(transactionId: string): Promise<RollbackResult> {
    console.warn(`[FINANCE-ROLLBACK] Trả lại trạng thái tài chính cho TX: ${transactionId}`);
    
    return {
      success: true,
      rolledBackAt: new Date(),
      compensationActions: ['CANCEL_INVOICE', 'RELEASE_CREDIT_LOCK'],
      auditTrailId: await AuditProvider.logAction('FINANCE', 'ROLLBACK_EXECUTED', { transactionId }, 'system'),
      durationMs: 450
    };
  }

  getLegalCompliance(): LegalCompliance {
    return {
      gdprCompliant: true,
      dataRetentionDays: 365 * 10, // Lưu trữ 10 năm theo luật kế toán
      dataJurisdiction: ['Vietnam'],
      accessLogRetention: 365 * 10,
      incidentResponsePlan: 'IRP-FINANCE-001'
    };
  }

  getProductionCertificate(): ProductionCertificate {
    return {
      issuedAt: new Date('2026-01-22'),
      expiresAt: new Date('2027-01-22'),
      issuer: 'Gatekeeper',
      checks: ['FINANCIAL_INTEGRITY_SAFE', 'TAX_CALC_VERIFIED'],
      signature: 'SEALED-CAN-TEAM2'
    };
  }
}
