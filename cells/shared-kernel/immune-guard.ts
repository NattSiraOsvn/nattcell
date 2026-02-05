
/**
 * 🛡️ NATT-OS IMMUNE GUARD
 * AUTHORIZED BY: ANH NAT
 */
import { SmartLinkEnvelope } from './shared-types';

/**
 * validateBoundary: Chặn đứng mọi hành vi "phản bội" biên giới tế bào.
 * Kiểm tra ADN định danh và tính liên tục của Trace.
 */
export const validateBoundary = (envelope: SmartLinkEnvelope) => {
  // 1. Kiểm tra ADN Chủ quyền (Identity Enforcement)
  if (envelope.owner !== "ANH_NAT") {
    console.error(`[IMMUNE_GUARD] 🚨 DNA BREACH: Unauthorized Identity [${envelope.owner}] attempted access.`);
    throw new Error("❌ CONSTITUTIONAL VIOLATION: Unauthorized Identity DNA. Access Denied.");
  }

  // 2. Kiểm tra Kỷ luật Trace (Trace Discipline Enforcement)
  if (!envelope.trace_id) {
    console.error(`[IMMUNE_GUARD] 🚨 TRACE BREACH: Orphan Envelope detected [ID: ${envelope.envelope_id}].`);
    throw new Error("❌ TRACE DISCIPLINE VIOLATION: Missing Trace Continuity.");
  }

  // 3. Kiểm tra Phiên bản Giao thức
  if (envelope.envelope_version !== "1.1") {
    throw new Error(`❌ PROTOCOL ERROR: Incompatible Envelope Version [Expected: 1.1, Got: ${envelope.envelope_version}].`);
  }

  return true; // Hợp hiến
};
