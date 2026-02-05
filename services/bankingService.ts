
// 🛠️ Fixed: Import casing for Types
import { BankTransaction, ValueGroup, PersonaID } from '../types';
import { ShardingService } from './blockchainService';

/**
 * 🧬 BỘ THUỘC TÍNH VÂN TAY SỐ (MANDATORY ATTRIBUTES)
 * Niêm phong bởi Anh Natt - 04/01/2026
 */
export const FINGERPRINT_SCHEMAS = {
  RETAIL: {
    label: 'GIAO DỊCH BÁN LẺ (SHOWROOM)',
    requiredFields: ['ORDER_ID', 'SELLER_ID', 'POS_TERMINAL_ID'],
    securityLevel: 'STANDARD'
  },
  WHOLESALE: {
    label: 'GIAO DỊCH SỈ (CONTRACT)',
    requiredFields: ['CONTRACT_ID', 'TAX_ID_PARTNER', 'BANK_AUTH_CODE'],
    securityLevel: 'HIGH'
  },
  EXCHANGE: {
    label: 'GIAO DỊCH THU ĐỔI (REDEEM)',
    requiredFields: ['GDB_REF', 'ORIG_INVOICE_HASH', 'IDENTITY_LINK_ID'],
    securityLevel: 'CRITICAL' // Chặn cứng tuyệt đối
  }
};

/**
 * 🕒 GIAO THỨC GỠ TREO CON NGƯỜI (HUMAN RESOLUTION PROTOCOL)
 */
export const RESOLUTION_TIMELINE = [
  { 
    limit: 'T+4h', 
    role: 'Level 5 (Kế toán)', 
    action: 'Truy vấn & Bổ sung thuộc tính thiếu',
    traceLabel: 'RECON_LEVEL_1'
  },
  { 
    limit: 'T+8h', 
    role: 'Level 2 (Quản lý)', 
    action: 'Xác thực logic & Đối soát chéo Shard',
    traceLabel: 'VALIDATION_LEVEL_2'
  },
  { 
    limit: 'T+24h', 
    role: 'Master (Anh Natt/CFO)', 
    action: 'Niêm phong vĩnh viễn vào Ledger',
    traceLabel: 'FINAL_SEALING'
  }
];

export class BankingEngine {
  /**
   * Kiểm tra tính hợp lệ của vân tay số
   * Trả về danh sách thuộc tính còn thiếu
   */
  static verifyFingerprint(type: keyof typeof FINGERPRINT_SCHEMAS, payload: any): string[] {
    const schema = FINGERPRINT_SCHEMAS[type];
    return schema.requiredFields.filter(field => !payload[field]);
  }

  /**
   * Gỡ treo thủ công (Human Intervention)
   * Tạo Trace ID bất biến
   */
  static manualResolve(transactionId: string, userId: string, role: string, additionalData: any) {
    const traceData = {
      transactionId,
      resolver: userId,
      role,
      data: additionalData,
      timestamp: Date.now()
    };
    
    return {
      traceId: ShardingService.generateShardHash(traceData),
      status: 'RESOLVED_PENDING_APPROVAL'
    };
  }

  // Các logic bóc tách giả lập cũ...
  static getMockStuckTransactions() {
    return [
      { id: 'STK-001', type: 'EXCHANGE' as const, amount: 85000000, missing: ['GDB_REF', 'ORIG_INVOICE_HASH'], age: 2.5 },
      { id: 'STK-002', type: 'RETAIL' as const, amount: 12500000, missing: ['ORDER_ID'], age: 5.2 }
    ];
  }
}
