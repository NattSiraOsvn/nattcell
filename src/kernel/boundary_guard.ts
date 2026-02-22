/**
 * NATT-OS KERNEL BOUNDARY GUARD
 * Enforces Constitutional Principle #6: Cell Autonomy & Quarantine
 */

export interface AccessContext {
    caller: string;
    target: string;
    timestamp: Date;
}

// Giả lập đọc Registry (Phase 1 sẽ đọc file thật)
const QUARANTINED_CELLS = ['WAREHOUSE-cell'];

export class SecurityKernel {
    static validateAccess(ctx: AccessContext): boolean {
        // 1. Kiểm tra Quarantine
        if (QUARANTINED_CELLS.includes(ctx.target)) {
            console.error(`[SECURITY] ⛔ BLOCKED: Access to quarantined cell '${ctx.target}' by '${ctx.caller}'`);
            throw new Error(`CONSTITUTION_VIOLATION: ${ctx.target} is under QUARANTINE.`);
        }

        // 2. Kiểm tra Caller (nếu Caller cũng bị Quarantine thì không được gọi ai)
        if (QUARANTINED_CELLS.includes(ctx.caller)) {
             console.error(`[SECURITY] ⛔ BLOCKED: Quarantined cell '${ctx.caller}' attempted outgoing call.`);
             throw new Error(`CONSTITUTION_VIOLATION: You are under QUARANTINE.`);
        }

        // 3. Log Audit
        console.log(`[AUDIT] ✅ ALLOWED: ${ctx.caller} -> ${ctx.target}`);
        return true;
    }
}

// === KERNEL_PHASE1_LOCK (additive) ===
// Phase 1 enforcement relies on filesystem scan + lockfile:
// - scripts/kernel_phase1_scan.mjs
// - src/governance/kernel.contracts.lock.json
// NOTE: This file is intentionally additive only.
export const KERNEL_PHASE1_LOCK = "src/governance/kernel.contracts.lock.json";
