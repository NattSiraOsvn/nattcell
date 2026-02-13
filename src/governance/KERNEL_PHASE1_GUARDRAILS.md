# KERNEL CORE — PHASE 1 GUARDRAILS (ENFORCED)

## Purpose
Freeze Kernel public surface + prevent dependency drift.
Kernel = Foundation Governance (IMMUTABLE_EXCEPT_GATEKEEPER).

## Kernel DOES
- Provide **ports/contracts** for cross-cell communication.
- Publish **events/contracts** via shared-contracts-cell / smartlink.
- Enforce **boundary discipline** through scanners/guards.
- Maintain **auditability** (audit-cell) for all builder actions.

## Kernel DOES NOT
- Import **business cells** (src/cells/business/**).
- Import **domain logic** from business.
- Mutate business/infrastructure state directly.
- Become a feature bucket (no scope creep).

## Allowed dependencies for Kernel code
- Node stdlib, internal kernel modules
- Infrastructure: shared-contracts-cell (contracts only), smartlink-cell (event bus only)
- No direct access to business cells

## Enforcement Artifacts
- `src/governance/kernel.contracts.lock.json` — hashes of frozen public surfaces
- `scripts/kernel_phase1_scan.mjs` — scans import violations + regenerates lock file (Gatekeeper only)
