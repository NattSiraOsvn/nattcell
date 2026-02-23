// ============================================================
// src/types.ts — NATT-OS Central Type Registry
// Reconstructed by Băng & Kim
// ============================================================

// --- Enums (const objects + types) ---

export const ConstitutionalState = {
  BOOTING: 'BOOTING',
  ACTIVE: 'ACTIVE',
  DEGRADED: 'DEGRADED',
  LOCKDOWN: 'LOCKDOWN',
  MAINTENANCE: 'MAINTENANCE',
} as const;
export type ConstitutionalState = typeof ConstitutionalState[keyof typeof ConstitutionalState];

export const IngestStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMMITTED: 'COMMITTED',
  FAILED: 'FAILED',
  QUARANTINED: 'QUARANTINED',
  QUEUED: 'QUEUED',
  EXTRACTING: 'EXTRACTING',
  MAPPING: 'MAPPING',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
} as const;
export type IngestStatus = typeof IngestStatus[keyof typeof IngestStatus];

export const SyncConflictStrategy = {
  MERGE: 'MERGE',
  SOURCE_WINS: 'SOURCE_WINS',
  DESTINATION_WINS: 'DESTINATION_WINS',
  MANUAL: 'MANUAL',
  CRP: 'CRP',
} as const;
export type SyncConflictStrategy = typeof SyncConflictStrategy[keyof typeof SyncConflictStrategy];

export const AlertLevel = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  CRITICAL: 'CRITICAL',
  EMERGENCY: 'EMERGENCY',
  FATAL: 'FATAL',
} as const;
export type AlertLevel = typeof AlertLevel[keyof typeof AlertLevel];

export const ModuleID = {
  SALES: 'SALES',
  INVENTORY: 'INVENTORY',
  WAREHOUSE: 'WAREHOUSE',
  ACCOUNTING: 'ACCOUNTING',
  HR: 'HR',
  AUDIT: 'AUDIT',
  CUSTOMS: 'CUSTOMS',
  SHOWROOM: 'SHOWROOM',
  ANALYTICS: 'ANALYTICS',
  GOVERNANCE: 'GOVERNANCE',
} as const;
export type ModuleID = typeof ModuleID[keyof typeof ModuleID] | string;

export const PersonaID = {
  THIEN: 'THIEN',
  CAN: 'CAN',
  NA: 'NA',
  BANG: 'BANG',
  BOI_BOI: 'BOI_BOI',
  PHIEU: 'PHIEU',
  KIM: 'KIM',
  KRIS: 'KRIS',
  SYSTEM: 'SYSTEM',
} as const;
export type PersonaID = typeof PersonaID[keyof typeof PersonaID];

export const ViewType = {
  DASHBOARD: 'DASHBOARD',
  SALES: 'SALES',
  INVENTORY: 'INVENTORY',
  WAREHOUSE: 'WAREHOUSE',
  AUDIT: 'AUDIT',
  ANALYTICS: 'ANALYTICS',
  CUSTOMS: 'CUSTOMS',
  SHOWROOM: 'SHOWROOM',
  HR: 'HR',
  SETTINGS: 'SETTINGS',
  GOVERNANCE: 'GOVERNANCE',
  FACTORY: 'FACTORY',
  OMEGA: 'OMEGA',
  sales_terminal: 'sales_terminal',
  chat: 'chat',
  production_manager: 'production_manager',
  sales_tax: 'sales_tax',
  command: 'command',
  monitoring: 'monitoring',
  audit_center: 'audit_center',
} as const;
export type ViewType = typeof ViewType[keyof typeof ViewType];

export const UserRole = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  SALES_STAFF: 'SALES_STAFF',
  WAREHOUSE_STAFF: 'WAREHOUSE_STAFF',
  ACCOUNTANT: 'ACCOUNTANT',
  AUDITOR: 'AUDITOR',
  VIEWER: 'VIEWER',
  STAFF: 'STAFF',
  SENIOR_STAFF: 'SENIOR_STAFF',
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];

export const PositionType = {
  DIRECTOR: 'DIRECTOR',
  MANAGER: 'MANAGER',
  SENIOR_STAFF: 'SENIOR_STAFF',
  STAFF: 'STAFF',
  INTERN: 'INTERN',
  COLLABORATOR: 'COLLABORATOR',
  CHAIRMAN: 'CHAIRMAN',
  CONSULTANT: 'CONSULTANT',
  CFO: 'CFO',
} as const;
export type PositionType = typeof PositionType[keyof typeof PositionType];

export const Department = {
  SALES: 'SALES',
  PRODUCTION: 'PRODUCTION',
  WAREHOUSE: 'WAREHOUSE',
  ACCOUNTING: 'ACCOUNTING',
  HR: 'HR',
  IT: 'IT',
  LEGAL: 'LEGAL',
  HEADQUARTER: 'HEADQUARTER',
} as const;
export type Department = typeof Department[keyof typeof Department];

export const Domain = {
  SALES: 'SALES',
  INVENTORY: 'INVENTORY',
  WAREHOUSE: 'WAREHOUSE',
  ACCOUNTING: 'ACCOUNTING',
  HR: 'HR',
  AUDIT: 'AUDIT',
  GOVERNANCE: 'GOVERNANCE',
  CUSTOMS: 'CUSTOMS',
  PRODUCTION: 'PRODUCTION',
  SHOWROOM: 'SHOWROOM',
  SALES_TAX: 'SALES_TAX',
  LEGAL: 'LEGAL',
  IT: 'IT',
} as const;
export type Domain = typeof Domain[keyof typeof Domain];

export const ApprovalStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  ESCALATED: 'ESCALATED',
} as const;
export type ApprovalStatus = typeof ApprovalStatus[keyof typeof ApprovalStatus];

export const StockStatus = {
  IN_STOCK: 'IN_STOCK',
  LOW_STOCK: 'LOW_STOCK',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  RESERVED: 'RESERVED',
  AVAILABLE: 'AVAILABLE',
} as const;
export type StockStatus = typeof StockStatus[keyof typeof StockStatus];

export const WarehouseLocation = {
  HCM_HEADQUARTER: 'HCM_HEADQUARTER',
  HN_BRANCH: 'HN_BRANCH',
  MAIN_VAULT: 'MAIN_VAULT',
  SHOWROOM_FLOOR: 'SHOWROOM_FLOOR',
} as const;
export type WarehouseLocation = typeof WarehouseLocation[keyof typeof WarehouseLocation];

export const EInvoiceStatus = {
  DRAFT: 'DRAFT',
  ISSUED: 'ISSUED',
  CANCELLED: 'CANCELLED',
  REPLACED: 'REPLACED',
  XML_BUILT: 'XML_BUILT',
  SIGNED: 'SIGNED',
  ACCEPTED: 'ACCEPTED',
} as const;
export type EInvoiceStatus = typeof EInvoiceStatus[keyof typeof EInvoiceStatus];

export const OrderStatus = {
  DRAFT: 'DRAFT',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  READY: 'READY',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;
export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export const SalesChannel = {
  IN_STORE: 'IN_STORE',
  REFERRAL: 'REFERRAL',
  ONLINE_INQUIRY: 'ONLINE_INQUIRY',
  EVENT: 'EVENT',
} as const;
export type SalesChannel = typeof SalesChannel[keyof typeof SalesChannel];

export const ProductType = {
  RING: 'RING',
  NECKLACE: 'NECKLACE',
  BRACELET: 'BRACELET',
  EARRING: 'EARRING',
  PENDANT: 'PENDANT',
  CUSTOM: 'CUSTOM',
} as const;
export type ProductType = typeof ProductType[keyof typeof ProductType];

export const PolicyStatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  REVOKED: 'REVOKED',
} as const;
export type PolicyStatus = typeof PolicyStatus[keyof typeof PolicyStatus];

export const PolicyType = {
  INTERNAL: 'INTERNAL',
  REGULATORY: 'REGULATORY',
  CONTRACTUAL: 'CONTRACTUAL',
  OPERATIONAL: 'OPERATIONAL',
} as const;
export type PolicyType = typeof PolicyType[keyof typeof PolicyType];

export const ComplianceRequestType = {
  AUDIT: 'AUDIT',
  CERTIFICATION: 'CERTIFICATION',
  INSPECTION: 'INSPECTION',
  REVIEW: 'REVIEW',
} as const;
export type ComplianceRequestType = typeof ComplianceRequestType[keyof typeof ComplianceRequestType];

export const CertType = {
  ISO: 'ISO',
  KIMBERLEY: 'KIMBERLEY',
  ORIGIN: 'ORIGIN',
  QUALITY: 'QUALITY',
  CUSTOMS: 'CUSTOMS',
} as const;
export type CertType = typeof CertType[keyof typeof CertType];

export const RiskNodeStatus = {
  CLEAR: 'CLEAR',
  FLAGGED: 'FLAGGED',
  BLOCKED: 'BLOCKED',
  UNDER_REVIEW: 'UNDER_REVIEW',
} as const;
export type RiskNodeStatus = typeof RiskNodeStatus[keyof typeof RiskNodeStatus];

export const FinanceStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
} as const;
export type FinanceStatus = typeof FinanceStatus[keyof typeof FinanceStatus];

export const TrainingStatus = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  EXPIRED: 'EXPIRED',
} as const;
export type TrainingStatus = typeof TrainingStatus[keyof typeof TrainingStatus];

export const HeatLevel = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
} as const;
export type HeatLevel = typeof HeatLevel[keyof typeof HeatLevel];

export const SealingLevel = {
  NONE: 'NONE',
  SOFT: 'SOFT',
  HARD: 'HARD',
  CONSTITUTIONAL: 'CONSTITUTIONAL',
} as const;
export type SealingLevel = typeof SealingLevel[keyof typeof SealingLevel];

// --- Interfaces (giữ nguyên) ---

export interface BaseEvent<T = unknown> {
  event_id: string;
  event_type: string;
  event_version?: string;
  source_cell: string;
  source_module: string;
  actor: { persona?: string; user_id?: string; persona_id?: string };
  domain?: string;
  timestamp?: number;
  correlation_id: string;
  payload: T;
  audit_required: boolean;
}

export interface Event {
  id: string;
  type: string;
  payload: unknown;
  timestamp?: number;
  source: string;
  correlationId?: string;
  tenantId?: string;
}

export interface EventEnvelope {
  event: BaseEvent;
  metadata: EventMetadata;

  payload?: any;
  event_id?: string;
  trace?: any;
}

export interface EventMetadata {
  version: string;
  correlationId: string;
  causationId?: string;
  publishedAt?: number;
}

export type EventHandler = (event: BaseEvent) => Promise<void>;

export interface SalesEvent {
  order?: any;
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
  tenant_id: string;
  chain_id: string;
  sequence_number: number;
  event_type: string;
  payload_hash: string;
  prev_hash: string;
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
  brokenAt?: string;
}

export interface ActionLog {
  id: string;
  action: string;
  actor?: string;
  userId?: string;
  details?: string;
  userPosition?: string;
  module?: string;
  hash?: string;
  timestamp: number;
  result: 'SUCCESS' | 'FAILURE' | 'PENDING' | 'FAILED' | 'RECOVERED';
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
  changedAt?: Date | number;
  domain: string;
  entityId: string;
  fromState: string;
  toState: string;
  actor?: string;
  userId?: string;
  details?: string;
  userPosition?: string;
  module?: string;
  hash?: string;
  timestamp: number;
  reason?: string;

  tenantId?: string;

  entityType?: string;

  changedBy?: string;

  causationId?: string;
}

export type StateRegistry = {
  [domain: string]: { [entityId: string]: string };
};

export interface Product {
  image?: string;
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
  videos?: string[];
  minOrder?: number;
  moqUnit?: string;
  description?: string;
  stock?: number;
  isCustomizable?: boolean;
  leadTime?: number;
  supplier?: string | { id: string; maNhaCungCap: string; tenNhaCungCap: string; diaChi: string; maSoThue: string; [key: string]: any };
  rating?: number;
  reviews?: number;
  tags?: string[];
  specifications?: Record<string, string>;
  isVerifiedSupplier?: boolean;
  tradeAssurance?: boolean;
}

export interface Movement {
  id: string;
  productId: string;
  type: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';
  quantity: number;
  timestamp: number;
  actor: string;
  userId?: string;
  details?: string;
  userPosition?: string;
  module?: string;
  hash?: string;
  note?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  branch: string;
  capacity: number;
}

export interface WarehouseLocationDetail {
  id: string;
  WAREHOUSEId: string;
  zone: string;
  shelf: string;
  position: string;
}

export interface CustomerLead {
  ownerId?: string;
  id: string;
  name: string;
  phone: string;
  email?: string;
  tier: 'STANDARD' | 'VIP' | 'VVIP';
  source: string;
  assignedTo?: string;
  createdAt: number;

  assignedDate?: number;

  expiryDate?: number;
  status?: string;
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

  changeType?: string;
  recordType?: string;
  reason?: string;
  priority?: string;
}

export interface ApprovalTicket {
  workflowStep?: number;
  requestedAt?: number;
  id: string;
  approvalRequestId?: string;
  assignedTo?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dueAt?: number;

  request?: any;
  approvedBy?: string;
  approvedAt?: number;
  rejectionReason?: string;

  status?: string;

  totalSteps?: number;
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
  context?: any;
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: number;
  status: IngestStatus;
  shardId?: string;
  confidence?: number;
  hash?: string;
}

export interface QuantumState {
  energyLevel?: number;
  entanglementCount?: number;
  id?: string;
  coherence: number;
  entropy: number;
  superpositionCount: number;
  waveFunction: { amplitude: number; frequency: number; phase: number };
  lastCollapse?: number;
  lastCollapse_legacy?: number;
}

export interface ConsciousnessField {
  focusPoints?: string[];
  awarenessLevel: number;
  mood: 'OPTIMAL' | 'CAUTIOUS' | 'CRITICAL' | 'STABLE';
  lastCollapse: number;
  activeDomains?: string[];
}

export interface QuantumEvent {
  probability?: number;
  id: string;
  type: string;
  status: 'SUPERPOSITION' | 'COLLAPSED';
  sensitivityVector: { risk: number; financial: number; temporal: number; operational?: number };
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
  status?: string;
  journalType?: string;
  transactionDate?: number;
  id: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  currency: string;
  account: string;
  description: string;
  timestamp: number;
  reference?: unknown;
  matchScore?: number;
  entries?: unknown[];
  journalId?: string;
}

export interface AccountingMappingRule {
  name?: string;
  enabled?: boolean;
  source?: { system: string; [key: string]: unknown };
  destination?: string;
  priority?: number;
  transformation?: (value: unknown, context?: unknown) => unknown;
  autoPost?: boolean;
  mappingType?: string;
  sourceField?: string;
  destinationField?: string;
  destination?: any;
  id: string;
  eventType: string;
  debitAccount: string;
  creditAccount: string;
  description: string;
}

export interface BankTransaction {
  description?: string;
  credit?: boolean | number;
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
  orderId?: string;
  createdAt?: number;
  customerName?: string;
  customerTaxId?: string;
  taxAmount?: number;
  xmlPayload?: string;
  signatureHash?: string;
  taxCode?: string;
  id: string;
  invoiceNumber: string;
  buyer: { name: string; taxCode: string; address: string 
  vatRate?: number;
};
  seller: { name: string; taxCode: string; address: string };
  items: EInvoiceItem[];
  totalAmount: number;
  vatAmount: number;
  status: EInvoiceStatus;
  issuedAt: number;
}

export interface EInvoiceItem {
  id?: string;
  name?: string;
  totalBeforeTax?: number;
  taxRate?: number;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  vatRate: number;

  goldWeight?: number;
  goldPrice?: number;
  stonePrice?: number;
  laborPrice?: number;
}

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
  tasks_in_progress?: number;
  tasks_completed?: number;
  total_tasks?: number;
  teamId?: string;
  period?: string;
  kpiScore?: number;
  revenue?: number;
  targets?: Record<string, number>;
  actuals?: Record<string, number>;

  team_name?: string;

  tasks_blocked?: number;
  load_percentage?: number;
  completion_rate?: number;
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
  id?: string;
  sellerId: string;
  period: string;
  totalSales: number;
  totalCommission: number;
  transactionCount: number;

  sellerName?: string;

  customerName?: string;
  customerPhone?: string;
}

export interface BusinessMetrics {
  revenue: number;
  grossProfit: number;
  netProfit: number;
  period: string;
  branch?: string;
}

export interface GovernanceKPI {
  category?: string;
  kpi_name?: string;
  auditScore: number;
  complianceRate: number;
  riskLevel: AlertLevel;
  period: string;

  kpi_id?: string;

  period_date?: number;
  target_value?: number;
}

export interface HUDMetric {
  id?: string;
  label: string;
  icon?: string;
  department?: unknown;
  value: number | string;
  unit?: string;
  trend?: 'UP' | 'DOWN' | 'STABLE';
  alert?: AlertLevel;

  name?: string;
}

export interface RealTimeUpdate {
  type: string;
  payload: unknown;
  timestamp: number;
  source: string;
}

export interface ScannerState {
  id: string;
  isActive: boolean;
  lastScan: number;
  tHReatsFound: number;
  status: 'CLEAN' | 'SCANNING' | 'THREAT_DETECTED';
  last_scan_time: number;
  last_scan_head: number;
  errors_found: number;
  is_locked_down: boolean;
  current_status: string;
}

export interface FraudCheckResult {
  level: AlertLevel;
  message: string;
  action: 'PROCEED' | 'BLOCK' | 'WARN' | 'LOCK_ACCOUNT';
  historyRecord?: any;
  transactionId?: string;
  riskScore?: number;
  flags?: string[];
  recommendation?: 'APPROVE' | 'REVIEW' | 'REJECT';

  allowed?: boolean;
}

export interface Certification {
  description?: string;
  id: string;
  type: string;
  issuedBy: string;
  issuedAt: number;
  expiresAt?: number;
  status: 'ACTIVE' | 'VALID' | 'EXPIRED' | 'REVOKED' | 'PENDING' | 'ARCHIVED';

  expiryDate?: number;
  certificateNumber?: string;
  title?: string;
  verificationStatus?: string;

  issuingBody?: number | string;
  createdAt?: number | string;
  updatedAt?: number | string;

  issueDate?: number;
  renewalOf?: string;
}

export interface ModuleConfig {
  title?: string;
  id: ModuleID;
  name: string;
  isEnabled: boolean;
  version: string;
  dependencies: ModuleID[];

  icon?: string;
  group?: string;
  componentName?: string;
  active?: boolean;

  allowedRoles?: unknown[];
}

export interface OperationRecord {
  type?: string;
  error?: string;
  id: string;
  operation?: string;
  actor: string;
  userId?: string;
  details?: string;
  userPosition?: string;
  module?: string;
  hash?: string;
  timestamp: number;
  status: 'SUCCESS' | 'FAILURE' | 'PENDING' | 'FAILED' | 'RECOVERED';

  params?: unknown;
}

export interface Checkpoint {
  moduleState?: Record<string, unknown>;
  name?: string;
  state?: unknown;
  isValid?: boolean;
  id: string;
  timestamp: number;
}

export interface DictionaryVersion {
  status?: string;
  version: string;
  publishedAt: number;
  publishedBy?: string;
  changeLog?: string[];
  id?: string;
  isFrozen?: boolean;
  type?: string;

  versionNumber?: number;
  termsCount?: number;
  dictionaryId?: string;
  data?: any;

  createdAt?: unknown;
  changes?: unknown;
  previousVersionId?: unknown;
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
  id?: PersonaID;
  name: string;
  role: string;
  layer?: string;
  isActive?: boolean;
  position?: string;
  bio?: string;
  domain?: string;
  avatar?: string;
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

// --- Sales Core Types ---

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
  depositVND?: number;
}

export interface OrderPricing {
  exchangeRate?: number;
  discountPercentage?: number;
  taxAmount?: number;
  costOfGoods?: number;
  subtotal: number;
  basePriceTotal?: number;
  gdbPriceTotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  breakdown?: Record<string, number>;
  depositVND?: number;

  promotionDiscount?: number;

  shippingFee?: number;
  insuranceFee?: number;
  grossProfit?: number;
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
  WAREHOUSE: WarehouseLocation;
  salesPerson: SalesPerson;
  commission: CommissionInfo;
  createdAt: number;
  updatedAt: number;
}

// --- Logistics / Payment ---

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


export interface RuntimeInput {
  spanId?: string;
  identity?: any;
  traceId?: string; operation: string; userId: string; domain: string; tenantId: string; correlationId: string; payload: any; }

export interface RuntimeOutput {
  ok?: boolean;
  metadata?: Record<string, unknown>; success: boolean; data?: any; error?: string; 
  tenantId?: string;

  correlationId?: string;

  trace?: string;
}

export interface RuntimeState {
  lastTick?: number;
  version?: string; status: string; }

export interface TraceContext { spanId: string; traceId: string; }


export interface CostAllocation {
  costCenter: string;
  amount: number;
}

// ============================================================
// TYPES KẾ THỪA TỪ HỆ THỐNG CŨ — APPENDED BY BĂNG 21/02/2026
// ============================================================

export enum InputPersona {
  OFFICE = 'OFFICE (Dân Văn Phòng)',
  DATA_ENTRY = 'DATA_ENTRY (Nhập liệu chuyên nghiệp)',
  PHARMACY = 'PHARMACY (Nhập số thành thuốc)',
  EXPERT = 'EXPERT (Thợ kim hoàn rành tay)',
  ADMIN = 'ADMIN (Anh Natt)'
}

export interface CalibrationData {
  userId: string;
  persona: InputPersona;
  avgCPM: number;
  peakCPM: number;
  errorRate: number;
  burstCapacity: number;
  lastCalibrated: number;
  confidence: number;
}

export interface InputMetrics {
  currentCPM: number;
  keystrokes: number;
  clicks: number;
  intensity: number;
}

export interface EntanglementPair {
  id: string;
  entityA: string;
  entityB: string;
  strength: number;
  type: 'BELL_PAIR' | 'GHZ_STATE';
}

export interface NeuralPulse {
  id: string;
  intensity: number;
  origin: string;
  target: string;
}

export interface QuantumTask {
  id: string;
  type: string;
  payload: any;
  priority: number;
  timestamp: number;
}

export interface DistributedTask {
  id: string;
  origin: string;
  targetModule: string;
  payload: any;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  timestamp: number;
  priority?: 'URGENT' | 'NORMAL';
}

export interface PersonnelProfile {
  fullName: string;
  employeeCode: string;
  position: any;
  role: string;
  startDate: string;
  kpiPoints: number;
  tasksCompleted: number;
  lastRating: string;
  bio: string;
}

export interface LearnedTemplate { id: string; name: string; content: string; position?: string; [key: string]: unknown; }


export interface DetailedPersonnel { id: string; name?: string; fullName?: string; employeeCode?: string; email?: string; department?: string; position: unknown; role?: string; status?: string; baseSalary?: number; startDate?: string; kpiPoints?: number; tasksCompleted?: number; lastRating?: string; bankAccountNo?: string; allowanceLunch?: number; allowancePosition?: number; actualWorkDays?: number; bio?: string; [key: string]: unknown; }
export type HRDepartment = unknown;
export type HRPosition = unknown;
export interface HRAttendance { employeeId: string; employee_id?: string; date: string; status: string; hoursWorked?: number; total_hours?: number; checkIn?: number; source?: unknown; [key: string]: unknown; }
