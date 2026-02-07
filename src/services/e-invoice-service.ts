
import { EInvoice, EInvoiceStatus } from '@/types.ts';
import { ShardingService } from './blockchainservice.ts';

export class EInvoiceService {
  private static instance: EInvoiceService;
  private invoices: EInvoice[] = [];

  static getInstance() {
    if (!EInvoiceService.instance) EInvoiceService.instance = new EInvoiceService();
    return EInvoiceService.instance;
  }

  /**
   * Bước 1: Khởi tạo XML theo chuẩn của Tổng cục Thuế v2.0
   */
  generateXML(invoice: EInvoice): string {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<HDon>
    <DLHDon id="ID${invoice.id}">
        <TTChung>
            <MSHDon>01GTKT0/001</MSHDon>
            <KHDon>1C26TLL</KHDon>
            <SHDon>${invoice.id.split('-').pop()}</SHDon>
            <NLap>${new Date(invoice.createdAt).toISOString().split('T')[0]}</NLap>
            <TTe>VND</TTe>
        </TTChung>
        <NMua>
            <Ten>${invoice.customerName}</Ten>
            <MST>${invoice.customerTaxId || ''}</MST>
            <DChi>TP. Hồ Chí Minh</DChi>
        </NMua>
        <DSHDon>
            ${invoice.items.map((item, idx) => `
            <HHDVu>
                <STT>${idx + 1}</STT>
                <Ten>${item.name}</Ten>
                <DVTinh>Chiếc</DVTinh>
                <SLuong>1</SLuong>
                <DGia>${item.totalBeforeTax}</DGia>
                <Thue>${item.taxRate}</Thue>
                <Tien>${item.totalBeforeTax}</Tien>
            </HHDVu>`).join('')}
        </DSHDon>
        <TToan>
            <TGia>${invoice.totalAmount}</TGia>
            <TThue>${invoice.taxAmount}</TThue>
            <Tong>${invoice.totalAmount + invoice.taxAmount}</Tong>
        </TToan>
    </DLHDon>
</HDon>`;
    return xml;
  }

  /**
   * Bước 2: Ký số điện tử (Simulated RSA/SHA-256)
   */
  async signInvoice(invoiceId: string): Promise<string> {
    // Giả lập băm nội dung XML + Private Key
    await new Promise(r => setTimeout(r, 1200));
    return ShardingService.generateShardHash({
      invoiceId,
      signer: 'TAM_LUXURY_MASTER_TOKEN',
      timestamp: Date.now()
    });
  }

  /**
   * Bước 3: Giao tiếp Direct API với TCT
   */
  async transmitToTaxAuthority(invoice: EInvoice): Promise<{ success: boolean; taxCode?: string }> {
    await new Promise(r => setTimeout(r, 2000));
    return {
      success: true,
      taxCode: `CQT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    };
  }

  getInvoices() { return this.invoices; }
}

export const EInvoiceEngine = EInvoiceService.getInstance();
