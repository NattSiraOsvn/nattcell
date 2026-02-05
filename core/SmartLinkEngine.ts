import { 
  AccountingEntry, 
  SalesOrder, 
  BankTransaction, 
  CostAllocation, 
  AccountingMappingRule, 
  SalesEvent 
} from '../types';

/**
 * ⚛️ SMART LINK OMEGA ENGINE (UNIFIED CORE)
 * Hợp nhất logic bóc tách bút toán TT200 và ánh xạ sự kiện động.
 * Đảm bảo "Sự thật duy nhất" (Single Source of Truth) cho hệ thống 19TB.
 */
class SmartLinkEngine {
  private static instance: SmartLinkEngine;
  private mappingRules: Map<string, AccountingMappingRule> = new Map();
  private listeners: Record<string, Function[]> = {};

  // Danh mục tài khoản chuẩn (TT200)
  public static readonly COA: Record<string, string> = {
    '111': 'Tiền mặt',
    '112': 'Tiền gửi ngân hàng',
    '131': 'Phải thu khách hàng',
    '156': 'Hàng hóa (Kho)',
    '331': 'Phải trả người bán',
    '3331': 'Thuế GTGT phải nộp',
    '511': 'Doanh thu bán hàng',
    '632': 'Giá vốn hàng bán',
    '641': 'Chi phí bán hàng',
    '642': 'Chi phí quản lý',
    '811': 'Chi phí khác',
    '711': 'Thu nhập khác',
    '334': 'Phải trả người lao động',
    '242': 'Chi phí trả trước'
  };

  private constructor() {
    this.initializeDefaultMappings();
  }

  public static getInstance(): SmartLinkEngine {
    if (!SmartLinkEngine.instance) {
      SmartLinkEngine.instance = new SmartLinkEngine();
    }
    return SmartLinkEngine.instance;
  }

  // --- EVENT SYSTEM ---
  public on(event: string, listener: Function) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(listener);
  }

  private emit(event: string, ...args: any[]) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(l => l(...args));
    }
  }

  public removeAllListeners() {
    this.listeners = {};
  }

  // --- LOGIC MAPPING (DYNAMIC) ---
  private initializeDefaultMappings(): void {
    const defaultRules: AccountingMappingRule[] = [
      {
        id: 'REVENUE_MAPPING',
        name: 'Doanh thu bán hàng',
        description: 'Ánh xạ doanh thu từ đơn hàng sang tài khoản kế toán',
        source: { system: 'SALES', entity: 'SalesOrder', eventType: 'ORDER_CREATED' },
        sourceField: 'pricing.totalAmount',
        destination: { system: 'ACCOUNTING', entity: 'JournalEntry', accountType: 'REVENUE' },
        destinationField: 'debit_accounts.revenue',
        mappingType: 'DIRECT',
        transformation: (value: number) => ({ debit: '131', credit: '511', amount: value, description: 'Doanh thu bán hàng hóa' }),
        autoPost: true,
        enabled: true,
        priority: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    defaultRules.forEach(rule => this.mappingRules.set(rule.id, rule));
  }

  public getMappingRules(): AccountingMappingRule[] {
    return Array.from(this.mappingRules.values());
  }

  public addMappingRule(rule: AccountingMappingRule): void {
    this.mappingRules.set(rule.id, rule);
    this.emit('ruleAdded', rule);
  }

  public updateMappingRule(id: string, updates: Partial<AccountingMappingRule>): void {
    const rule = this.mappingRules.get(id);
    if (rule) {
      const updated = { ...rule, ...updates, updatedAt: new Date() };
      this.mappingRules.set(id, updated);
      this.emit('ruleUpdated', updated);
    }
  }

  /**
   * Ánh xạ tự động một sự kiện kinh doanh thành bút toán
   */
  public async autoMapSalesEvent(event: SalesEvent): Promise<AccountingEntry[]> {
    const entries: AccountingEntry[] = [];
    if (event.type === 'ORDER_CREATED' && event.order) {
        // Hợp nhất logic tạo từ Sales
        const generated = this.generateFromSales(event.order);
        entries.push(...generated);
    }
    this.emit('entriesMapped', { event, entries });
    return entries;
  }

  // --- LOGIC GENERATION (STATIC/TT200) ---

  public generateFromSales(order: SalesOrder): AccountingEntry[] {
    const entries: AccountingEntry[] = [];
    const revenue = order.pricing.gdbPriceTotal;
    const vat = order.pricing.taxAmount;
    const total = order.pricing.totalAmount;
    const cogs = order.pricing.costOfGoods;

    // 1. REVENUE (Nợ 131 / Có 511 / Có 3331)
    entries.push(this.createEntry(`ACC-REV-${order.orderId}`, 'REVENUE', `Doanh thu đơn ${order.orderId}`, [
      { accountNumber: '131', accountName: SmartLinkEngine.COA['131'], debit: total, credit: 0, currency: 'VND', detail: `Phải thu ${order.customer.name}` },
      { accountNumber: '511', accountName: SmartLinkEngine.COA['511'], debit: 0, credit: revenue, currency: 'VND' },
      { accountNumber: '3331', accountName: SmartLinkEngine.COA['3331'], debit: 0, credit: vat, currency: 'VND' }
    ], order.orderId));

    // 2. COGS (Nợ 632 / Có 156)
    entries.push(this.createEntry(`ACC-COGS-${order.orderId}`, 'COGS', `Giá vốn đơn ${order.orderId}`, [
      { accountNumber: '632', accountName: SmartLinkEngine.COA['632'], debit: cogs, credit: 0, currency: 'VND' },
      { accountNumber: '156', accountName: SmartLinkEngine.COA['156'], debit: 0, credit: cogs, currency: 'VND' }
    ], order.orderId));

    return entries;
  }

  public generateFromBank(tx: BankTransaction): AccountingEntry {
    const isIncome = (tx.credit && tx.credit > 0) || (tx.amount && tx.amount > 0);
    const amount = tx.credit || tx.amount || 0;
    const debitAcc = isIncome ? '112' : '642';
    const creditAcc = isIncome ? '131' : '112';

    return this.createEntry(`ACC-BNK-${tx.id}`, undefined, tx.description, [
      { accountNumber: debitAcc, accountName: SmartLinkEngine.COA[debitAcc], debit: amount, credit: 0, currency: 'VND' },
      { accountNumber: creditAcc, accountName: SmartLinkEngine.COA[creditAcc], debit: 0, credit: amount, currency: 'VND' }
    ], tx.id);
  }

  private createEntry(id: string, type: any, desc: string, lines: any[], refId: string): AccountingEntry {
    return {
      journalId: id,
      transactionDate: new Date(),
      description: desc,
      journalType: type,
      status: 'DRAFT',
      entries: lines,
      reference: { refId },
      // Added matchScore to satisfy AccountingEntry interface
      matchScore: 100,
      createdAt: new Date()
    };
  }
}

export const SmartLinkCore = SmartLinkEngine.getInstance();