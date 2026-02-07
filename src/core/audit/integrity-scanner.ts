
// ============================================================
// ARTEFACT 3: INTEGRITY SCANNER (Fix 5 Implemented)
// Owner: TEAM 4 (Băng)
// Status: ENFORCED
// ============================================================

import { AuditChainContract } from './auditchaincontract';
import { AuditRecord, IntegrityState, ScannerState } from '@/types';
import { AuditService } from '@/services/admin/auditservice'; // Access DB layer

export class IntegrityScanner {
  private static instance: IntegrityScanner;
  private readonly SCANNER_ID = 'MAIN_SCANNER';

  public static getInstance(): IntegrityScanner {
    if (!IntegrityScanner.instance) {
      IntegrityScanner.instance = new IntegrityScanner();
    }
    return IntegrityScanner.instance;
  }

  // Fix 5: Load state from DB (Simulated)
  private async loadState(): Promise<ScannerState> {
     // In prod, this queries audit_scanner_state table
     const raw = localStorage.getItem(`SCANNER_${this.SCANNER_ID}`);
     if (raw) return JSON.parse(raw);
     return {
         id: this.SCANNER_ID,
         current_status: 'OK',
         last_scan_time: 0,
         last_scan_head: 0,
         errors_found: 0,
         is_locked_down: false
     };
  }

  // Fix 5: Persist state to DB (Simulated)
  private async saveState(state: ScannerState): Promise<void> {
      localStorage.setItem(`SCANNER_${this.SCANNER_ID}`, JSON.stringify(state));
  }

  /**
   * Run Full Integrity Scan
   */
  public async scanChain(tenantId: string, chainId: string): Promise<IntegrityState> {
      const state = await this.loadState();
      const logs = AuditService.getInstance().getLogs(); // Fetch all logs (Mock DB)
      
      // Filter by tenant/chain (Fix 1)
      const chainLogs = logs.filter(l => l.tenant_id === tenantId && l.chain_id === chainId);
      
      // Sort by sequence (Fix 1)
      chainLogs.sort((a, b) => a.sequence_number - b.sequence_number);

      let prevHash = '0000000000000000000000000000000000000000000000000000000000000000'; // GENESIS
      let errorCount = 0;

      for (const record of chainLogs) {
          // Verify Links
          if (record.prev_hash !== prevHash) {
              console.error(`[AUDIT-SCAN] BROKEN CHAIN at Seq ${record.sequence_number}`);
              errorCount += 1;
          }
          
          // Verify Hash (Fix 2 Check)
          const calcHash = await AuditChainContract.computeEntryHash(record);
          if (calcHash !== record.entry_hash) {
              console.error(`[AUDIT-SCAN] TAMPERED RECORD at Seq ${record.sequence_number}`);
              errorCount += 1;
          }
          
          prevHash = record.entry_hash;
      }

      state.last_scan_time = Date.now();
      state.errors_found = errorCount;
      state.current_status = errorCount > 0 ? 'TAMPERED' : 'OK';
      
      if (errorCount > 0) {
          state.is_locked_down = true; // Trigger Lockdown
      }

      await this.saveState(state);
      
      return {
          isValid: state.current_status === 'OK',
          brokenAt: state.current_status === 'TAMPERED' ? new Date().toISOString() : undefined
      };
  }
  
  public async getStatus(): Promise<ScannerState> {
      return await this.loadState();
  }
}
