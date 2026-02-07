
import { AlertLevel, FraudCheckResult } from '@/types';
import { NotifyBus } from './notificationservice';
import { PersonaID } from '@/types';

// DỮ LIỆU LỊCH SỬ THU ĐỔI (Mock Database)
// identityHash giả lập là hash của CCCD hoặc Khuôn mặt khách hàng cũ
const REDEEM_HISTORY_INDEX = [
  { sku: 'NNA232', cert: 'VC8534', customer: 'Thịnh+Hải Anh Chiến', date: '08/07/2024', status: 'ĐÃ_THU', staffId: 'CFO', identityHash: 'hash_khach_A_face_123' },
  { sku: 'MD1148', cert: 'D1138', customer: 'Chị Linh Meow', date: '29/10/2024', status: 'ĐÃ_THU', staffId: 'S-007', identityHash: 'hash_khach_B_cccd_456' },
  { sku: 'NNU859', cert: '', customer: 'Chị Đào', date: '29/10/2024', status: 'ĐÃ_THU', staffId: 'CFO', identityHash: 'hash_khach_C_face_789' },
];

export class FraudGuardService {
  private static instance: FraudGuardService;
  
  static getInstance(): FraudGuardService {
    if (!FraudGuardService.instance) {
      FraudGuardService.instance = new FraudGuardService();
    }
    return FraudGuardService.instance;
  }

  private generateFingerprint(sku: string, certId: string): string {
    if (certId && certId.length > 3) return `CERT:${certId.replace(/\s/g, '').toUpperCase()}`;
    return `SKU:${sku.replace(/\s/g, '').toUpperCase()}`;
  }

  /**
   * LOGIC CỐT LÕI: Identity Binding Check
   * @param sku Mã sản phẩm
   * @param certId Mã kiểm định (nếu có)
   * @param staffId ID nhân viên đang thao tác
   * @param inputIdentityHash Hash của khách hàng hiện tại (Face hoặc CCCD)
   */
  public checkFraud(
    sku: string, 
    certId: string, 
    staffId: string,
    inputIdentityHash?: string
  ): FraudCheckResult {
    
    // 1. Tìm trong lịch sử xem sản phẩm này đã từng thu chưa
    const match = REDEEM_HISTORY_INDEX.find(record => {
      if (certId && record.cert && record.cert.includes(certId)) return true;
      if (sku && record.sku === sku && sku.length > 4) return true;
      return false;
    });

    // Nếu chưa từng thu -> An toàn (hoặc Info nếu cần check kỹ hơn)
    if (!match) {
      return {
        allowed: true,
        level: AlertLevel.INFO,
        message: "Sản phẩm sạch. Chưa có trong lịch sử thu đổi.",
        action: 'PROCEED'
      };
    }

    // 2. Nếu đã thu, bắt đầu check chéo Identity Binding
    if (inputIdentityHash) {
        const isSameStaff = match.staffId === staffId;
        
        // So sánh hash định danh (Giả sử so sánh chuỗi hash)
        // Trong thực tế sẽ cần ngưỡng tương đồng (Similarity Threshold) cho Face Hash
        const isDifferentIdentity = match.identityHash && match.identityHash !== inputIdentityHash;

        // --- RULE 1: GIAN LẬN CỐ Ý (FATAL) ---
        // SP Đã thu + Cùng nhân viên thu + Nhưng dùng định danh khách khác
        // => Dấu hiệu nhân viên đem hàng đã thu ra quay vòng để ăn chênh lệch lần 2
        if (isSameStaff && isDifferentIdentity) {
            this.lockAccountTrigger(staffId, "Cố ý thu đổi lặp với định danh giả mạo");
            return {
                allowed: false,
                level: AlertLevel.FATAL,
                message: `PHÁT HIỆN GIAN LẬN: Bạn đang cố thu lại sản phẩm ${match.sku} (đã thu ngày ${match.date}) nhưng dùng định danh khách hàng khác. HỆ THỐNG ĐÃ KHÓA TÀI KHOẢN.`,
                action: 'LOCK_ACCOUNT',
                historyRecord: match
            };
        }

        // --- RULE 2: TRÙNG LẶP HỆ THỐNG (WARNING) ---
        // SP Đã thu + Cùng nhân viên + Cùng định danh
        // => Có thể do mạng lag, click đúp, hoặc khách đổi ý quay lại
        if (isSameStaff && !isDifferentIdentity) {
             return {
                allowed: false,
                level: AlertLevel.INFO,
                message: `Giao dịch trùng lặp: Sản phẩm này vừa được thu từ cùng khách hàng này. Vui lòng kiểm tra lại giỏ hàng.`,
                action: 'BLOCK',
                historyRecord: match
            };
        }

        // --- RULE 3: NGHI VẤN (CRITICAL) ---
        // SP Đã thu + Khác nhân viên
        // => Cần quản lý duyệt để xác minh xem có phải hàng bán ra rồi thu lại lần nữa không
        if (!isSameStaff) {
             return {
                allowed: false, // Tạm chặn, cần Supervisor Override
                level: AlertLevel.CRITICAL,
                message: `CẢNH BÁO: Sản phẩm này đã được thu hồi bởi nhân sự khác (${match.staffId}). Cần Quản lý xác thực nguồn gốc.`,
                action: 'BLOCK',
                historyRecord: match
            };
        }
    } else {
        // Chưa có Identity Input -> Cảnh báo là hàng đã thu, yêu cầu định danh để verify
        return {
            allowed: false,
            level: AlertLevel.WARNING,
            message: `CẢNH BÁO: Sản phẩm ${match.sku} có trong lịch sử thu đổi. YÊU CẦU ĐỊNH DANH (Face/CCCD) để xác thực.`,
            action: 'WARN',
            historyRecord: match
        };
    }

    return {
        allowed: true,
        level: AlertLevel.INFO,
        message: "Check passed.",
        action: 'PROCEED'
    };
  }

  private lockAccountTrigger(userId: string, reason: string) {
    NotifyBus.push({
      type: 'RISK',
      title: 'AN NINH OMEGA: KHÓA TÀI KHOẢN',
      content: `User ${userId} bị khóa vĩnh viễn. Lý do: ${reason}.`,
      persona: PersonaID.KRIS,
      priority: 'HIGH'
    });
    
    // Trigger Security Overlay Lockdown
    import('../components/SecurityOverlay').then(() => {
        // Logic kích hoạt màn hình khóa đỏ (Red Screen of Death)
        // Trong kiến trúc React, việc này thường qua Context hoặc Event Bus
        // Ở đây ta giả lập qua EventBus mà SecurityOverlay đang lắng nghe
        const event = new CustomEvent('OMEGA_LOCKDOWN', { detail: { userId, reason } });
        window.dispatchEvent(event);
    });
  }
}

export const FraudGuard = FraudGuardService.getInstance();
