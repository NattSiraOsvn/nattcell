/**
import { __CELL_INVOCATION_TOKEN__ } from "./_cell-internal.token.js";
import { GatekeeperCore } from "@/governance/gatekeeper/GatekeeperCore";
 * ============================================================
 * NATT CELL – STATE TRANSITION DISPATCHER
 * Cell 002 (UI / Intent)  ->  Cell Runtime  ->  Cell 005 (Law)
 * ============================================================
 */

import { StateManager } from '../state-manager';

const stateManager = new StateManager();

/**
 * UI / AI / Service chỉ được emit INTENT
 * Không được gọi Gatekeeper hay StateManager trực tiếp
 */
export async function emitStateTransitionIntent(params: {
  tenantId: string;
  domain: string;
  entityId: string;
  operation: string;
  payload?: any;
}) {
  const { tenantId, domain, entityId, operation, payload = {} } = params;

  return stateManager.validateTransition(
    domain,
    operation,
    {
      ...payload,
      id: entityId,
    },
    tenantId
  );
}


/* KIM_STEP3_SNIPPET
-------------------------------------------------------------
INTEGRATION SNIPPET (paste into emitStateTransitionIntent after you obtain `transition`):
  const decision = GatekeeperCore.evaluate({
    token: __CELL_INVOCATION_TOKEN__,
    // keep your existing context fields if GatekeeperCore.evaluate uses GateContext
    // Minimal payload:
    domain,
    tenantId,
    fromState: transition.fromState,
    toState: transition.toState,
  });
  if (decision && decision.allowed === false) {
    throw new Error(decision.reason || "STATE_BLOCKED_BY_GATEKEEPER");
  }

ALSO: Inside GatekeeperCore.evaluate(...) add:
  assertCellInvocation(context.token);   // or params.token
-------------------------------------------------------------
*/
