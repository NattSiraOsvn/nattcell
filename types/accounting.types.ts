
import { SalesChannel, OrderStatus, WarehouseLocation, Customer, OrderItem, LogisticsInfo, PaymentInfo, CommissionInfo } from '../types';

// Core accounting types
export interface AccountingEntry {
  journalId: string;
  transactionDate: Date;
  description: string;
  entries: AccountingLine[];
  reference: Record<string, any>;
  status: 'DRAFT' | 'POSTED' | 'SYNCED' | 'ERROR';
  syncedAt?: Date;
  retryCount?: number;
  errorMessage?: string;
  journalType?: 'REVENUE' | 'COGS' | 'EXPENSE' | 'ALLOCATION';
  createdAt?: Date;
}

export interface AccountingLine {
  accountNumber: string;
  accountName: string;
  debit: number;
  credit: number;
  currency: string;
  costCenter?: string;
  projectCode?: string;
  detail?: string;
}

export interface AccountingMappingRule {
  id: string;
  name: string;
  description: string;
  source: MappingSource;
  sourceField: string;
  destination: MappingDestination;
  destinationField: string;
  mappingType: 'DIRECT' | 'AGGREGATE' | 'SPLIT' | 'REALTIME' | 'CONDITIONAL';
  conditions?: MappingCondition[];
  transformation: MappingTransformation;
  autoPost: boolean;
  enabled: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MappingSource {
  system: 'SALES' | 'INVENTORY' | 'LOGISTICS' | 'HR' | 'PRODUCTION';
  entity: string;
  eventType: string;
}

export interface MappingDestination {
  system: 'ACCOUNTING' | 'TAX' | 'BANKING' | 'ERP';
  entity: string;
  accountType: string;
}

export interface MappingCondition {
  field: string;
  operator: 'eq' | 'gt' | 'lt' | 'contains' | 'in';
  value: any;
}

export type MappingTransformation = (value: any, context?: any) => any;

// Sales integration types (Re-exporting or extending from base types)
export type SalesOrderExtended = {
  orderId: string;
  orderType: SalesChannel;
  customer: Customer;
  items: OrderItem[];
  pricing: OrderPricing;
  logistics?: LogisticsInfo;
  payment: PaymentInfo;
  status: OrderStatus;
  warehouse: WarehouseLocation;
  // salesPerson: SalesPerson; // Assuming base type has this
  commission: CommissionInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderPricing {
  subtotal: number;
  basePriceTotal: number;
  gdbPriceTotal: number;
  exchangeRate: number;
  discountPercentage: number;
  promotionDiscount: number;
  taxAmount: number;
  shippingFee: number;
  insuranceFee: number;
  totalAmount: number;
  profitMargin: number;
  costOfGoods: number;
  vatBreakdown?: VatBreakdown[];
}

export interface VatBreakdown {
  rate: number;
  taxableAmount: number;
  taxAmount: number;
}

// Sync monitoring types
export interface SyncStatus {
  system: string;
  status: 'IDLE' | 'SYNCING' | 'SUCCESS' | 'ERROR' | 'RETRYING';
  lastSync?: Date;
  processedCount: number;
  successCount: number;
  errorCount: number;
  lastError?: string;
}

export interface SyncHistory {
  id: string;
  timestamp: Date;
  system: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE' | 'SYNC';
  status: 'SUCCESS' | 'ERROR' | 'PENDING';
  recordsProcessed: number;
  errorMessage?: string;
  duration: number;
  metadata?: Record<string, any>;
}

// Real-time update types
export interface RealTimeUpdate {
  id: string;
  type: UpdateType;
  timestamp: Date;
  data: any;
  source: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  processed: boolean;
}

export type UpdateType = 
  | 'SALES_POSTED'
  | 'EXPENSE_RECORDED'
  | 'TAX_CALCULATED'
  | 'COMMISSION_PAID'
  | 'INVENTORY_MOVEMENT'
  | 'INVOICE_ISSUED'
  | 'SYNC_COMPLETED'
  | 'SYNC_ERROR'
  | 'ENTRIES_MAPPED';

export interface SalesEvent {
  type: string;
  order?: any;
  commission?: any;
  movement?: any;
  invoice?: any;
  timestamp: Date;
}

// Financial dashboard types
export interface FinancialData {
  revenue: RevenueMetrics;
  expenses: ExpenseMetrics;
  profit: ProfitMetrics;
  cashFlow: CashFlowMetrics;
  recentEntries: AccountingEntry[];
  syncStatus: Record<string, SyncStatus>;
}

export interface RevenueMetrics {
  current: number;
  previous: number;
  growth: number;
}

export interface ExpenseMetrics {
  total: number;
}

export interface ProfitMetrics {
  net: number;
}

export interface CashFlowMetrics {
  inflow: number;
  outflow: number;
}
