import { AuditEntry } from '../entities';

export interface ChainVerificationResult {
  isValid: boolean;
  brokenAt?: string;
  totalEntries: number;
  verifiedEntries: number;
}

export class AuditChainService {
  verifyChain(entries: AuditEntry[]): ChainVerificationResult {
    if (entries.length === 0) {
      return { isValid: true, totalEntries: 0, verifiedEntries: 0 };
    }

    const sorted = [...entries].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    let verifiedCount = 0;

    for (let i = 0; i < sorted.length; i++) {
      const current = sorted[i];
      const previous = i > 0 ? sorted[i - 1] : null;

      if (!current.verifyChain(previous)) {
        return {
          isValid: false,
          brokenAt: current.id,
          totalEntries: sorted.length,
          verifiedEntries: verifiedCount,
        };
      }
      verifiedCount++;
    }

    return { isValid: true, totalEntries: sorted.length, verifiedEntries: verifiedCount };
  }
}
