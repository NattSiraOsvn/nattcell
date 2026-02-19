// ============================================================
// src/types.ts — NATT-OS Central Type Registry
// Reconstructed by Băng
// ============================================================

export enum ConstitutionalState {
  BOOTING = 'BOOTING',
  ACTIVE = 'ACTIVE',
  DEGRADED = 'DEGRADED',
  LOCKDOWN = 'LOCKDOWN',
  MAINTENANCE = 'MAINTENANCE',
}

export enum IngestStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMMITTED = 'COMMITTED',
  FAILED = 'FAILED',
  QUARANTINED = 'QUARANTINED',
}

export enum SyncConflictStrategy {
  MERGE = 'MERGE',
  SOURCE_WINS = 'SOURCE_WINS',
  DESTINATION_WINS = 'DESTINATION_WINS',
  MANUAL = 'MANUAL',
  CRP = 'CRP',
}

export enum AlertLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
  EMERGENCY = 'EMERGENCY',
}

export enum ModuleID {
  SALES = 'SALES',
  INVENTORY = 'INVENTORY',
  WAREHOUSE = 'WAREHOUSE',
  ACCOUNTING = 'ACCOUNTING',
  HR = 'HR',
  AUDIT = 'AUDIT',
  CUSTOMS = 'CUSTOMS',
  SHOWROOM = 'SHOWROOM',
  ANALYTICS = 'ANALYTICS',
  GOVERNANCE = 'GOVERNANCE',
}

export type PersonaID = 'THIEN' | 'CAN' | 'NA' | 'BANG' | 'BOI_BOI' | 'PHIEU' | 'KIM' | 'KRIS' | 'SYSTEM';

export type ViewType = 'DASHBOARD' | 'SALES' | 'INVENTORY' | 'WAREHOUSE' | 'AUDIT' | 'ANALYTICS' | 'CUSTOMS' | 'SHOWROOM' | 'HR' | 'SETTINGS' | 'GOVERNANCE' | 'FACTORY' | 'OMEGA';

export type UserRole = 'ADMIN' | 'MANAGER' | 'SALES_STAFF' | 'WAREHOUSE_STAFF' | 'ACCOUNTANT' | 'AUDITOR' | 'VIEWER';

export enum PositionType {
  DIRECTOR = 'DIRECTOR',
  MANAGER = 'MANAGER',
  SENIOR_STAFF = 'SENIOR_STAFF',
  STAFF = 'STAFF',
  INTERN = 'INTERN',
  COLLABORATOR = 'COLLABORATOR',
}

export type Department = 'SALES' | 'PRODUCTION' | 'WAREHOUSE' | 'ACCOUNTING' | 'HR' | 'IT' | 'LEGAL';

export type Domain = 'SALES' | 'INVENTORY' | 'WAREHOUSE' | 'ACCOUNTING' | 'HR' | 'AUDIT' | 'GOVERNANCE' | 'CUSTOMS' | 'PRODUCTION' | 'SHOWROOM';

export interface BaseEvent<T = unknown> {
  event_id: string;
  event_type: string;
  event_version: string;
  source_cell: string;
  source_module: string;
  actor: { persona?: string; user_id?: string; persona_id?: string };
  domain: string;
  timestamp: number;
  correlation_id: string;
  payload: T;
  audit_required: boolean;
}

export interface Event {
  id: string;
  type: string;
  payload: unknown;
  timestamp: number;
  source: string;
}

export interface EventEnvelope {
  event: BaseEvent;
  metadata: EventMetadata;
}

export interface EventMetadata {
  version: string;
  correlationId: string;
  causationId?: string;
  publishedAt: number;
}

export type EventHandler = (event: BaseEvent) => Promise<void>;

export interface SalesEvent {
  id: string;
  type: string;
  saleId: string;
  payload: unknown;
  timestamp: number;
}

export interface AuditRecord {
  record_id: string;
  timestamp: string;
  actor: { persona_id: string; user_id: string };
  action: string;
  scope: { cell: string; layer: string };
  payload: unknown;
  integrity_hash?: string;
}

export interface AuditActor {
  persona_id: string;
  user_id: string;
  ip?: string;
}

export interface AuditScope {
  cell: string;
  layer: string;
  domain?: string;
}

export interface AuditChainHead {
  head_hash: string;
  record_count: number;
  last_updated: number;
}

export interface IntegrityState {
  isValid: boolean;
  lastChecked: number;
  violations: string[];
}

export interface ActionLog {
  id: string;
  action: string;
  actor: string;
  timestamp: number;
  result: 'SUCCESS' | 'FAILURE' | 'PENDING';
}

export type GatekeeperDecision = {
  allowed: boolean;
  reason?: string;
  requiresApproval?: boolean;
  escalateTo?: string;
};

export type GatekeeperState = {
  state: ConstitutionalState;
  lockedAt?: number;
  lockedBy?: string;
  reason?: string;
};

export type EmergencyToken = {
  token: string;
  issuedBy: string;
  issuedAt: number;
  expiresAt: number;
  scope: string;
};

export interface StateChange {
  domain: string;
  entityId: string;
  fromState: string;
  toState: string;
  actor: string;
  timestamp: number;
  reason?: string;
}

export type StateRegistry = {
  [domain: string]: { [entityId: string]: string };
};

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  goldType?: string;
  weight?: number;
  price: number;
  status: StockStatus;
  serialNumber?: string;
  images?: string[];
}

export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'RESERVED';

export interface Movement {
  id: string;
  productId: string;
  type: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';
  quantity: number;
  timestamp: number;
  actor: string;
  note?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  branch: string;
  capacity: number;
}

export enum WarehouseLocation {
  HCM_HEADQUARTER = 'HCM_HEADQUARTER',
  HN_BRANCH = 'HN_BRANCH',
  MAIN_VAULT = 'MAIN_VAULT',
  SHOWROOM_FLOOR = 'SHOWROOM_FLOOR',
}

export interface WarehouseLocationDetail {
  id: string;
  warehouseId: string;
  zone: string;
  shelf: string;
  position: string;
}

export interface CustomerLead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  tier: 'STANDARD' | 'VIP' | 'VVIP';
  source: string;
  assignedTo?: string;
  createdAt: number;
}

export interface ApprovalRequest {
  id: string;
  type: string;
  requestedBy: string;
  payload: unknown;
  status: ApprovalStatus;
  createdAt: number;
  resolvedAt?: number;
  resolvedBy?: string;
}

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ESCALATED';

export interface ApprovalTicket {
  id: string;
  approvalRequestId: string;
  assignedTo: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dueAt?: number;
}

export interface SyncJob {
  id: string;
  name: string;
  source: string;
  destination: string;
  status: 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'PAUSED';
  progress: number;
  totalRows: number;
  processedRows: number;
  duplicatesFound: number;
  strategy: SyncConflictStrategy;
  isIncremental: boolean;
  isEncrypted: boolean;
}

export interface SyncLog {
  id: string;
  timestamp: number;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'SECURE' | 'SUCCESS';
  message: string;
}

export type ConflictResolutionMethod = 'CONFIDENCE_BASED' | 'TIMESTAMP_BASED' | 'SOURCE_PRIORITY' | 'MANUAL';

export interface DataPoint {
  id: string;
  source: string;
  payload: unknown;
  confidence: number;
  timestamp: number;
}

export interface FileMetadata {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: number;
  status: IngestStatus;
  shardId?: string;
  confidence?: number;
}

export interface QuantumState {
  id: string;
  coherence: number;
  entropy: number;
  superpositionCount: number;
  waveFunction: { amplitude: number; frequency: number; phase: number };
  lastCollapse: number;
}

export interface ConsciousnessField {
  awarenessLevel: number;
  mood: 'OPTIMAL' | 'CAUTIOUS' | 'CRITICAL';
  lastCollapse: number;
  activeDomains: string[];
}

export interface QuantumEvent {
  id: string;
  type: string;
  status: 'SUPERPOSITION' | 'COLLAPSED';
  sensitivityVector: { risk: number; financial: number; temporal: number };
  decision?: string;
  timestamp: number;
}

export interface CustomsDeclaration {
  id: string;
  declarationNumber: string;
  importerName: string;
  exporterName: string;
  items: CustomsDeclarationItem[];
  totalValue: number;
  currency: string;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  createdAt: number;
}

export interface CustomsDeclarationItem {
  id: string;
  hsCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  weight: number;
  origin: string;
  riskScore?: number;
}

export interface ActionPlan {
  id: string;
  action: string;
  assignedTo: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dueAt?: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface AccountingEntry {
  id: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  currency: string;
  account: string;
  description: string;
  timestamp: number;
  reference?: string;
}

export interface AccountingMappingRule {
  id: string;
  eventType: string;
  debitAccount: string;
  creditAccount: string;
  description: string;
}

export interface BankTransaction {
  id: string;
  amount: number;
  currency: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  timestamp: number;
  reference: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
}

export interface VATEntry {
  id?: string;
  invoiceId?: string;
  category?: string;
  salesValue?: number;
  purchaseValue?: number;
  vatRate?: number;
  taxRate?: number;
  vatAmount?: number;
  taxableAmount?: number;
  addedValue?: number;
  taxAmount?: number;
  timestamp?: number;
}

export interface VATReport {
  period: string;
  totalTaxableAmount?: number;
  totalVATAmount?: number;
  totalAddedValue?: number;
  totalVATPayable?: number;
  accountingStandard?: string;
  formNumber?: string;
  entries: VATEntry[];
}

export interface PITReport {
  employeeId?: string;
  period: string;
  grossIncome?: number;
  taxableIncome?: number;
  pitAmount?: number;
  totalTaxableIncome?: number;
  totalTaxPaid?: number;
  entries?: {
    employeeName: string;
    employeeCode: string;
    taxableIncome: number;
    deductions: number;
    taxPaid: number;
  }[];
}

export interface TaxCalculationResult {
  taxableAmount: number;
  taxRate: number;
  taxAmount: number;
  breakdown: Record<string, number>;
  cit?: {
    taxableIncome: number;
    standardRate: number;
    rate?: number;
    taxAmount: number;
    incentiveAmount: number;
    incentives?: Record<string, number>;
    finalTax: number;
    effectiveRate: number;
  };
}

export interface EInvoice {
  id: string;
  invoiceNumber: string;
  buyer: { name: string; taxCode: string; address: string };
  seller: { name: string; taxCode: string; address: string };
  items: EInvoiceItem[];
  totalAmount: number;
  vatAmount: number;
  status: EInvoiceStatus;
  issuedAt: number;
}

export interface EInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  vatRate: number;
}

export type EInvoiceStatus = 'DRAFT' | 'ISSUED' | 'CANCELLED' | 'REPLACED';

export interface EmployeePayroll {
  employeeId: string;
  employeeCode?: string;
  name?: string;
  period: string;
  baseSalary: number;
  allowances: number;
  allowanceLunch?: number;
  deductions: number;
  netSalary: number;
  kpiBonus?: number;
  taxableIncome?: number;
  personalTax?: number;
  status: 'PENDING' | 'APPROVED' | 'PAID';
}

export interface TeamPerformance {
  teamId: string;
  period: string;
  kpiScore: number;
  revenue: number;
  targets: Record<string, number>;
  actuals: Record<string, number>;
}

export interface LaborRuleResult {
  employeeId: string;
  violations: string[];
  recommendations: string[];
  isCompliant: boolean;
}

export interface SellerIdentity {
  id: string;
  name: string;
  role: UserRole;
  branch: string;
  commissionRate: number;
}

export interface SellerReport {
  sellerId: string;
  period: string;
  totalSales: number;
  totalCommission: number;
  transactionCount: number;
}

export interface BusinessMetrics {
  revenue: number;
  grossProfit: number;
  netProfit: number;
  period: string;
  branch?: string;
}

export interface GovernanceKPI {
  auditScore: number;
  complianceRate: number;
  riskLevel: AlertLevel;
  period: string;
}

export interface HUDMetric {
  label: string;
  value: number | string;
  unit?: string;
  trend?: 'UP' | 'DOWN' | 'STABLE';
  alert?: AlertLevel;
}

export interface RealTimeUpdate {
  type: string;
  payload: unknown;
  timestamp: number;
  source: string;
}

export interface ScannerState {
  isActive: boolean;
  lastScan: number;
  threatsFound: number;
  status: 'CLEAN' | 'SCANNING' | 'THREAT_DETECTED';
}

export interface FraudCheckResult {
  transactionId: string;
  riskScore: number;
  flags: string[];
  recommendation: 'APPROVE' | 'REVIEW' | 'REJECT';
}

export interface Certification {
  id: string;
  type: string;
  issuedBy: string;
  issuedAt: number;
  expiresAt?: number;
  status: 'VALID' | 'EXPIRED' | 'REVOKED';
}

export interface ModuleConfig {
  id: ModuleID;
  name: string;
  isEnabled: boolean;
  version: string;
  dependencies: ModuleID[];
}

export interface OperationRecord {
  id: string;
  operation: string;
  actor: string;
  module?: string;
  timestamp: number;
  status: 'SUCCESS' | 'FAILURE' | 'PENDING';
  details?: unknown;
}

export interface Checkpoint {
  id: string;
  name: string;
  timestamp: number;
  state: unknown;
  isValid: boolean;
}

export interface DictionaryVersion {
  version: string;
  publishedAt: number;
  publishedBy: string;
  changeLog: string[];
}

export interface QuoteRequest {
  id: string;
  productId: string;
  customizations: CustomizationRequest[];
  requestedBy: string;
  createdAt: number;
}

export interface QuoteResult {
  quoteId: string;
  totalPrice: number;
  breakdown: Record<string, number>;
  validUntil: number;
}

export interface CustomizationRequest {
  type: string;
  value: string | number;
  additionalCost?: number;
}

export interface Permission {
  id: string;
  resource: string;
  action: string;
  conditions?: Record<string, unknown>;
}

export type RBACRole = string;
export type RBACPermission = string;

export interface UserPosition {
  userId: string;
  position: PositionType;
  department: Department;
  branch: string;
  startDate: number;
}

export interface PersonaMetadata {
  id: PersonaID;
  name: string;
  role: string;
  layer: string;
  isActive: boolean;
}

export const VALID_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['READY', 'FAILED'],
  READY: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
  FAILED: ['PROCESSING'],
};

// ─── MISSING TYPES (from enums.ts) ──────────────────────────

export type PolicyStatus = 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'REVOKED';

export type PolicyType = 'INTERNAL' | 'REGULATORY' | 'CONTRACTUAL' | 'OPERATIONAL';

export type ComplianceRequestType = 'AUDIT' | 'CERTIFICATION' | 'INSPECTION' | 'REVIEW';

export type CertType = 'ISO' | 'KIMBERLEY' | 'ORIGIN' | 'QUALITY' | 'CUSTOMS';

export type RiskNodeStatus = 'CLEAR' | 'FLAGGED' | 'BLOCKED' | 'UNDER_REVIEW';

export type FinanceStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSING' | 'COMPLETED';

export type TrainingStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED';

export type HeatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type SealingLevel = 'NONE' | 'SOFT' | 'HARD' | 'CONSTITUTIONAL';

export enum OrderStatus {
  DRAFT = 'DRAFT',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export type SalesChannel = 'IN_STORE' | 'REFERRAL' | 'ONLINE_INQUIRY' | 'EVENT';

export type ProductType = 'RING' | 'NECKLACE' | 'BRACELET' | 'EARRING' | 'PENDANT' | 'CUSTOM';

// ─── SALES CORE TYPES ────────────────────────────────────────

export interface OrderItem {
  productId: string;
  serialNumber: string;
  productName: string;
  category?: string;
  goldType?: string;
  weight?: number;
  unitPrice: number;
  costPrice?: number;
  taxRate?: number;
  quantity: number;
  discount?: number;
}

export interface OrderPricing {
  subtotal: number;
  basePriceTotal?: number;
  gdbPriceTotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  breakdown?: Record<string, number>;
}

export interface CommissionInfo {
  policyId: string;
  baseRate: number;
  kpiFactor: number;
  estimatedAmount: number;
  finalAmount: number;
  status: string;
  total: number;
  shell: number;
  stone: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  tier: 'STANDARD' | 'VIP' | 'VVIP';
  address?: string;
}

export interface SalesPerson {
  id: string;
  name: string;
  role: UserRole;
  branch: string;
  kpiScore: number;
  position: { role: PositionType };
}

export interface SalesOrder {
  orderId: string;
  orderType: SalesChannel;
  customer: Customer;
  items: OrderItem[];
  pricing: OrderPricing;
  payment: {
    method: string;
    status: string;
    depositAmount: number;
    remainingAmount: number;
    currency: string;
  };
  status: OrderStatus;
  warehouse: WarehouseLocation;
  salesPerson: SalesPerson;
  commission: CommissionInfo;
  createdAt: number;
  updatedAt: number;
}

// ─── LOGISTICS / PAYMENT ─────────────────────────────────────

export interface LogisticsInfo {
  method: string;
  address?: string;
  trackingNumber?: string;
  estimatedDelivery?: number;
  status: string;
}

export interface PaymentInfo {
  method: string;
  status: string;
  depositAmount: number;
  remainingAmount: number;
  currency: string;
  paidAt?: number;
  reference?: string;
}
