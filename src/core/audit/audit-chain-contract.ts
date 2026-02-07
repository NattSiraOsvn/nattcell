
// ============================================================
// ARTEFACT 1: AUDIT CHAIN CONTRACT
// Owner: TEAM 4 (Băng)
// Status: ENFORCED
// ============================================================

import { AuditRecord, AuditActor } from '@/types';

// 1. CANONICAL PAYLOAD RULES
export const CANONICAL_RULES = {
  sortKeys: true,
  removeNulls: true,
  normalizeStrings: true,
  normalizeNumbers: true, // Decimal string enforced
  normalizeDates: true,   // ISO 8601 UTC
  preserveArrayOrder: true,
  encoding: "utf-8"
};

// 4. IMPLEMENTATION
export class AuditChainContract {
  
  /**
   * Canonicalize any object according to rules
   * Fix 3: Financial numbers MUST be strings
   */
  static canonicalize(obj: any): string {
    const sorted = this.sortObject(obj);
    return JSON.stringify(sorted, (key, value) => {
      if (value === null || value === undefined) return undefined;
      if (typeof value === 'string') return value.trim().normalize('NFC');
      
      // Fix 3: No floating point numbers allowed for financial data
      if (typeof value === 'number') {
          // Convert to string to avoid float precision issues in hashing
          // This ensures 100.00 and 100 produce same hash
          return value.toString();
      }
      return value;
    });
  }
  
  private static sortObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.sortObject(item));
    }
    if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj)
        .sort()
        .reduce((result: any, key) => {
          result[key] = this.sortObject(obj[key]);
          return result;
        }, {});
    }
    return obj;
  }
  
  /**
   * Compute payload hash
   */
  static async computePayloadHash(payload: object): Promise<string> {
    const canonical = this.canonicalize(payload);
    return this.sha256(canonical);
  }
  
  /**
   * Compute entry hash (the chain link)
   * Fix 2: Exclude record_id from hash input
   * Fix 1: Include tenant_id and chain_id
   */
  static async computeEntryHash(record: Omit<AuditRecord, 'entry_hash' | 'record_id'>): Promise<string> {
    const hashInput = [
      record.tenant_id,
      record.chain_id,
      record.sequence_number.toString(),
      record.timestamp,
      record.event_type,
      this.canonicalize(record.actor),
      record.payload_hash,
      record.prev_hash
    ].join('|');
    
    return this.sha256(hashInput);
  }
  
  private static async sha256(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
