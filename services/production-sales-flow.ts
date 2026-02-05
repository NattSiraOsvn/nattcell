
/* Fix: Import SalesChannel, WarehouseLocation, ProductType from types directly */
import { 
  SalesChannel, 
  WarehouseLocation, 
  ProductType,
  OrderItem
} from '../types';
import { SalesCore } from './salesCore';
import { ShardingService } from './blockchainService';

// ============================================================================
// 🏭 PRODUCTION & SALES FLOW DEFINITIONS
// ============================================================================

export interface ImportOrder {
  id: string;
  materialId: string;
  quantity: number;
  supplier: string;
  importTax: number;
  customsFee: number;
  warehouse: WarehouseLocation;
  status: 'PENDING' | 'CLEARED' | 'STORED';
  documents: string[]; // Hash IDs
  totalCost: number;
}

export interface FinishedProduct {
  id: string;
  sku: string;
  name: string;
  costPrice: number;
  marketPrice: number;
  qualityGrade: 'A' | 'B' | 'C';
  location: WarehouseLocation;
}

export interface DistributionPlanItem {
  product: FinishedProduct;
  destination: WarehouseLocation;
  quantity: number;
  transportId?: string;
}

export interface FlowLog {
  timestamp: number;
  step: string;
  detail: string;
  hash: string;
}

// ============================================================================
// ⚙️ FLOW ORCHESTRATOR
// ============================================================================

export class ProductionSalesFlow {
  private static instance: ProductionSalesFlow;
  private logs: FlowLog[] = [];
  private listeners: ((logs: FlowLog[]) => void)[] = [];

  static getInstance(): ProductionSalesFlow {
    if (!ProductionSalesFlow.instance) {
      ProductionSalesFlow.instance = new ProductionSalesFlow();
    }
    return ProductionSalesFlow.instance;
  }

  // --- HELPER: LOGGING & NOTIFICATION ---
  private log(step: string, detail: string) {
    const logEntry: FlowLog = {
      timestamp: Date.now(),
      step,
      detail,
      hash: ShardingService.generateShardHash({ step, detail, ts: Date.now() })
    };
    this.logs = [logEntry, ...this.logs];
    this.listeners.forEach(l => l(this.logs));
    console.log(`[FLOW] ${step}: ${detail}`);
  }

  public subscribe(listener: (logs: FlowLog[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public clearLogs() {
    this.logs = [];
    this.listeners.forEach(l => l(this.logs));
  }

  // --- CORE FLOW: FULL LIFECYCLE ---
  
  async fullFlow(rawMaterialId: string, quantity: number, targetChannel: SalesChannel): Promise<any> {
    this.clearLogs();
    this.log('INIT', `Khởi động quy trình End-to-End cho ${quantity}kg ${rawMaterialId}`);

    try {
      // 1. Nhập nguyên liệu (Import)
      const importOrder = await this.importRawMaterial(rawMaterialId, quantity);
      
      // 2. Sản xuất (Production)
      const finishedProducts = await this.produceFinishedGoods(importOrder);
      
      // 3. Phân phối (Distribution)
      await this.distributeToWarehouses(finishedProducts);
      
      // 4. Bán hàng (Sales)
      const salesResult = await this.sellThroughChannels(finishedProducts, targetChannel);
      
      // 5. Tổng kết (Financials)
      const financialReport = await this.calculateProfitAndCommission(importOrder, salesResult);

      this.log('COMPLETED', `Quy trình hoàn tất. Lợi nhuận ròng: ${financialReport.netProfit.toLocaleString()} VND`);
      
      return { importOrder, finishedProducts, salesResult, financialReport };

    } catch (error: any) {
      this.log('ERROR', `Quy trình thất bại: ${error.message}`);
      throw error;
    }
  }

  // --- STEP 1: IMPORT ---

  async importRawMaterial(materialId: string, quantity: number): Promise<ImportOrder> {
    this.log('IMPORT', `Đang đàm phán nhà cung cấp cho ${materialId}...`);
    await new Promise(r => setTimeout(r, 1000));

    const supplier = "Gold Corp Australia";
    const unitPrice = 1800000000; // 1.8 Tỷ / kg (Giả định vàng)
    const rawCost = unitPrice * quantity;
    
    // Thuế & Phí (Logic Hải quan)
    const importTax = rawCost * 0.01; // 1%
    const customsFee = 5000000; // Phí cố định

    const order: ImportOrder = {
      id: `IMP-${Date.now()}`,
      materialId,
      quantity,
      supplier,
      importTax,
      customsFee,
      warehouse: WarehouseLocation.HCM_HEADQUARTER,
      status: 'CLEARED',
      documents: [`DOC-${Date.now()}-INV`, `DOC-${Date.now()}-CO`],
      totalCost: rawCost + importTax + customsFee
    };

    this.log('IMPORT', `Thông quan thành công. Tổng vốn: ${order.totalCost.toLocaleString()} VND. Nhập kho HCM.`);
    return order;
  }

  // --- STEP 2: PRODUCTION ---

  async produceFinishedGoods(importOrder: ImportOrder): Promise<FinishedProduct[]> {
    this.log('PRODUCTION', `Chuyển nguyên liệu vào dây chuyền sản xuất...`);
    await new Promise(r => setTimeout(r, 1500));

    // Định mức: 1kg vàng -> 200 nhẫn (Mỗi nhẫn 5g = 1.3 chỉ)
    const outputCount = Math.floor((importOrder.quantity * 1000) / 5); 
    const productionCostPerUnit = 500000; // Công thợ + Hao hụt
    
    const totalProductionCost = outputCount * productionCostPerUnit;
    const totalCost = importOrder.totalCost + totalProductionCost;
    const unitCost = totalCost / outputCount;

    this.log('PRODUCTION', `Hoàn thành đúc & chế tác. Sản lượng: ${outputCount} sản phẩm.`);
    this.log('QC', `Kiểm định chất lượng (Spectroscopy)... Đạt chuẩn 99.9%.`);

    const products: FinishedProduct[] = Array.from({ length: outputCount }).map((_, i) => ({
      id: `PROD-${importOrder.id}-${i}`,
      sku: `R-GOLD-18K-${i}`,
      name: `Nhẫn trơn 18K Standard`,
      costPrice: unitCost,
      marketPrice: unitCost * 1.3, // Markup 30%
      qualityGrade: 'A',
      location: WarehouseLocation.HCM_HEADQUARTER
    }));

    return products;
  }

  // --- STEP 3: DISTRIBUTION ---

  async distributeToWarehouses(products: FinishedProduct[]): Promise<void> {
    this.log('DISTRIBUTION', `Tính toán phương án điều phối kho...`);
    await new Promise(r => setTimeout(r, 1000));

    // Chiến lược: 50% HCM, 30% HN, 20% ĐN
    const total = products.length;
    const hcmCount = Math.floor(total * 0.5);
    const hnCount = Math.floor(total * 0.3);
    const dnCount = total - hcmCount - hnCount;

    // Update locations (Simulated)
    products.slice(0, hcmCount).forEach(p => p.location = WarehouseLocation.HCM_HEADQUARTER);
    products.slice(hcmCount, hcmCount + hnCount).forEach(p => p.location = WarehouseLocation.HANOI_BRANCH);
    products.slice(hcmCount + hnCount).forEach(p => p.location = WarehouseLocation.DA_NANG_BRANCH);

    this.log('DISTRIBUTION', `Đã chuyển: ${hcmCount} về HCM, ${hnCount} ra Hà Nội, ${dnCount} về Đà Nẵng.`);
  }

  // --- STEP 4: SALES ---

  async sellThroughChannels(products: FinishedProduct[], channel: SalesChannel): Promise<any> {
    this.log('SALES', `Kích hoạt chiến dịch bán hàng trên kênh ${channel}...`);
    await new Promise(r => setTimeout(r, 1200));

    // Giả định bán hết 80% hàng
    const soldCount = Math.floor(products.length * 0.8);
    const soldItems = products.slice(0, soldCount);
    
    let totalRevenue = 0;
    
    // Sử dụng SalesCoreEngine để tạo đơn hàng
    const salesOrders = soldItems.map(p => {
      // Fix: Added missing sku and total properties to satisfy OrderItem interface
      const orderItem: OrderItem = {
        productId: p.id,
        productCode: p.sku,
        productName: p.name,
        productType: ProductType.FINISHED_GOOD,
        sku: p.sku,
        quantity: 1,
        unitPrice: p.marketPrice,
        costPrice: p.costPrice,
        discount: 0,
        taxRate: 10,
        total: p.marketPrice,
        warehouseLocation: p.location
      };

      const pricing = SalesCore.calculatePricing([orderItem]);
      totalRevenue += pricing.totalAmount;
      return { p, pricing };
    });

    this.log('SALES', `Đã bán ${soldCount}/${products.length} sản phẩm. Doanh thu: ${totalRevenue.toLocaleString()} VND.`);
    return { soldCount, totalRevenue, salesOrders };
  }

  // --- STEP 5: FINANCIALS ---

  async calculateProfitAndCommission(importOrder: ImportOrder, salesResult: any): Promise<any> {
    this.log('FINANCE', `Tổng hợp báo cáo P&L (Profit & Loss)...`);
    
    const { totalRevenue, salesOrders } = salesResult;
    
    // Chi phí hàng bán (COGS)
    const cogs = salesOrders.reduce((sum: number, item: any) => sum + item.pricing.costOfGoods, 0);
    
    // Chi phí vận hành (Giả định 10% doanh thu)
    const opex = totalRevenue * 0.1;
    
    // Hoa hồng nhân viên (Giả định 2% doanh thu)
    const commission = totalRevenue * 0.02;

    const netProfit = totalRevenue - cogs - opex - commission;
    const margin = (netProfit / totalRevenue) * 100;

    this.log('FINANCE', `--------------------------------`);
    this.log('FINANCE', `TỔNG DOANH THU: ${totalRevenue.toLocaleString()} VND`);
    this.log('FINANCE', `GIÁ VỐN (COGS): -${cogs.toLocaleString()} VND`);
    this.log('FINANCE', `CHI PHÍ OPEX: -${opex.toLocaleString()} VND`);
    this.log('FINANCE', `HOA HỒNG: -${commission.toLocaleString()} VND`);
    this.log('FINANCE', `LỢI NHUẬN RÒNG: ${netProfit.toLocaleString()} VND (${margin.toFixed(2)}%)`);

    return { totalRevenue, cogs, opex, commission, netProfit, margin };
  }
}

export const FlowEngine = ProductionSalesFlow.getInstance();
