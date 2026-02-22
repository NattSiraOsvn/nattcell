
// src/services/dictionaryApprovalService.ts
import { v4 as uuidv4 } from 'uuid';
import SuperDictionary from '../superdictionary'; 
import { NotifyBus } from './notificationservice';
import { PersonaID, ApprovalStatus } from '@/types'; // Added ApprovalStatus

export interface ChangeProposal {
  id: string;
  type: 'ADD_FIELD' | 'MODIFY_FIELD' | 'REMOVE_FIELD' | 'ADD_RULE';
  target: string; // Field name or Rule ID
  newValue: any;
  oldValue?: any;
  reason: string;
  submitter: string;
  status: ApprovalStatus;
  impactAnalysis: {
    affectedRecords: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  timestamp: number;
}

class DictionaryApprovalService {
  private static instance: DictionaryApprovalService;
  private pendingChanges: ChangeProposal[] = [];
  
  static getInstance() {
    if (!DictionaryApprovalService.instance) DictionaryApprovalService.instance = new DictionaryApprovalService();
    return DictionaryApprovalService.instance;
  }

  // ✅ Submit Change
  async proposeChange(
    type: ChangeProposal['type'], 
    target: string, 
    newValue: any, 
    reason: string,
    submitter: string
  ): Promise<ChangeProposal> {
    
    // 1. Analyze Impact
    const impact = await this.analyzeImpact(type, target);

    const proposal: ChangeProposal = {
      id: `DICT-CHG-${uuidv4().slice(0,6).toUpperCase()}`,
      type,
      target,
      newValue,
      reason,
      submitter,
      status: ApprovalStatus.PENDING,
      impactAnalysis: impact,
      timestamp: Date.now()
    };

    this.pendingChanges.push(proposal);
    
    // Notify Admins
    NotifyBus.push({
      type: 'RISK',
      title: 'Yêu cầu thay đổi Từ điển',
      content: `User ${submitter} muốn ${type} trường ${target}. Mức độ ảnh hưởng: ${impact.riskLevel}`,
      persona: PersonaID.KRIS
    });

    return proposal;
  }

  // ✅ Analyze Impact
  private async analyzeImpact(type: string, target: string) {
    // Mock logic: Calculate how many records use this field
    const recordCount = Math.floor(Math.random() * 5000); 
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';

    if (type === 'REMOVE_FIELD') riskLevel = 'HIGH';
    if (type === 'MODIFY_FIELD' && recordCount > 1000) riskLevel = 'MEDIUM';

    return {
      affectedRecords: recordCount,
      riskLevel
    };
  }

  // ✅ Approve/Reject
  async reviewChange(id: string, decision: 'APPROVE' | 'REJECT', reviewer: string) {
    const proposal = this.pendingChanges.find(p => p.id === id);
    if (!proposal) throw new Error("Proposal not found");

    if (decision === 'REJECT') {
      proposal.status = ApprovalStatus.REJECTED;
      return;
    }

    // Apply Change
    proposal.status = ApprovalStatus.APPROVED;
    await this.applyChange(proposal);

    NotifyBus.push({
      type: 'SUCCESS',
      title: 'Dictionary Updated',
      content: `Thay đổi ${proposal.id} đã được áp dụng vào hệ thống lõi.`,
      persona: PersonaID.THIEN
    });
  }

  private async applyChange(p: ChangeProposal) {
    console.log(`[Dictionary] Applying change ${p.type} on ${p.target} to ${JSON.stringify(p.newValue)}`);
    // Here we would call SuperDictionary.updateTerm(...) or similar
    // For now, simulated.
  }

  public getPendingProposals() { return this.pendingChanges.filter(p => p.status === ApprovalStatus.PENDING); }
  public getHistory() { return this.pendingChanges.filter(p => p.status !== ApprovalStatus.PENDING); }
}

export const DictApproval = DictionaryApprovalService.getInstance();

export class DictApprovalService {
  static getPendingProposals(): unknown[] { return []; }
  static reviewChange(_id: string, _decision: string, _reviewer: string): void {}
}
export default DictApprovalService;
