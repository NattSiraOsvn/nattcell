import { EInvoice, EInvoiceStatus, EInvoiceItem } from '../types';
import { EInvoiceEngine } from './eInvoiceEngine';

export class EInvoiceService {
  private static instance: EInvoiceService;
  private invoices: EInvoice[] = [];

  static getInstance() {
    if (!EInvoiceService.instance) EInvoiceService.instance = new EInvoiceService();
    return EInvoiceService.instance;
  }

  /**
   * Bóc tách đơn hàng Showroom thành bản thảo hóa đơn chi tiết
   */
  createDraftFromOrder(order: any): EInvoice {
    const items: EInvoiceItem[] = order.items.map((it: any) => ({
        id: it.id || Math.random().toString(36).substr(2,5),
        name: it.productName || 'Sản phẩm trang sức',
        goldWeight: it.goldWeight || 0,
        goldPrice: it.goldPrice || 0,
        stonePrice: it.stonePrice || 0,
        laborPrice: it.laborPrice || 0,
        taxRate: 10,
        totalBeforeTax: it.total || order.total
    }));

    const draft: EInvoice = {
      id: `INV-${Date.now()}`,
      orderId: order.id,
      customerName: order.customer?.name || order.customerName || "Khách lẻ",
      customerTaxId: order.customer?.taxId,
      totalAmount: order.total,
      taxAmount: order.total * 0.1,
      vatRate: 10,
      status: EInvoiceStatus.DRAFT,
      createdAt: Date.now(),
      items
    };

    this.invoices.unshift(draft);
    return draft;
  }

  async processIssuance(invoiceId: string): Promise<boolean> {
    const inv = this.invoices.find(i => i.id === invoiceId);
    if (!inv) return false;

    try {
      // 1. Build XML
      inv.xmlPayload = EInvoiceEngine.buildTaxXML(inv);
      inv.status = EInvoiceStatus.XML_BUILT;

      // 2. Digital Sign
      inv.signatureHash = await EInvoiceEngine.signWithToken(inv.xmlPayload);
      inv.status = EInvoiceStatus.SIGNED;

      // 3. Transmit
      const result = await EInvoiceEngine.transmitToTCT(inv.xmlPayload);
      if (result.success) {
          inv.status = EInvoiceStatus.ACCEPTED;
          inv.taxCode = result.taxCode;
          inv.issuedAt = Date.now();
          return true;
      }
      return false;
    } catch (e) {
      inv.status = EInvoiceStatus.REJECTED;
      console.error(e);
      return false;
    }
  }

  getInvoices() {
    return this.invoices;
  }
}

export const EInvoiceEngineService = EInvoiceService.getInstance();