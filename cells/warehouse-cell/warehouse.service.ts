
import { StockStatus, SmartLinkEnvelope, Movement, Warehouse, WarehouseLocation, StockReservation } from '../shared-kernel/shared.types';
import { PRODUCT_SEED_DATA } from '../constants-cell/constants.service';

class WarehouseService {
  private static instance: WarehouseService;
  private stockMap: Map<string, StockStatus> = new Map();
  private reservations: Map<string, StockReservation> = new Map();
  private movementHistory: Movement[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    PRODUCT_SEED_DATA.forEach(p => {
      this.stockMap.set(p.id, { total: p.stock, available: p.stock, reserved: 0, lowStockThreshold: 2 });
    });
    // Kích hoạt dọn dẹp reservation định kỳ (Runtime heartbeat)
    if (typeof setInterval !== 'undefined') {
        setInterval(() => this.cleanupExpiredReservations(), 60000);
    }
  }

  static getInstance() {
    if (!WarehouseService.instance) WarehouseService.instance = new WarehouseService();
    return WarehouseService.instance;
  }

  getAllInventory() {
    return Array.from(this.stockMap.entries()).map(([id, status]) => {
      const product = PRODUCT_SEED_DATA.find(p => p.id === id);
      return { product, status };
    });
  }

  getMovements() {
    return this.movementHistory;
  }

  subscribe(l: () => void) {
    this.listeners.add(l);
    return () => { this.listeners.delete(l); };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  async importStock(productId: string, quantity: number, by: string) {
    const stock = this.stockMap.get(productId);
    if (stock) {
      stock.total += quantity;
      stock.available += quantity;
      this.recordMovement(productId, 'EXTERNAL', 'KHO_TONG', quantity, by);
      this.notify();
    }
  }

  async commitStock(productId: string, quantity: number, by: string) {
    const stock = this.stockMap.get(productId);
    if (stock && stock.available >= quantity) {
      stock.total -= quantity;
      stock.available -= quantity;
      this.recordMovement(productId, 'KHO_TONG', 'OUTBOUND', quantity, by);
      this.notify();
    } else {
      throw new Error("Insufficient stock");
    }
  }

  /**
   * Khóa hàng tạm thời (Reservation Protocol)
   */
  async reserveStock(productId: string, quantity: number): Promise<string> {
    const stock = this.stockMap.get(productId);
    if (!stock || stock.available < quantity) {
      throw new Error(`Tồn kho không đủ cho sản phẩm ${productId}.`);
    }

    const reservationId = `RES-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const expiresAt = Date.now() + 15 * 60 * 1000;

    stock.available -= quantity;
    stock.reserved += quantity;
    this.stockMap.set(productId, stock);

    this.reservations.set(reservationId, {
      id: reservationId,
      productId,
      quantity,
      expiresAt,
      status: 'RESERVED'
    });

    this.notify();
    return reservationId;
  }

  async releaseReservation(reservationId: string) {
    const res = this.reservations.get(reservationId);
    if (!res || res.status !== 'RESERVED') return;

    const stock = this.stockMap.get(res.productId);
    if (stock) {
        stock.available += res.quantity;
        stock.reserved -= res.quantity;
        this.stockMap.set(res.productId, stock);
    }

    res.status = 'RELEASED';
    this.reservations.set(reservationId, res);
    this.notify();
  }

  async commitReservation(reservationId: string) {
    const res = this.reservations.get(reservationId);
    if (!res || res.status !== 'RESERVED') return;

    const stock = this.stockMap.get(res.productId);
    if (stock) {
        stock.total -= res.quantity;
        stock.reserved -= res.quantity;
        this.stockMap.set(res.productId, stock);
    }

    res.status = 'COMMITTED';
    this.reservations.set(reservationId, res);
    this.recordMovement(res.productId, 'RESERVATION', 'SOLD', res.quantity, 'SYSTEM');
    this.notify();
  }

  private cleanupExpiredReservations() {
    const now = Date.now();
    this.reservations.forEach((res, id) => {
      if (res.status === 'RESERVED' && res.expiresAt < now) {
        this.releaseReservation(id);
      }
    });
  }

  private recordMovement(itemId: string, from: string, to: string, qty: number, by: string) {
    this.movementHistory.unshift({
      id: `MOV-${Date.now()}`,
      itemId, from, to, qty,
      date: new Date().toISOString(),
      by
    });
  }

  async handleIntent(envelope: SmartLinkEnvelope) {
    const { action } = envelope.intent;
    
    switch (action) {
      case 'StockCheck':
        const item_id = envelope.payload.item_id;
        const stock = this.stockMap.get(item_id) || { total: 0, available: 0, reserved: 0, lowStockThreshold: 0 };
        return { available: stock.available > 0, quantity: stock.available };
      
      case 'GetInventoryStats':
        return { total_items: this.stockMap.size };
        
      default:
        throw new Error(`UNSUPPORTED_INTENT: ${action}`);
    }
  }
}

export const WarehouseProvider = WarehouseService.getInstance();

// 🛠️ Added for redirect compatibility and to fix export errors in proxies
export class WarehouseEngine {
  static warehouses: Warehouse[] = [
    { 
      id: 'W-HCM-01', name: 'KHO TỔNG HCM', code: 'HCM-MAIN', type: 'MASTER_HUB', manager: 'Trần Hoài Phúc', totalValue: 45000000000, itemCount: 12000, securityLevel: 'CAO'
    },
    { id: 'W-HN-01', name: 'CHI NHÁNH HÀ NỘI', code: 'HN-BRANCH', type: 'DISTRIBUTION', manager: 'Bùi Cao Sơn', totalValue: 12500000000, itemCount: 4500, securityLevel: 'CAO' },
    { id: 'W-003', name: 'Kho Bán Thành Phẩm (WIP)', code: 'WIP-FACTORY', type: 'BÁN THÀNH PHẨM', manager: 'Nguyễn Văn Vẹn', totalValue: 15000000000, itemCount: 450, securityLevel: 'TRUNG BÌNH' },
  ];
}
