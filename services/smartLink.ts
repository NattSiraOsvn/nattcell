
import { SmartLinkEnvelope } from '../cells/shared-kernel/shared-types';
// 🛠️ Fixed: Changed resolveCellPath to resolve_cell_path to match registry export
import { resolve_cell_path } from '../cells/shared-kernel/smartlink.registry';
import { validateBoundary } from '../cells/shared-kernel/immune-guard';

/**
 * ⚛️ SMARTLINK UEI ROUTER v5.1
 * Thực thi Registry-based Routing và Immune Sealing.
 */
export class SmartLinkClient {
  
  static async send<T = any>(envelope: SmartLinkEnvelope): Promise<T> {
    // 🛡️ KÍCH HOẠT HÀNG RÀO BIÊN GIỚI
    validateBoundary(envelope);

    const targetCellId = envelope.intent.domain;
    // 🛠️ Fixed: Changed to resolve_cell_path
    const path = resolve_cell_path(targetCellId);

    if (!path) {
      throw new Error(`CONSTITUTIONAL VIOLATION: Cell [${targetCellId}] is not registered in UEI.`);
    }

    // Load module tương đối từ root
    const module = await import(path /* @vite-ignore */);
    
    const provider = module.WarehouseProvider || 
                     module.SalesProvider || 
                     module.EventBridgeProvider || 
                     module.default || 
                     module;
    
    if (typeof provider.handleIntent !== 'function') {
        return provider[envelope.payload?.key] || provider;
    }

    return await provider.handleIntent(envelope);
  }

  /**
   * Khởi tạo Envelope mới với ADN của Anh Nat
   */
  static createEnvelope(targetCell: string, action: string, payload: any): SmartLinkEnvelope {
    const traceId = crypto.randomUUID();
    return {
      envelope_version: "1.1",
      envelope_id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      owner: "ANH_NAT", // Sovereign DNA
      trace_id: traceId,
      trace: {
        trace_id: traceId,
        causation_id: null,
        span_id: crypto.randomUUID()
      },
      intent: { action, domain: targetCell },
      payload
    };
  }
}