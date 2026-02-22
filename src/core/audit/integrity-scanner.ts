// ============================================================
// ARTEFACT 3: INTEGRITY SCANNER (Fix 5 Implemented)
// Owner: TEAM 4 (Băng)
// Status: ENFORCED
// ============================================================

import { AuditChainContract } from './audit-chain-contract';
import { AuditRecord, IntegrityState, ScannerState } from '@/types';
import { AuditService } from '@/services/admin/audit-service'; // Access DB layer

export class IntegrityScanner {
  private static instance: IntegrityScanner;
  private readonly SCANNER_ID = 'MAIN_SCANNER';

  public static getInstance(): IntegrityScanner {
    if (!IntegrityScanner.instance) {
      IntegrityScanner.instance = new IntegrityScanner();
    }
    return IntegrityScanner.instance;
  }

  // Load state from DB (Simulated)
  private async loadState(): Promise<ScannerState> {
     const raw = localStorage.getItem(`SCANNER_${this.SCANNER_ID}`);
     if (raw) return JSON.parse(raw);
     return {
         id: this.SCANNER_ID,
         isActive: false,
         lastScan: 0,
         tHReatsFound: 0,
         status: 'CLEAN',
         last_scan_time: 0,
         last_scan_head: 0,
         errors_found: 0,
         is_locked_down: false,
         current_status: 'OK'
     };
  }

  // Persist state to DB (Simulated)
  private async saveState(state: ScannerState): Promise<void> {
      localStorage.setItem(`SCANNER_${this.SCANNER_ID}`, JSON.stringify(state));
  }

  /**
   * Run Full Integrity Scan
   */
  public async scanChain(tenantId: string, chainId: string): Promise<IntegrityState> {
      const state = await this.loadState();
      const logs = AuditService.getInstance().getLogs(); // Fetch all logs (Mock DB)
      
      // Filter by tenant/chain
      const chainLogs = logs.filter((l: any) => l.tenant_id === tenantId && l.chain_id === chainId);
      
      // Sort by sequence
      chainLogs.sort((a: any, b: any) => a.sequence_number - b.sequence_number);

      let prevHash = '0000000000000000000000000000000000000000000000000000000000000000'; // GENESIS
      let errorCount = 0;
      const violations: string[] = [];

      for (const record of chainLogs) {
          // Verify Links
          if (record.prev_hash !== prevHash) {
              console.error(`[AUDIT-SCAN] BROKEN CHAIN at Seq ${record.sequence_number}`);
              errorCount += 1;
              violations.push(`Broken chain at seq ${record.sequence_number}`);
          }
          
          // Verify Hash
          const calcHash = await AuditChainContract.computeEntryHash(record);
          if (calcHash !== record.entry_hash) {
              console.error(`[AUDIT-SCAN] TAMPERED RECORD at Seq ${record.sequence_number}`);
              errorCount += 1;
              violations.push(`Tampered record at seq ${record.sequence_number}`);
          }
          
          prevHash = record.entry_hash;
      }

      const newState: ScannerState = {
          id: this.SCANNER_ID,
          isActive: true,
          lastScan: Date.now(),
          tHReatsFound: errorCount,
          status: errorCount > 0 ? 'THREAT_DETECTED' : 'CLEAN',
          last_scan_time: Date.now(),
          last_scan_head: 0, // chưa có giá trị cụ thể
          errors_found: errorCount,
          is_locked_down: errorCount > 0,
          current_status: errorCount > 0 ? 'TAMPERED' : 'OK'
      };
      await this.saveState(newState);
      
      return {
          isValid: errorCount === 0,
          lastChecked: Date.now(),
          violations
      };
  }
  
  public async getStatus(): Promise<ScannerState> {
      return await this.loadState();
  }
}
