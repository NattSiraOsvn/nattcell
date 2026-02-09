import { GateContext, GateResult } from "./types.js";
import { CONSTITUTIONAL_ROADLOAD_ID } from "./constitutional.js";
import { __CELL_INVOCATION_TOKEN__ } from "@/core/cell/_cell-internal.token";

/**
 * ============================================================
 * GATEKEEPER CORE – CONSTITUTIONAL LAW ENGINE
 * ============================================================
 * ❌ No UI
 * ❌ No React
 * ❌ No animation
 * ✅ Law only – YES / NO only
 */

export class GatekeeperCore {
  static evaluate(context: GateContext): GateResult {
    // === STATE TRANSITION LAW ===
    if (context.action.name === "STATE_TRANSITION_REQUEST") {

      // 1. Roadload bắt buộc
      if (context.metadata?.roadload !== CONSTITUTIONAL_ROADLOAD_ID) {
        return {
          allowed: false,
          reason: "CONSTITUTIONAL_VIOLATION: Missing or invalid Roadload ID",
          riskLevel: "critical",
          requireAudit: true,
        };
      }

      const { fromState, toState } = context.metadata || {};

      // 2. Thiếu state
      if (!fromState || !toState) {
        return {
          allowed: false,
          reason: "CONSTITUTIONAL_VIOLATION: Undefined state transition",
          riskLevel: "high",
          requireAudit: true,
        };
      }

      // 3. Không được đứng yên
      if (fromState === toState) {
        return {
          allowed: false,
          reason: "INVALID_TRANSITION: fromState equals toState",
          riskLevel: "medium",
          requireAudit: true,
        };
      }
    }

    return { allowed: true };
  }
}


/**
 * ============================================================
 * CONSTITUTIONAL GUARD
 * GatekeeperCore must be invoked ONLY by Cell dispatcher.
 * ============================================================
 */
function assertCellInvocation(token: symbol): void {
  if (token !== __CELL_INVOCATION_TOKEN__) {
    throw new Error("CONSTITUTIONAL_VIOLATION: Gatekeeper can only be invoked by Cell dispatcher.");
  }
}
