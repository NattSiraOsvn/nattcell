
import { ApprovalRequest, ApprovalTicket, ApprovalStatus, UserRole } from '@/types';
import { NotifyBus } from '../notificationservice';
import { PersonaID } from '@/types';

export interface ApprovalStats {
  pending: number;
  approvedToday: number;
  rejectedToday: number;
  avgResponseTime: string;
}

export class ApprovalWorkflowService {
  private static instance: ApprovalWorkflowService;
  private tickets: ApprovalTicket[] = []; // In-memory store (Mock DB)

  public static getInstance(): ApprovalWorkflowService {
    if (!ApprovalWorkflowService.instance) {
      ApprovalWorkflowService.instance = new ApprovalWorkflowService();
      // Load mock data
      ApprovalWorkflowService.instance.loadMockData();
    }
    return ApprovalWorkflowService.instance;
  }

  private loadMockData() {
    this.tickets = [
      {
        id: 'TICKET-001',
        request: {
          recordType: 'TRANSACTION',
          changeType: 'UPDATE',
          proposedData: { amount: 150000000, note: 'Điều chỉnh giá vốn lô kim cương' },
          priority: 'HIGH',
          reason: 'Sai lệch tỷ giá nhập khẩu',
          requestedBy: 'USR-ACC-01'
        },
        status: ApprovalStatus.PENDING,
        requestedAt: Date.now() - 3600000,
        workflowStep: 1,
        totalSteps: 2
      },
      {
        id: 'TICKET-002',
        request: {
          recordType: 'DICTIONARY',
          changeType: 'CREATE',
          proposedData: { term: 'SKU_JADE_2026', desc: 'Mã Ngọc Bích Mới' },
          priority: 'LOW',
          reason: 'Thêm mã mới cho BST Mùa Xuân',
          requestedBy: 'USR-PROD-05'
        },
        status: ApprovalStatus.APPROVED,
        requestedAt: Date.now() - 86400000,
        approvedBy: 'ADMIN_NATT',
        approvedAt: Date.now() - 43200000,
        workflowStep: 1,
        totalSteps: 1
      }
    ];
  }

  async submitForApproval(data: ApprovalRequest): Promise<ApprovalTicket> {
    // 1. Kiểm tra Auto-Approve (Logic giả lập)
    if (this.shouldAutoApprove(data)) {
      return this.createTicket(data, ApprovalStatus.APPROVED);
    }
    
    // 2. Tạo ticket Pending
    const ticket = this.createTicket(data, ApprovalStatus.PENDING);
    
    // 3. Gửi thông báo
    NotifyBus.push({
      type: 'RISK', // Dùng loại RISK để gây chú ý cho việc phê duyệt
      title: 'YÊU CẦU PHÊ DUYỆT MỚI',
      content: `Yêu cầu từ ${data.requestedBy}: ${data.changeType} ${data.recordType}. Lý do: ${data.reason}`,
      priority: data.priority === 'CRITICAL' ? 'HIGH' : 'MEDIUM',
      persona: PersonaID.KRIS
    });

    return ticket;
  }

  private createTicket(request: ApprovalRequest, status: ApprovalStatus): ApprovalTicket {
    const ticket: ApprovalTicket = {
      id: `TICKET-${Date.now().toString().slice(-6)}`,
      request,
      status,
      requestedAt: Date.now(),
      workflowStep: 1,
      totalSteps: request.priority === 'CRITICAL' ? 2 : 1 // Critical cần 2 cấp duyệt
    };
    
    if (status === ApprovalStatus.APPROVED) {
        ticket.approvedBy = 'AUTO_SYSTEM';
        ticket.approvedAt = Date.now();
    }

    this.tickets.unshift(ticket);
    return ticket;
  }

  private shouldAutoApprove(data: ApprovalRequest): boolean {
    // Logic: Tự động duyệt nếu độ ưu tiên thấp và thay đổi nhỏ
    if (data.priority === 'LOW' && data.changeType === 'UPDATE') return true;
    return false;
  }

  // --- ACTIONS ---

  async approveTicket(ticketId: string, approverId: string) {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (!ticket) throw new Error("Ticket not found");

    ticket.status = ApprovalStatus.APPROVED;
    ticket.approvedBy = approverId;
    ticket.approvedAt = Date.now();

    NotifyBus.push({
      type: 'SUCCESS',
      title: 'ĐÃ PHÊ DUYỆT',
      content: `Ticket ${ticketId} đã được duyệt bởi ${approverId}.`,
      persona: PersonaID.THIEN
    });
  }

  async rejectTicket(ticketId: string, approverId: string, reason: string) {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (!ticket) throw new Error("Ticket not found");

    ticket.status = ApprovalStatus.REJECTED;
    ticket.rejectionReason = reason;
    ticket.approvedBy = approverId; // Người từ chối
    ticket.approvedAt = Date.now();
  }

  // --- GETTERS ---
  
  getStats(): ApprovalStats {
    const now = Date.now();
    const todayStart = new Date().setHours(0,0,0,0);
    
    return {
        pending: this.tickets.filter(t => t.status === ApprovalStatus.PENDING).length,
        approvedToday: this.tickets.filter(t => t.status === ApprovalStatus.APPROVED && (t.approvedAt || 0) > todayStart).length,
        rejectedToday: this.tickets.filter(t => t.status === ApprovalStatus.REJECTED && (t.approvedAt || 0) > todayStart).length,
        avgResponseTime: '1.5 giờ' // Mock static for now
    };
  }

  getTickets(filterStatus: ApprovalStatus | 'ALL' = 'ALL'): ApprovalTicket[] {
      if (filterStatus === 'ALL') return this.tickets;
      return this.tickets.filter(t => t.status === filterStatus);
  }
}

export const ApprovalEngine = ApprovalWorkflowService.getInstance();
