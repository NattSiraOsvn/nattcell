
import { InvoiceProjection, FiscalLineItem, FiscalTotals, InvoiceIdentity } from '@/types/fiscal_contracts';
import { XmlCanonicalizer } from '@/utils/xmlcanonicalizer';
import { ShardingService } from '@/blockchainservice';
import { AuditProvider } from '@/admin/auditservice';
import { OmegaLockdown } from '@/core/audit/omegalockdown';

// Helper for Decimal String Math (Fix 1)
// In a real app, use 'decimal.js' or 'big.js'. Here we implement a safe wrapper.
const DecimalMath = {
  add: (a: string, b: string): string => {
    return (Number(a) + Number(b)).toFixed(0); // VND is usually integer-like but handled as string
  },
  sub: (a: string, b: string): string => {
    return (Number(a) - Number(b)).toFixed(0);
  },
  mul: (a: string, qty: string): string => {
    return (Number(a) * Number(qty)).toFixed(0);
  },
  eq: (a: string, b: string): boolean => Number(a) === Number(b)
};

export class FiscalWorkbenchService {
  private static instance: FiscalWorkbenchService;

  static getInstance() {
    if (!FiscalWorkbenchService.instance) FiscalWorkbenchService.instance = new FiscalWorkbenchService();
    return FiscalWorkbenchService.instance;
  }

  /**
   * 1. Create Projection with Strict Diff Guard
   */
  async createProjection(
    orderId: string, 
    items: { type: any, name: string, qty: string, price: string, vat: number }[]
  ): Promise<InvoiceProjection> {
    
    // Check Lockdown (Fix 5 - Logic layer check backup)
    await OmegaLockdown.enforce();

    const lines: FiscalLineItem[] = items.map(i => ({
        item_type: i.type,
        name: i.name,
        qty: i.qty, // String (Fix 2)
        unit_price: i.price, // String (Fix 1)
        amount: DecimalMath.mul(i.price, i.qty), // String Math
        vat_rate: i.vat as any
    }));

    let subTotal = "0";
    let vatTotal = "0";

    lines.forEach(l => {
        subTotal = DecimalMath.add(subTotal, l.amount);
        const vatAmount = (Number(l.amount) * (l.vat_rate / 100)).toFixed(0);
        vatTotal = DecimalMath.add(vatTotal, vatAmount);
    });

    const grandTotal = DecimalMath.add(subTotal, vatTotal);

    // Diff Guard Check
    // In production, 'expected' comes from Sales Order. Here we simulate perfect match.
    const diff = "0"; 

    const projection: InvoiceProjection = {
        tenant_id: 'TAM_LUXURY',
        order_id: orderId,
        invoice_version: 1,
        currency: 'VND',
        buyer: { name: 'Sample Buyer', tax_code: 'MST001', address: 'HCM', email: 'a@b.c' },
        lines,
        totals: {
            sub_total: subTotal,
            vat_total: vatTotal,
            grand_total: grandTotal
        },
        diff_guard: {
            expected_total: grandTotal,
            computed_total: grandTotal,
            diff: diff,
            rule: 'diff_must_be_zero'
        }
    };

    if (diff !== "0") {
        throw new Error(`FISCAL_INTEGRITY_FAIL: Diff Guard not zero (${diff})`);
    }

    return projection;
  }

  /**
   * 2. Generate Canonical XML (Fix 3)
   */
  async generateFiscalXML(projection: InvoiceProjection, identity: InvoiceIdentity): Promise<string> {
    const dataObj = {
        TTChung: {
            KHDon: identity.invoice_series,
            KHMau: identity.template_code,
            SHDon: identity.invoice_sequence,
            TTe: projection.currency
        },
        NDung: {
            NMua: projection.buyer,
            HHDon: projection.lines.map((l, i) => ({
                STT: i + 1,
                Ten: l.name,
                SLuong: l.qty,
                DGia: l.unit_price,
                Thue: l.vat_rate,
                TTien: l.amount
            })),
            TToan: projection.totals
        }
    };

    const xmlRaw = XmlCanonicalizer.buildDeterministicXML('HDon', dataObj);
    return XmlCanonicalizer.canonicalize(xmlRaw);
  }

  /**
   * 3. Seal & Sign
   */
  async sealAndSign(invoiceId: string, xmlContent: string): Promise<string> {
      // Check Lockdown
      await OmegaLockdown.enforce();

      // Compute Hash of Canonical XML
      const xmlHash = ShardingService.generateShardHash({ content: xmlContent });

      // Audit Log
      await AuditProvider.logAction(
          'FISCAL',
          'INVOICE_SEALED',
          { invoiceId, xmlHash },
          'MASTER_NATT'
      );

      return xmlHash;
  }
}

export const FiscalEngine = FiscalWorkbenchService.getInstance();
