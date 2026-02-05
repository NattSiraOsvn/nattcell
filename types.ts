
// 👑 sovereign: anh_nat

export enum user_role {
  master = 'master',
  admin = 'admin',
  operator = 'operator',
  signer = 'signer',
  approver = 'approver',
  level_1 = 'level_1',
  level_2 = 'level_2',
  level_3 = 'level_3',
  level_4 = 'level_4',
  level_5 = 'level_5',
  level_6 = 'level_6',
  level_7 = 'level_7',
  level_8 = 'level_8'
}
export type UserRole = user_role;
export const UserRole = user_role;

export enum view_type {
  dashboard = 'dashboard',
  sales_terminal = 'sales_terminal',
  warehouse = 'warehouse',
  command = 'command',
  monitoring = 'monitoring',
  chat = 'chat',
  sales_tax = 'sales_tax',
  audit_center = 'audit_center',
  processor = 'processor',
  data_archive = 'data_archive',
  showroom = 'showroom',
  production_manager = 'production_manager',
  ops_terminal = 'ops_terminal',
  showroom_v2 = 'showroom_v2'
}
export type ViewType = view_type;
export const ViewType = view_type;

export enum department {
  hq = 'hq',
  finance = 'finance',
  sales = 'sales',
  production = 'production',
  it = 'it',
  warehouse = 'warehouse'
}
export type Department = department;
export const Department = department;

export enum position_type {
  CFO = 'CFO',
  CEO = 'CEO',
  CHAIRMAN = 'CHAIRMAN',
  GENERAL_MANAGER = 'GENERAL_MANAGER',
  PROD_DIRECTOR = 'PROD_DIRECTOR',
  ACCOUNTING_MANAGER = 'ACCOUNTING_MANAGER',
  CASTING_MANAGER = 'CASTING_MANAGER',
  ROUGH_FINISHER = 'ROUGH_FINISHER',
  CONSULTANT = 'CONSULTANT',
  COLLABORATOR = 'COLLABORATOR'
}
export type PositionType = position_type;
export const PositionType = position_type;

export interface user_position {
  id: string;
  role: position_type | string;
  department: department;
  scope: string[];
}
export type UserPosition = user_position;

export interface business_metrics {
  revenue: number;
  revenue_pending: number;
  gold_inventory: number;
  production_progress: number;
  risk_score: number;
  last_update: number;
  goldInventory?: number;
  productionProgress?: number;
  riskScore?: number;
  invoicesIssued?: number;
  totalTaxDue?: number;
  totalPayroll?: number;
  currentOperatingCost?: number;
  importVolume?: number;
  pendingApprovals?: number;
  cadPending?: number;
  totalCogs?: number;
  totalOperating?: number;
}
export type BusinessMetrics = business_metrics;

export enum persona_id {
  thien = 'thien',
  can = 'can',
  kris = 'kris',
  phieu = 'phieu',
  bang = 'bang'
}
export type PersonaID = persona_id;
export const PersonaID = persona_id;

export interface chat_message {
  id: string;
  role: 'user' | 'model';
  content: string;
  persona_id: persona_id;
  personaId?: persona_id;
  timestamp: number;
  type?: 'text' | 'image' | 'video' | 'audio';
  isEdited?: boolean;
  history?: Array<{ content: string; timestamp: number }>;
}
export type ChatMessage = chat_message;

export interface PersonaMetadata {
  name: string;
  role: string;
  position: string;
  bio: string;
  domain: string;
  avatar: string;
}

export enum Domain {
  AUDIT = 'AUDIT',
  SALES_TAX = 'SALES_TAX',
  LEGAL = 'LEGAL',
  IT = 'IT'
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  category: string;
  image: string;
  images: string[];
  videos: string[];
  minOrder: number;
  moqUnit: string;
  description: string;
  stock: number;
  isCustomizable: boolean;
  leadTime: number;
  supplier: {
    id: string;
    maNhaCungCap: string;
    tenNhaCungCap: string;
    diaChi: string;
    maSoThue: string;
  };
  rating: number;
  reviews: number;
  isVerifiedSupplier: boolean;
  tradeAssurance: boolean;
  specifications: Record<string, any>;
  tags: string[];
  status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'RESERVED' | 'DISCONTINUED';
}

export interface SyncJob {
  id: string;
  name: string;
  source: string;
  destination: string;
  status: 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  progress: number;
  totalRows: number;
  processedRows: number;
  duplicatesFound: number;
  strategy: SyncConflictStrategy;
  isIncremental: boolean;
  isEncrypted: boolean;
}

export enum SyncConflictStrategy {
  MERGE = 'MERGE',
  OVERWRITE = 'OVERWRITE',
  KEEP_NEWEST = 'KEEP_NEWEST'
}

export interface SyncLog {
  id: string;
  timestamp: number;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'SECURE' | 'SUCCESS';
  message: string;
}

export enum ConflictResolutionMethod {
  PRIORITY_BASED = 'priority_based',
  TIMESTAMP_BASED = 'timestamp_based',
  MANUAL_REVIEW = 'manual_review'
}

export interface DataPoint {
  id: string;
  source: string;
  payload: any;
  confidence: number;
  timestamp: number;
  calculatedConfidence?: number;
  scoreDetails?: any;
}

export interface BlockShard {
  shardId: string;
  enterpriseId: string;
  blockHash: string;
  prevHash: string;
  status: string;
  timestamp: number;
}

export interface AuditItem {
  id: string;
  timestamp: number;
  userId: string;
  action: string;
  details: string;
  hash: string;
  causation_id?: string | null;
}

export interface CustomsDeclaration {
  header: {
    declarationNumber: string;
    pageInfo: string;
    registrationDate: string;
    customsOffice: string;
    deptCode: string;
    streamCode: 'GREEN' | 'YELLOW' | 'RED';
    declarationType: string;
    mainHsCode: string;
  };
  items: CustomsDeclarationItem[];
  summary: {
    totalTaxPayable: number;
    clearanceStatus: string;
    riskNotes: string;
    relatedFiles: string[];
    internalNotes: string;
  };
  riskAssessment?: RiskAssessment;
  compliance?: ComplianceCheck;
  trackingTimeline?: TrackingStep[];
}

export interface CustomsDeclarationItem {
  stt: number;
  hsCode: string;
  description: string;
  invoiceValue: number;
  vatRate: number;
  vatAmount: number;
  vatTaxableValue: number;
  certNumber?: string;
  gemType?: string;
  shape?: string;
  color?: string;
  clarity?: string;
  weightCT?: number;
  validationErrors?: string[];
}

export interface ActionPlan {
  priority: 'URGENT' | 'HIGH' | 'NORMAL';
  action: string;
  reason: string;
  department: string;
}

export interface RiskAssessment {
  score: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors: Array<{ factor: string; weight: number; description: string }>;
}

export interface ComplianceCheck {
  isCompliant: boolean;
  issues: Array<{ type: string; severity: 'BLOCKING' | 'WARNING'; message: string }>;
  requiredDocuments: string[];
}

export interface TrackingStep {
  id: string;
  label: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED';
  timestamp?: number;
  pic?: string;
  location?: string;
  notes?: string;
}

export enum IngestStatus {
  QUEUED = 'QUEUED',
  EXTRACTING = 'EXTRACTING',
  MAPPING = 'MAPPING',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  COMMITTED = 'COMMITTED',
  FAILED = 'FAILED'
}

export interface FileMetadata {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  hash: string;
  uploadedAt: number;
  uploadedBy?: string;
  timestamp?: number;
  status: IngestStatus;
  confidence?: number;
  context?: string;
}

export interface RFMData {
  customerId: string;
  name: string;
  recency: number;
  frequency: number;
  monetary: number;
  score: number;
  segment: 'VIP' | 'THÀNH VIÊN' | 'RỦI RO' | 'MỚI';
}

export interface AuditTrailEntry {
  id: string;
  timestamp: number;
  userId: string;
  role: string | user_role;
  action: string;
  oldValue?: string;
  newValue?: string;
  note?: string;
  hash: string;
}

export enum SealingLevel {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}

export interface SealingRecord {
  id: string;
  level: SealingLevel;
  period: string;
  aggregateHash: string;
  sealedAt: number;
  sealedBy: string;
  metrics: {
    totalRevenue: number;
    totalExpense: number;
    totalTax: number;
    checkSum: string;
  };
}

export interface EmployeePayroll {
  id: string;
  name: string;
  employeeCode: string;
  division: string;
  department: string;
  role: string;
  startDate: string;
  baseSalary: number;
  actualWorkDays: number;
  allowanceLunch: number;
  dependents: number;
  insuranceSalary: number;
  seniority?: string;
  grossSalary?: number;
  insuranceEmployee?: number;
  personalTax?: number;
  netSalary?: number;
  performanceBonus?: number;
  kpiPoints?: number;
  taxableIncome?: number;
}

export interface SalaryRule {
  division: string;
  role: string;
  grade: string;
  salary: number;
}

export interface OperationRecord {
  id: string;
  type: string;
  module: string;
  params: any;
  timestamp: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'RECOVERED';
  error?: string;
}

export interface InputMetrics {
  currentCPM: number;
  keystrokes: number;
  clicks: number;
  intensity: number;
}

export interface BankTransaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  credit?: number;
  debit?: number;
  refNo?: string;
  bankName?: string;
  accountNumber?: string;
  type?: 'INCOME' | 'EXPENSE';
  taxRate?: number;
  exchangeRate?: number;
  status?: 'SYNCED' | 'PENDING' | 'ERROR';
  processDate?: string;
}

export interface ValueGroup {
  label: string;
  value: number;
  color: string;
}

export interface StockStatus {
  total: number;
  available: number;
  reserved: number;
  lowStockThreshold: number;
}

export interface EInvoice {
  id: string;
  orderId: string;
  customerName: string;
  customerTaxId?: string;
  totalAmount: number;
  taxAmount: number;
  vatRate: number;
  status: EInvoiceStatus;
  createdAt: number;
  issuedAt?: number;
  items: EInvoiceItem[];
  xmlPayload?: string;
  signatureHash?: string;
  taxCode?: string;
}

export enum EInvoiceStatus {
  DRAFT = 'DRAFT',
  XML_BUILT = 'XML_BUILT',
  SIGNED = 'SIGNED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export interface EInvoiceItem {
  id: string;
  name: string;
  goldWeight: number;
  goldPrice: number;
  stonePrice: number;
  laborPrice: number;
  taxRate: number;
  totalBeforeTax: number;
}

export interface Supplier {
  id: string;
  maNhaCungCap: string;
  tenNhaCungCap: string;
  diaChi: string;
  maSoThue: string;
  maNhomNCC?: string;
  dienThoai?: string;
  website?: string;
  email?: string;
  quocGia?: string;
  tinhTP?: string;
  soTaiKhoan?: string;
  tenNganHang?: string;
  ghiChu?: string;
  transactionAmount?: number;
  loaiNCC?: 'NUOC_NGOAI' | 'TO_CHUC' | 'CA_NHAN';
  sentimentScore?: number;
  nhomHangChinh?: string[];
  khuVuc?: 'BAC' | 'TRUNG' | 'NAM' | 'QUOC_TE';
  phuongThucThanhToan?: 'TIEN_MAT' | 'CHUYEN_KHOAN' | 'QUOC_TE';
  dichVuDacThu?: string[];
  mucDoUuTien?: 'CAO' | 'TRUNG_BINH' | 'THAP';
  trangThaiHopTac?: string;
  mucDoTinCay?: 'A' | 'B' | 'C';
  ngayBatDauHopTac?: string;
  quyMo?: 'LON' | 'VUA' | 'NHO';
  coTienNang?: boolean;
  diemDanhGia?: number;
}

export interface EmailMessage {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  date: string;
  category: 'LOGISTICS' | 'HÓA ĐƠN' | 'CHÍNH PHỦ';
  hasAttachment: boolean;
  isRead: boolean;
  priority: 'TRUNG BÌNH' | 'CAO' | 'THẤP';
}

export interface RoomConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  creatorId: string;
  members: string[];
  pendingRequests: JoinRequest[];
  settings: RoomSettings;
}

export interface RoomSettings {
  antiSpam: boolean;
  blockPersonas: string[];
  autoDeleteMessages: boolean;
  encryptionLevel: 'OMEGA' | 'TIÊU CHUẨN';
  isMuted: boolean;
  joinCode: string;
  allowCalls: boolean;
  allowVoice: boolean;
  allowImport: boolean;
}

export interface JoinRequest {
  id: string;
  userId: string;
  userName: string;
  userPosition: UserPosition;
  timestamp: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface ActionLog {
  id: string;
  timestamp: number;
  userId: string;
  action: string;
  details: string;
  module: string;
  hash: string;
  userPosition?: string;
}

export enum HeatLevel {
  LEVEL_1 = 'LEVEL_1',
  LEVEL_2 = 'LEVEL_2',
  LEVEL_3 = 'LEVEL_3'
}

export interface GovernanceRecord {
  id: string;
  timestamp: number;
  type: string;
  status: 'BẢN NHÁP' | 'ĐÃ DUYỆT' | 'BỊ TỪ CHỐI' | 'ĐÃ KÝ SỐ';
  data: any;
  operatorId: string;
  auditTrail: AuditTrailEntry[];
}

export type TxStatus = 'CHỜ PHÊ DUYỆT' | 'SẴN SÀNG KÝ' | 'ĐÃ KÝ SỐ' | 'BỊ TRẢ LẠI';

export interface GovernanceTransaction {
  id: string;
  period: string;
  status: TxStatus;
  type: string;
  amount: number;
  counterparty: string;
  description: string;
  date: string;
  attachments: Array<{ id: string; name: string; url: string }>;
  flags: Array<{ level: string; message: string }>;
  auditTrail: AuditTrailEntry[];
}

export enum ModuleID {
  PRODUCTION = 'PRODUCTION',
  SALES = 'SALES',
  FINANCE = 'FINANCE',
  LEGAL = 'LEGAL',
  HR = 'HR',
  REPORTING = 'REPORTING',
  INVENTORY = 'INVENTORY'
}

export enum Permission {
  VIEW = 'VIEW',
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  APPROVE = 'APPROVE',
  SIGN = 'SIGN',
  EXPORT = 'EXPORT'
}

export interface CustomizationRequest {
  specifications: Record<string, string>;
  quantity: number;
  deadline: string;
  notes: string;
  samples: boolean;
  logo: boolean;
  packaging: string;
  engraving?: EngravingConfig;
  materialOverride: MaterialOverride;
  hash: string;
}

export interface EngravingConfig {
  enabled: boolean;
  text: string;
  font: 'CLASSIC' | 'SCRIPT' | 'SERIF';
  location: 'INSIDE' | 'OUTSIDE';
}

export interface MaterialOverride {
  goldColor: 'YELLOW' | 'WHITE' | 'ROSE';
  goldPurity: '18K' | '14K' | '24K';
  stoneClass: 'VVS1' | 'VVS2' | 'VS1' | 'CZ_MASTER';
}

export interface ComplianceRequest {
  id: string;
  code: string;
  title: string;
  type: ComplianceRequestType;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: string;
  dueDate: number;
  requesterId: string;
}

export enum ComplianceRequestType {
  AUDIT_FOLLOWUP = 'AUDIT_FOLLOWUP',
  CERT_RENEWAL = 'CERT_RENEWAL'
}

export interface AssessmentResult {
  id: string;
  code: string;
  entityName: string;
  score: number;
  passed: boolean;
  riskLevel: string;
  assessmentDate: number;
  nextAssessmentDate: number;
  findings: string[];
  status: string;
}

export interface LearnedTemplate {
  position: string;
  docTypeDetected: string;
  suggestions: string[];
  fields: DynamicField[];
  dailyTasks: any[];
  productionData?: any;
  lastUpdated: number;
}

export interface DynamicField {
  id: string;
  label: string;
  type: 'number' | 'text' | 'select' | 'boolean';
  required: boolean;
}

export interface PersonnelProfile {
  fullName: string;
  employeeCode: string;
  position: UserPosition;
  role: UserRole;
  startDate: string;
  kpiPoints: number;
  tasksCompleted: number;
  lastRating: string;
  bio: string;
}

export enum OrderStatus {
  DRAFT = 'DRAFT',
  SALE_ORDER = 'SALE_ORDER',
  DESIGNING = 'DESIGNING',
  WAX_READY = 'WAX_READY',
  MATERIAL_ISSUED = 'MATERIAL_ISSUED',
  CASTING = 'CASTING',
  CASTING_LOSS_ALERT = 'CASTING_LOSS_ALERT',
  COLLECTING_BTP = 'COLLECTING_BTP',
  COLD_WORK = 'COLD_WORK',
  TOTAL_LOSS_LOCKED = 'TOTAL_LOSS_LOCKED',
  STONE_SETTING = 'STONE_SETTING',
  FINISHING = 'FINISHING',
  QC_PENDING = 'QC_PENDING',
  QC_PASSED = 'QC_PASSED',
  COMPLETED = 'COMPLETED'
}

export interface ProductionJobBag {
  id: string;
  sku: string;
  customerName: string;
  status: OrderStatus;
  issuedWeight: number;
  btpWeight?: number;
  recoveryWeight?: number;
  deadline: number;
  workerId?: string;
}

export interface SellerReport {
  id: string;
  sellerId: string;
  sellerName: string;
  customerName: string;
  customerPhone: string;
  productSku: string;
  shellRevenue: number;
  stoneRevenue: number;
  stoneType: 'NONE' | 'UNDER_4LY' | 'ROUND_OVER_4LY' | 'FANCY_SHAPE';
  depositAmount: number;
  isReportedWithin24h: boolean;
  status: string;
  documents: any;
  commission: CommissionInfo;
  timestamp: number;
}

export interface SellerIdentity {
  userId: string;
  fullName: string;
  stars: number;
  kpiPoints: number;
  violations: number;
  role: UserRole;
  position: UserPosition;
  isCollaborator: boolean;
  department: string;
  gatekeeperBalance: number;
}

export interface CommissionInfo {
  policyId: string;
  baseRate: number;
  kpiFactor: number;
  estimatedAmount: number;
  finalAmount: number;
  status: 'PENDING' | 'PAID';
  total: number;
  shell: number;
  stone: number;
}

export interface CustomerLead {
  id: string;
  name: string;
  phone: string;
  source: string;
  ownerId: string;
  assignedDate: number;
  expiryDate: number;
  status: 'WARM' | 'HOT' | 'COLD' | 'CONVERTED';
  lastInteraction: number;
}

export interface LogisticsSolution {
  partnerId: string;
  partnerName: string;
  serviceType: string;
  cost: any;
  estimatedDelivery: number;
  reliability: number;
  totalCost: number;
  score: number;
  recommended: boolean;
}

export interface TransferOrder {
  id: string;
  transferId: string;
  productId: string;
  productName: string;
  quantity: number;
  fromWarehouse: string;
  toWarehouse: string;
  transferDate: number;
  expectedDelivery: number;
  status: string;
  transportMethod: string;
  documents: string[];
}

export interface DetailedPersonnel extends EmployeePayroll {
  email: string;
  position: UserPosition;
  role: UserRole;
  status: string;
  bankAccountNo?: string;
  bio?: string;
}

export interface HRPosition {
  id: string;
  code: string;
  title: string;
  department_id: string;
  is_active: boolean;
}

export interface HRAttendance {
  id: string;
  employee_id: string;
  date: string;
  checkIn: number;
  total_hours: number;
  status: string;
  source: {
    type: 'MACHINE' | 'OMEGA_SYNC' | 'HR_ADJUSTED';
    deviceId: string;
    hash: string;
    adjustedBy?: string;
  };
}

export interface ProductionOrder {
  id: string;
  serial_number: string;
  production_code: string;
  sku: string;
  customer_id: string;
  status: OrderStatus;
  priority: string;
  deadline: number;
  gold_type: string;
  target_weight: number;
  stone_specs: any[];
  weight_history: any[];
  transactions: any[];
  qc_reports: any[];
  created_at: number;
  updated_at: number;
}

export interface MaterialTransaction {
  id: string;
  order_id: string;
  type: 'ISSUE' | 'RETURN';
  material_type: string;
  weight: number;
  timestamp: number;
}

export interface WeightTracking {
  order_id: string;
  stage: OrderStatus;
  weight_before: number;
  weight_after: number;
  recovery_gold: number;
}

export interface WorkerPerformance {
  worker_id: string;
  avg_loss: number;
  on_time_rate: number;
  qc_pass_rate: number;
}

export interface ModuleConfig {
  id: string;
  title: string;
  icon: string;
  group: string;
  allowedRoles: UserRole[];
  componentName: string;
  active: boolean;
}

export interface VATReport {
  period: string;
  entries: VATEntry[];
  totalAddedValue: number;
  totalVATPayable: number;
  accountingStandard: string;
  formNumber: string;
}

export interface PITReport {
  period: string;
  entries: any[];
  totalTaxableIncome: number;
  totalTaxPaid: number;
}

export interface VATEntry {
  category: string;
  salesValue: number;
  purchaseValue: number;
  addedValue: number;
  taxRate: number;
  taxAmount: number;
}

export interface DistributedTask {
  id: string;
  origin: string;
  targetModule: ViewType;
  payload: any;
  priority: 'LOW' | 'NORMAL' | 'HIGH';
  timestamp: number;
  status: 'PENDING' | 'COMPLETED';
}

export enum AlertLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
  FATAL = 'FATAL'
}

export interface InputPersona {
  OFFICE: number;
  DATA_ENTRY: number;
  PHARMACY: number;
  EXPERT: number;
  MASTER: number;
}

export enum SalesChannel {
  DIRECT_SALE = 'DIRECT_SALE',
  ONLINE = 'ONLINE',
  LOGISTICS = 'LOGISTICS',
  WHOLESALE = 'WHOLESALE'
}

export enum ProductType {
  RAW_MATERIAL = 'RAW_MATERIAL',
  SEMI_FINISHED = 'SEMI_FINISHED',
  FINISHED_GOOD = 'FINISHED_GOOD',
  SERVICE = 'SERVICE'
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  tier: string;
  loyaltyPoints?: number;
}

export interface LogisticsInfo {
  providerId: string;
  trackingNumber: string;
  status: string;
  shippingFee: number;
}

export interface PaymentInfo {
  method: 'CASH' | 'CARD' | 'VNPAY' | 'MOMO' | 'ZALOPAY';
  status: 'UNPAID' | 'PARTIAL' | 'PAID';
  depositAmount: number;
  remainingAmount: number;
  currency: string;
}

export interface SalesPerson {
  id: string;
  name: string;
  position: UserPosition;
  kpiScore: number;
}

export interface OrderItem {
  productId: string;
  productCode: string;
  productName: string;
  productType: ProductType;
  sku: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  discount: number;
  taxRate: number;
  total: number;
  warehouseLocation: WarehouseLocation;
}

export interface SalesOrder {
  orderId: string;
  orderType: SalesChannel;
  customer: Customer;
  items: OrderItem[];
  pricing: OrderPricing;
  payment: PaymentInfo;
  status: OrderStatus;
  warehouse: WarehouseLocation;
  salesPerson: SalesPerson;
  commission: CommissionInfo;
  createdAt: number;
  updatedAt: number;
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
  costOfGoods: number;
  grossProfit: number;
  profitMargin: number;
}

export interface WorkflowNode {
  id: string;
  label: string;
  view: ViewType;
  x: number;
  y: number;
  color: string;
  icon: string;
  desc: string;
  status: 'ACTIVE' | 'IDLE' | 'BUSY';
}

export interface WorkflowEdge {
  from: string;
  to: string;
  label: string;
  active: boolean;
}

export interface QuantumState {
  coherence: number;
  entropy: number;
  superpositionCount: number;
  entanglementCount: number;
  energyLevel: number;
  waveFunction: { amplitude: number; phase: number; frequency: number };
}

export interface QuantumEvent {
  id: string;
  type: string;
  sensitivityVector: { temporal: number; financial: number; risk: number; operational: number };
  status: 'SUPERPOSITION' | 'COLLAPSED';
  probability: number;
  timestamp: number;
  decision?: string;
}

export interface ConsciousnessField {
  awarenessLevel: number;
  focusPoints: string[];
  mood: 'STABLE' | 'CAUTIOUS' | 'CRITICAL';
  lastCollapse: number;
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
  origin: string;
  intensity: number;
}

export interface AccountingEntry {
  journalId: string;
  transactionDate: Date;
  description: string;
  journalType?: 'REVENUE' | 'COGS' | 'EXPENSE' | 'ALLOCATION';
  status: 'DRAFT' | 'POSTED' | 'SYNCED' | 'ERROR';
  entries: AccountingLine[];
  reference: Record<string, any>;
  matchScore: number;
  createdAt: Date;
  aiNote?: string;
  referenceId?: string;
  referenceType?: string;
}

export interface AccountingLine {
  accountNumber: string;
  accountName: string;
  debit: number;
  credit: number;
  currency: string;
  detail?: string;
}

export interface FinancialAnomaly {
  id: string;
  invoice_id: string;
  reason: string;
  amount: number;
  severity: 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: number;
}

export interface AccountingMappingRule {
  id: string;
  name: string;
  description: string;
  source: { system: string; entity: string; eventType: string };
  sourceField: string;
  destination: { system: string; entity: string; accountType: string };
  destinationField: string;
  mappingType: 'DIRECT' | 'AGGREGATE' | 'SPLIT' | 'REALTIME' | 'CONDITIONAL';
  transformation: (value: any, context?: any) => any;
  autoPost: boolean;
  enabled: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SalesEvent {
  type: string;
  order?: any;
  timestamp: Date;
}

export interface AccountMapRule {
  id: string;
  sourceType: 'SALES' | 'BANK' | 'STOCK';
  conditionField: string;
  conditionValue: string;
  debitAccount: string;
  creditAccount: string;
  name: string;
}

export interface RealTimeUpdate {
  id: string;
  type: string;
  timestamp: Date;
  data: any;
  source: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  processed: boolean;
}

export interface AuditRecord {
  record_id: string;
  tenant_id: string;
  chain_id: string;
  sequence_number: number;
  timestamp: string;
  event_type: string;
  actor: AuditActor;
  payload: any;
  payload_hash: string;
  prev_hash: string;
  entry_hash: string;
  metadata?: any;
}

export interface AuditActor {
  type: 'USER' | 'SYSTEM' | 'AI';
  id: string;
}

export interface AuditChainHead {
  tenant_id: string;
  chain_id: string;
  last_sequence: number;
  last_hash: string;
  updated_at: number;
}

export interface IntegrityState {
  isValid: boolean;
  brokenAt?: string;
}

export interface ScannerState {
  id: string;
  current_status: 'OK' | 'TAMPERED';
  last_scan_time: number;
  last_scan_head: number;
  errors_found: number;
  is_locked_down: boolean;
}

export interface DLQEvent {
  id: string;
  event: EventEnvelope;
  error: string;
  retries: number;
  timestamp: number;
}

export interface CostAllocation {
  costId: string;
  costType: 'MARKETING' | 'RENT' | 'OPERATIONS';
  totalAmount: number;
  allocationMethod: 'REVENUE_BASED';
  allocationDate: number;
  allocations: Array<{
    costCenter: string;
    allocatedAmount: number;
    allocationRatio: number;
    basis: string;
  }>;
}

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface RefundRequest {
  id: string;
  orderId: string;
  amount: number;
  reason: string;
  status: ApprovalStatus;
  requestedBy: string;
  evidence: string[];
  timestamp: number;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
}

export interface RBACRole {
  id: string;
  name: string;
  description: string;
  is_system: boolean;
  permissions: string[];
}

export interface RBACPermission {
  id: string;
  resource: string;
  action: 'read' | 'create' | 'update' | 'delete' | 'approve';
  description: string;
}

export interface UserContext {
  role: user_role;
  permissions: Permission[];
}

export interface SystemConfig {
  vatRate: number;
  lowStockThreshold: number;
  enableCardPayment: boolean;
  storeStatus: 'OPEN' | 'CLOSED';
  commissionRules: {
    baseRate: number;
    thresholdAmount: number;
    bonusRate: number;
  };
}

export interface ShiftSession {
  id: string;
  employeeId: string;
  openingCash: number;
  startTime: number;
  status: 'OPEN' | 'CLOSED';
}

export interface VATEntry {
  category: string;
  salesValue: number;
  purchaseValue: number;
  addedValue: number;
  taxRate: number;
  taxAmount: number;
}

export interface EventEnvelope<T = any> {
  event_name: string;
  event_version: string;
  event_id: string;
  occurred_at: string;
  producer: string;
  trace: {
    correlation_id: string;
    causation_id: string | null;
    trace_id: string;
  };
  tenant: {
    org_id: string;
    workspace_id: string;
  };
  payload: T;
}

export interface SagaLog {
  id: string;
  correlation_id: string;
  step: string;
  status: 'SUCCESS' | 'COMPENSATING' | 'FAILED' | 'ORPHAN';
  details: string;
  timestamp: number;
  causation_id?: string | null;
}

export interface VATReport {
  period: string;
  entries: VATEntry[];
  totalAddedValue: number;
  totalVATPayable: number;
  accountingStandard: string;
  formNumber: string;
}

export interface PITReport {
  period: string;
  entries: Array<{
    employeeName: string;
    employeeCode: string;
    taxableIncome: number;
    deductions: number;
    taxPaid: number;
  }>;
  totalTaxableIncome: number;
  totalTaxPaid: number;
}

export interface TaxCalculationResult {
  cit: {
    taxableIncome: number;
    rate: number;
    incentives: number;
    amount: number;
  };
}

export interface DictionaryVersion {
  id: string;
  version: number;
  versionNumber: number;
  status: 'ACTIVE' | 'ARCHIVED';
  isFrozen: boolean;
  createdAt: number;
  termsCount: number;
  comment?: string;
  dictionaryId?: string;
  previousVersionId?: string;
  data?: any;
  changes?: any;
  createdBy?: string;
  metadata?: any;
  type: string;
}

export interface DistributedTask {
  id: string;
  origin: string;
  targetModule: view_type;
  payload: any;
  priority: 'LOW' | 'NORMAL' | 'HIGH';
  timestamp: number;
  status: 'PENDING' | 'COMPLETED';
}

export interface EventBridgeRegistry {
  [eventType: string]: Function[];
}

export interface ReconciliationResult {
  date: string;
  localTransactions: any[];
  gatewayReports: any[];
  discrepancies: Discrepancy[];
  summary: {
    totalLocalAmount: number;
    totalGatewayAmount: number;
    totalDiscrepancies: number;
    highSeverityDiscrepancies: number;
  };
}

export interface Discrepancy {
  type: string;
  gateway: string;
  localTotal: number;
  gatewayTotal: number;
  difference: number;
  message: string;
  severity: 'HIGH' | 'MEDIUM';
}

export interface Transaction {
  id: string;
  amount: number;
  gateway: string;
  status: string;
}

export interface GatewayReport {
  gateway: string;
  totalAmount: number;
}

export interface TaxPolicy {
  standardRate: number;
  incentives: Record<string, number>;
}

export interface RiskPolicy {
  highValueThreshold: number;
  unidentifiedSourceThreshold: number;
}

export enum FinanceStatus {
  ISSUED = 'ISSUED',
  PAID = 'PAID'
}

export enum TrainingStatus {
  ASSIGNED = 'ASSIGNED',
  COMPLETED = 'COMPLETED'
}

export interface AuditStats {
  totalEvents: number;
  coverageRate: number;
  integrityScore: number;
  failedSeals: number;
  avgLatency: number;
}

export interface AuditGap {
  id: string;
  moduleId: string;
  methodName: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  detectedAt: number;
}

export interface AuditAlert {
  id: string;
  ruleName: string;
  severity: 'HIGH' | 'CRITICAL' | 'MEDIUM';
  message: string;
  timestamp: number;
  status: 'NEW' | 'ACKNOWLEDGED' | 'RESOLVED';
}

export interface RuntimeInput {
  tenantId: string;
  correlationId: string;
  traceId: string;
  spanId: string;
  domain: string;
  operation: string;
  userId: string;
  identity: {
    roles: string[];
    attributes: {
        department_id: string;
    };
  };
  payload: any;
}

export interface RuntimeOutput {
  tenantId: string;
  correlationId: string;
  ok: boolean;
  success: boolean;
  data?: any;
  error?: any;
  trace: string;
  metadata: {
    tenantId: string;
    processedAt: Date;
    processingMs: number;
    stateChanges: any[];
    eventsPublished: any[];
  };
}

export interface RuntimeState {
  status: 'booting' | 'active' | 'suspended' | 'terminated';
  lastTick: number;
  version: string;
}

export interface TraceContext {
  correlationId: string;
  spanId: string;
}

export interface Event {
  id: string;
  type: string;
  correlationId: string;
  tenantId: string;
  payload: any;
  occurredAt: Date;
  recordedAt: Date;
}

export interface StateChange {
  entityId: string;
  tenantId: string;
  entityType: string;
  fromState: string;
  toState: string;
  changedAt: Date;
  changedBy: string;
  causationId: string;
}

export interface RolePermissions {
  [ModuleID.PRODUCTION]: Permission[];
  [ModuleID.SALES]: Permission[];
  [ModuleID.FINANCE]: Permission[];
  [ModuleID.LEGAL]: Permission[];
  [ModuleID.HR]: Permission[];
  [ModuleID.REPORTING]: Permission[];
  [ModuleID.INVENTORY]: Permission[];
}

export interface AccountingMappingRule {
  id: string;
  name: string;
  description: string;
  source: { system: string; entity: string; eventType: string };
  sourceField: string;
  destination: { system: string; entity: string; accountType: string };
  destinationField: string;
  mappingType: 'DIRECT' | 'AGGREGATE' | 'SPLIT' | 'REALTIME' | 'CONDITIONAL';
  transformation: (value: any, context?: any) => any;
  autoPost: boolean;
  enabled: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SalesEvent {
  type: string;
  order?: any;
  timestamp: Date;
}

export interface RealTimeUpdate {
  id: string;
  type: string;
  timestamp: Date;
  data: any;
  source: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  processed: boolean;
}

export interface AuditChainHead {
  tenant_id: string;
  chain_id: string;
  last_sequence: number;
  last_hash: string;
  updated_at: number;
}

export interface IntegrityState {
  isValid: boolean;
  brokenAt?: string;
}

export interface ScannerState {
  id: string;
  current_status: 'OK' | 'TAMPERED';
  last_scan_time: number;
  last_scan_head: number;
  errors_found: number;
  is_locked_down: boolean;
}

export interface DLQEvent {
  id: string;
  event: EventEnvelope;
  error: string;
  retries: number;
  timestamp: number;
}

export interface EInvoiceItem {
  id: string;
  name: string;
  goldWeight: number;
  goldPrice: number;
  stonePrice: number;
  laborPrice: number;
  taxRate: number;
  totalBeforeTax: number;
}
