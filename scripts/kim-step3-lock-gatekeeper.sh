#!/usr/bin/env bash
set -euo pipefail

echo "=== KIM STEP 3: LOCK GATEKEEPER (CELL-ONLY) ==="

# 0) Sanity
[ -f "governance/gatekeeper/GatekeeperCore.ts" ] || { echo "Missing governance/gatekeeper/GatekeeperCore.ts"; exit 1; }
[ -f "src/core/cell/state-transition.cell.ts" ] || { echo "Missing src/core/cell/state-transition.cell.ts"; exit 1; }

# 1) Create token file (Cell-only)
mkdir -p src/core/cell
TOKEN_FILE="src/core/cell/_cell-internal.token.ts"
if [ ! -f "$TOKEN_FILE" ]; then
  cat > "$TOKEN_FILE" <<'TS'
/**
 * INTERNAL CELL TOKEN
 * Only Cell dispatcher can import this.
 * NEVER export from barrel files.
 */
export const __CELL_INVOCATION_TOKEN__ = Symbol("NATT_CELL_INVOCATION");
TS
  echo "Created: $TOKEN_FILE"
else
  echo "Exists:  $TOKEN_FILE (skip)"
fi

# 2) Patch GatekeeperCore.ts: add import + guard helper (non-destructive)
GK_FILE="governance/gatekeeper/GatekeeperCore.ts"

# 2.1 Add token import if not present
if ! grep -q "__CELL_INVOCATION_TOKEN__" "$GK_FILE"; then
  # Insert import near top (after existing imports)
  awk '
    NR==1 {print; next}
    /^import / && !done {imports = imports $0 "\n"; next}
    !done {
      done=1;
      printf("%s", imports);
      print "import { __CELL_INVOCATION_TOKEN__ } from \"@/core/cell/_cell-internal.token\";";
      print;
      next
    }
    {print}
  ' "$GK_FILE" > "$GK_FILE.tmp" && mv "$GK_FILE.tmp" "$GK_FILE"
  echo "Patched import in: $GK_FILE"
else
  echo "Gatekeeper already references token (skip import)"
fi

# 2.2 Add guard function (idempotent)
if ! grep -q "assertCellInvocation" "$GK_FILE"; then
  cat >> "$GK_FILE" <<'TS'

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
TS
  echo "Appended guard helper to: $GK_FILE"
else
  echo "Guard helper exists (skip)"
fi

echo "NOTE: You must CALL assertCellInvocation(token) inside GatekeeperCore.evaluate(...) manually if not yet wired."
echo "=> We'll wire it via the cell dispatcher next."

# 3) Patch cell dispatcher to call GatekeeperCore with token (non-destructive append)
CELL_FILE="src/core/cell/state-transition.cell.ts"

# 3.1 Ensure imports exist
if ! grep -q "__CELL_INVOCATION_TOKEN__" "$CELL_FILE"; then
  # Add import at top after existing imports
  awk '
    NR==1 {print; next}
    /^import / && !done {imports = imports $0 "\n"; next}
    !done {
      done=1;
      printf("%s", imports);
      print "import { __CELL_INVOCATION_TOKEN__ } from \"./_cell-internal.token\";";
      print "import { GatekeeperCore } from \"@/governance/gatekeeper/GatekeeperCore\";";
      print;
      next
    }
    {print}
  ' "$CELL_FILE" > "$CELL_FILE.tmp" && mv "$CELL_FILE.tmp" "$CELL_FILE"
  echo "Patched imports in: $CELL_FILE"
else
  echo "Cell dispatcher already imports token (skip)"
fi

# 3.2 Inject call near the return stateManager.validateTransition(...) line
if ! grep -q "GatekeeperCore" "$CELL_FILE" | true; then
  echo "WARNING: GatekeeperCore not found in $CELL_FILE after import patch; check file manually."
fi

# We will not auto-rewrite logic because file structures vary.
# Instead, we append a ready-to-paste snippet at end of file for the user to integrate safely.
SNIP_MARK="KIM_STEP3_SNIPPET"
if ! grep -q "$SNIP_MARK" "$CELL_FILE"; then
  cat >> "$CELL_FILE" <<'TS'

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
TS
  echo "Appended integration snippet to: $CELL_FILE"
else
  echo "Integration snippet already appended (skip)"
fi

# 4) Show what changed
echo
echo "=== DIFF SUMMARY ==="
git diff --stat || true
echo
echo "=== QUICK VERIFY ==="
echo "Token file:"; ls -la "$TOKEN_FILE" || true
echo "Search token usage:"; grep -RIn "__CELL_INVOCATION_TOKEN__" governance/gatekeeper "$CELL_FILE" || true

echo
echo "DONE. Next: open GatekeeperCore.ts and wire assertCellInvocation(...) inside evaluate()."
