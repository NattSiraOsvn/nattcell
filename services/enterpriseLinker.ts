
import { AggregatedReport, LinkedRecord } from '../types';

export class EnterpriseLinker {
  
  /**
   * Tạo báo cáo đa chiều bằng cách join dữ liệu từ 3 nguồn giả lập
   * Trong thực tế, hàm này sẽ query từ các bảng SQL/NoSQL khác nhau.
   */
  static async generateMultiDimensionalReport(period: string): Promise<AggregatedReport> {
    // 1. Mock Data from PRODUCTION SHARD
    const productionData = [
      { sku: 'NNA-ROLEX-01', cost: 185000000, gold: 3.5, stone: 1.2, worker: 'Nguyễn Văn Vẹn' },
      { sku: 'NNU-HALO-02', cost: 28000000, gold: 1.2, stone: 0.8, worker: 'Bùi Cao Sơn' },
      { sku: 'BT-DIAMOND-03', cost: 45000000, gold: 1.5, stone: 1.0, worker: 'Trần Hoài Phúc' }
    ];

    // 2. Mock Data from SALES SHARD
    const salesData = [
      { sku: 'NNA-ROLEX-01', price: 250000000, customer: 'ANH NATT', inv: 'INV-001' },
      { sku: 'NNU-HALO-02', price: 45000000, customer: 'CHỊ LAN', inv: 'INV-002' },
      { sku: 'BT-DIAMOND-03', price: 68000000, customer: 'KHÁCH VÃNG LAI', inv: 'INV-003' }
    ];

    // 3. Mock Data from FINANCE SHARD (Bank Transactions)
    const financeData = [
      { ref: 'NNA-ROLEX-01', amount: 250000000, txId: 'TX-998811' },
      { ref: 'NNU-HALO-02', amount: 45000000, txId: 'TX-998822' },
      { ref: 'BT-DIAMOND-03', amount: 65000000, txId: 'TX-998833' } // Lệch 3tr so với Sales
    ];

    // 4. Linking Logic (The "Brain")
    const records: LinkedRecord[] = productionData.map((prod) => {
      const sale = salesData.find(s => s.sku === prod.sku);
      const finance = financeData.find(f => f.ref === prod.sku || (sale && f.ref === sale.inv));

      const salesPrice = sale ? sale.price : 0;
      const receivedAmount = finance ? finance.amount : 0;
      
      // Logic xác định trạng thái khớp lệnh
      let status: LinkedRecord['status'] = 'PENDING';
      if (sale && finance) {
        status = salesPrice === receivedAmount ? 'MATCHED' : 'DISCREPANCY';
      }

      return {
        id: `LINK-${prod.sku}-${Date.now()}`,
        sku: prod.sku,
        
        // Production
        productionCost: prod.cost,
        goldWeight: prod.gold,
        stoneWeight: prod.stone,
        workerName: prod.worker,
        
        // Sales
        salesPrice,
        customerName: sale ? sale.customer : 'N/A',
        invoiceId: sale ? sale.inv : undefined,
        
        // Finance
        bankTxId: finance ? finance.txId : undefined,
        receivedAmount,
        taxPaid: salesPrice * 0.1, // Giả định VAT 10%
        
        // Metrics
        grossProfit: salesPrice - prod.cost,
        status
      };
    });

    // 5. Aggregation
    const totalRevenue = records.reduce((sum, r) => sum + r.salesPrice, 0);
    const totalCOGS = records.reduce((sum, r) => sum + r.productionCost, 0);
    const totalOpEx = totalRevenue * 0.15; // Giả định chi phí vận hành 15% doanh thu
    
    // Fixed: Added margin calculation to satisfy AggregatedReport interface
    return {
      period,
      totalRevenue,
      totalCOGS,
      totalOpEx,
      netProfit: totalRevenue - totalCOGS - totalOpEx,
      margin: totalRevenue > 0 ? ((totalRevenue - totalCOGS - totalOpEx) / totalRevenue) * 100 : 0,
      discrepancyCount: records.filter(r => r.status === 'DISCREPANCY').length,
      records
    };
  }
}
