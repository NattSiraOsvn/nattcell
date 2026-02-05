
import { RefundRequest, ApprovalStatus, PersonaID } from '../types';
import { NotifyBus } from './notificationService';

class RefundWorkflowService {
  private static instance: RefundWorkflowService;
  private requests: RefundRequest[] = [];

  public static getInstance() {
    if (!RefundWorkflowService.instance) RefundWorkflowService.instance = new RefundWorkflowService();
    return RefundWorkflowService.instance;
  }

  async startRefundRequest(request: Omit<RefundRequest, 'id' | 'status' | 'timestamp'>): Promise<RefundRequest> {
    const newRequest: RefundRequest = {
      ...request,
      id: `REF-${Date.now()}`,
      status: ApprovalStatus.PENDING,
      timestamp: Date.now()
    };

    // 1. Phân tầng rủi ro
    const isHighValue = newRequest.amount > 5000000;
    
    // 2. Logging & Notification
    this.requests.push(newRequest);
    
    NotifyBus.push({
        type: 'RISK',
        title: 'Yêu cầu hoàn tiền mới',
        content: `Đơn: ${newRequest.orderId}. Số tiền: ${newRequest.amount.toLocaleString()} VND. Cần ${isHighValue ? 'Finance' : 'Manager'} duyệt.`,
        persona: PersonaID.KRIS,
        priority: isHighValue ? 'HIGH' : 'MEDIUM'
    });

    return newRequest;
  }

  async approve(id: string, approverRole: string) {
     const req = this.requests.find(r => r.id === id);
     if (!req) return;

     const isHighValue = req.amount > 5000000;
     
     if (isHighValue && approverRole !== 'FINANCE_MANAGER' && approverRole !== 'MASTER') {
         throw new Error("Yêu cầu > 5M bắt buộc Phòng tài chính phê duyệt.");
     }

     req.status = ApprovalStatus.APPROVED;
     
     NotifyBus.push({
        type: 'SUCCESS',
        title: 'Hoàn tiền hoàn tất',
        content: `Lệnh hoàn tiền ${req.id} đã được thực thi thành công.`,
        persona: PersonaID.THIEN
     });
  }

  getRequests() { return this.requests; }
}

export const RefundEngine = RefundWorkflowService.getInstance();
