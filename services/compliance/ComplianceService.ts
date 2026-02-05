
import { 
  Policy, Certification, ComplianceRequest, AssessmentResult, 
  PolicyStatus, PolicyType, ComplianceRequestType 
} from '../../types.ts';

class ComplianceService {
  private static instance: ComplianceService;
  
  private policies: Policy[] = [];
  private certifications: Certification[] = [];
  private requests: ComplianceRequest[] = [];
  private assessments: AssessmentResult[] = [];

  constructor() {
    this.seedInitialData();
  }

  static getInstance() {
    if (!ComplianceService.instance) ComplianceService.instance = new ComplianceService();
    return ComplianceService.instance;
  }

  private seedInitialData() {
    const now = Date.now();
    // Seed Requests
    this.requests = [
      {
        id: 'req-001',
        code: 'REQ-2026-X01',
        title: 'Rà soát chênh lệch thuế VAT Q1',
        type: ComplianceRequestType.AUDIT_FOLLOWUP,
        priority: 'HIGH',
        status: 'UNDER_REVIEW',
        dueDate: now + (7 * 86400000),
        requesterId: 'MASTER_NATT'
      },
      {
        id: 'req-002',
        code: 'REQ-2026-X02',
        title: 'Gia hạn GIA 2234859601',
        type: ComplianceRequestType.CERT_RENEWAL,
        priority: 'MEDIUM',
        status: 'SUBMITTED',
        dueDate: now + (14 * 86400000),
        requesterId: 'WH_MANAGER'
      }
    ];

    // Seed Assessments
    this.assessments = [
      {
        id: 'ass-001',
        code: 'ASS-KHO-01',
        entityName: 'Kho Tổng HCM',
        score: 92.5,
        passed: true,
        riskLevel: 'LOW',
        assessmentDate: now - (5 * 86400000),
        nextAssessmentDate: now + (25 * 86400000),
        findings: ['Quy trình niêm phong ổn định', 'Cần cập nhật log camera Shard 3'],
        status: 'COMPLETED'
      }
    ];
  }

  async getPolicies() { return this.policies; }
  async getRequests() { return this.requests; }
  async getAssessments() { return this.assessments; }

  async getComplianceDashboard() {
    return {
      complianceScore: 88,
      pendingRequests: this.requests.filter(r => r.status !== 'COMPLETED').length,
      activeAlerts: 3,
      recentAssessments: this.assessments.slice(0, 5),
      policyStats: { total: 12, active: 10, underReview: 2 }
    };
  }
}

export const ComplianceProvider = ComplianceService.getInstance();
