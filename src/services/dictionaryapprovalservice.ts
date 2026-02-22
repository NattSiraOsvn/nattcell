export interface DictApproval {
  id: string;
  status: string;
  [key: string]: unknown;
}
export class DictApproval {
  static getPendingProposals(): DictApproval[] { return []; }
  static reviewChange(_id: string, _decision: string, _reviewer: string): void {}
}
export interface ChangeProposal {
  id: string;
  type: string;
  [key: string]: unknown;
}
