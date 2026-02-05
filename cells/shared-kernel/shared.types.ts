import React from 'react';

/**
 * 🔐 NATT-OS UNIFIED TYPE SYSTEM
 * Location: cells/shared-kernel/shared.types.ts
 */

// 🛠️ Fixed: Expanded UserRole to match root types.ts for system-wide compatibility
export enum UserRole { 
  MASTER = 'MASTER', 
  ADMIN = 'ADMIN', 
  LEVEL_1 = 'LEVEL_1', 
  LEVEL_2 = 'LEVEL_2', 
  LEVEL_3 = 'LEVEL_3', 
  LEVEL_4 = 'LEVEL_4', 
  LEVEL_5 = 'LEVEL_5', 
  LEVEL_6 = 'LEVEL_6', 
  LEVEL_7 = 'LEVEL_7', 
  LEVEL_8 = 'LEVEL_8', 
  SIGNER = 'SIGNER', 
  APPROVER = 'APPROVER', 
  OPERATOR = 'OPERATOR' 
}

export enum ViewType { 
  dashboard = 'dashboard', 
  sales_terminal = 'sales_terminal', 
  warehouse = 'warehouse',
  chat = 'chat',
  command = 'command',
  sales_tax = 'sales_tax',
  monitoring = 'monitoring'
}

export enum PersonaID { 
  THIEN = 'THIEN', 
  CAN = 'CAN', 
  KRIS = 'KRIS', 
  PHIEU = 'PHIEU' 
}

export enum OrderStatus { 
  PENDING = 'PENDING', 
  ON_HOLD = 'ON_HOLD', 
  COMPLETED = 'COMPLETED'
}

// 🛠️ Fixed: Expanded Department to match root types.ts (added IT, WAREHOUSE)
export enum Department { 
  FINANCE = 'FINANCE', 
  SALES = 'SALES', 
  PRODUCTION = 'PRODUCTION', 
  HQ = 'HQ',
  IT = 'IT',
  WAREHOUSE = 'WAREHOUSE'
}

export enum PositionType {
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

export interface UserPosition {
  id: string;
  role: PositionType;
  department: Department;
  scope: string[];
}

export interface HUDMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  previousValue?: number;
  trend: { direction: 'UP' | 'DOWN' | 'STABLE'; percentage: number; isPositive: boolean; };
  icon: string;
  target?: number;
  performance?: string;
  department?: Department;
}

export interface SmartLinkEnvelope<T = any> {
  envelope_version: "1.0";
  envelope_id: string;
  timestamp: string;
  trace: {
    trace_id: string;
    causation_id: string | null;
    span_id: string;
  };
  intent: {
    action: string;
    domain: string;
  };
  payload: T;
}

export interface EventEnvelope<T = any> {
  event_name: string;
  event_version: string;
  event_id: string;
  occurred_at: string;
  producer: string;
  trace: { correlation_id: string; causation_id: string | null; trace_id: string; };
  tenant: { org_id: string; workspace_id: string; };
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

export interface Movement {
  id: string;
  itemId: string;
  from: string;
  to: string;
  qty: number;
  date: string;
  by: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  category: string;
}

export interface StockStatus {
  total: number;
  available: number;
  reserved: number;
  lowStockThreshold: number;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  type: string;
  manager: string;
  totalValue: number;
  itemCount: number;
  securityLevel: string;
  layout?: Array<{ id: string, x: number, y: number, z: number, label: string, occupied: boolean, type: string }>;
}

export enum WarehouseLocation {
  HCM_HEADQUARTER = 'HCM_HEADQUARTER',
  HANOI_BRANCH = 'HANOI_BRANCH',
  DA_NANG_BRANCH = 'DA_NANG_BRANCH'
}

export interface StockReservation {
  id: string;
  productId: string;
  quantity: number;
  expiresAt: number;
  status: 'RESERVED' | 'RELEASED' | 'COMMITTED';
}

export enum ConstitutionState {
  GENESIS = 'GENESIS',
  AWAKENING = 'AWAKENING',
  ENFORCED = 'ENFORCED',
  DEGRADED = 'DEGRADED',
  QUARANTINED = 'QUARANTINED',
  VIOLATING = 'VIOLATING',
  TERMINATED = 'TERMINATED'
}
