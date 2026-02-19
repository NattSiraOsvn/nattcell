/**
 * NATT-OS — Sales Cell
 * Application Service: SalesService
 * Quản lý giao dịch bán hàng Tâm Luxury
 */

import { SalesTransaction, SalesTransactionProps } from '../../domain/entities/sales-transaction.entity';
import { SalesEngine } from '../../domain/services/sales.engine';
import { SalesChannel, SaleStatus, COMMISSION_RATES } from '../../domain/value-objects/sales-channel';

// ═══ COMMANDS ═══

export interface CreateSaleCommand {
  customerId: string;
  salesPersonId: string;
  channel: SalesChannel;
  itemIds: string[];
  totalValueVND: number;
  branchCode: string;
  notes?: string;
}

export interface ApplyDiscountCommand {
  transactionId: string;
  discountVND: number;
  reason: string;
  approvedBy?: string; // Bắt buộc nếu discount > threshold
}

export interface CloseSaleCommand {
  transactionId: string;
  closedBy: string;
}

// ═══ CONSTANTS ═══

export const DISCOUNT_APPROVAL_THRESHOLD_VND = 5_000_000; // Discount > 5M cần manager duyệt

// ═══ SERVICE ═══

export class SalesService {
  private txs: SalesTransaction[] = [];

  // ─── Create ───

  createSale(cmd: CreateSaleCommand): { tx: SalesTransaction; errors: string[] } {
    const errors: string[] = [];
    if (cmd.itemIds.length === 0) errors.push('Đơn hàng phải có ít nhất 1 sản phẩm');
    if (cmd.totalValueVND <= 0) errors.push('Giá trị đơn hàng phải > 0');

    const props: SalesTransactionProps = {
      id: `SA-${Date.now()}`,
      customerId: cmd.customerId,
      salesPersonId: cmd.salesPersonId,
      channel: cmd.channel,
      status: 'INITIATED',
      itemIds: cmd.itemIds,
      totalValueVND: cmd.totalValueVND,
      discountVND: 0,
      finalValueVND: cmd.totalValueVND,
      commissionVND: 0,
      branchCode: cmd.branchCode,
      notes: cmd.notes,
      createdAt: new Date(),
    };

    const tx = new SalesTransaction(props);
    if (errors.length === 0) this.txs.push(tx);
    return { tx, errors };
  }

  // ─── Discount ───

  applyDiscount(cmd: ApplyDiscountCommand): { success: boolean; error?: string } {
    const tx = this.findById(cmd.transactionId);
    if (!tx) return { success: false, error: `Không tìm thấy giao dịch ${cmd.transactionId}` };
    if (tx.status === 'COMPLETED' || tx.status === 'LOST')
      return { success: false, error: 'Không thể discount giao dịch đã đóng' };
    if (cmd.discountVND > DISCOUNT_APPROVAL_THRESHOLD_VND && !cmd.approvedBy)
      return { success: false, error: `Discount > ${DISCOUNT_APPROVAL_THRESHOLD_VND.toLocaleString()}đ cần manager duyệt` };
    if (cmd.discountVND >= tx.totalValueVND)
      return { success: false, error: 'Discount không thể >= tổng giá trị đơn hàng' };

    tx.applyDiscount(cmd.discountVND);
    return { success: true };
  }

  // ─── Transitions ───

  transition(txId: string, newStatus: SaleStatus): { success: boolean; error?: string } {
    const tx = this.findById(txId);
    if (!tx) return { success: false, error: `Không tìm thấy giao dịch ${txId}` };
    try {
      tx.transitionTo(newStatus);
      return { success: true };
    } catch (e) {
      return { success: false, error: String(e) };
    }
  }

  closeSale(cmd: CloseSaleCommand): { success: boolean; commissionVND?: number; error?: string } {
    const tx = this.findById(cmd.transactionId);
    if (!tx) return { success: false, error: `Không tìm thấy giao dịch ${cmd.transactionId}` };
    try {
      tx.transitionTo('COMPLETED');
      return { success: true, commissionVND: tx.commissionVND };
    } catch (e) {
      return { success: false, error: String(e) };
    }
  }

  markLost(txId: string, reason: string): { success: boolean; error?: string } {
    const tx = this.findById(txId);
    if (!tx) return { success: false, error: `Không tìm thấy giao dịch ${txId}` };
    try {
      tx.transitionTo('LOST');
      return { success: true };
    } catch (e) {
      return { success: false, error: String(e) };
    }
  }

  // ─── Queries ───

  findById(id: string): SalesTransaction | undefined {
    return this.txs.find(t => t.id === id);
  }

  getBySalesPerson(spId: string): SalesTransaction[] {
    return SalesEngine.getBySalesPerson(this.txs, spId);
  }

  getByBranch(branch: string): SalesTransaction[] {
    return SalesEngine.getByBranch(this.txs, branch);
  }

  getConversionRate(): number {
    return SalesEngine.getConversionRate(this.txs);
  }

  getTotalCommission(spId: string): number {
    return SalesEngine.getTotalCommission(this.txs, spId);
  }

  getActiveSales(): SalesTransaction[] {
    return this.txs.filter(t => !['COMPLETED', 'LOST'].includes(t.status));
  }

  getDailyRevenue(date: Date): number {
    return SalesEngine.getDailyRevenue(this.txs, date);
  }
}
