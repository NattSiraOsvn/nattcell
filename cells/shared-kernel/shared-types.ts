
import React from 'react';

/**
 * 🔐 NATT-OS UNIFIED TYPE SYSTEM
 * Location: cells/shared-kernel/shared-types.ts
 * Enforced by Anh Nat
 */

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
  monitoring = 'monitoring',
  showroom_v2 = 'showroom_v2'
}

export enum PersonaID { 
  THIEN = 'THIEN', 
  CAN = 'CAN', 
  KRIS = 'KRIS', 
  PHIEU = 'PHIEU',
  BANG = 'BANG'
}

export enum OrderStatus { 
  PENDING = 'PENDING', 
  ON_HOLD = 'ON_HOLD', 
  COMPLETED = 'COMPLETED',
  DRAFT = 'DRAFT'
}

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

/**
 * 🔱 SMARTLINK ENVELOPE v1.1
 * DNA Sovereign Edition
 */
export interface SmartLinkEnvelope<T = any> {
  envelope_version: "1.1";
  envelope_id: string;
  timestamp: string;
  owner: "ANH_NAT" | string; // DNA Identifier
  trace_id: string; // Root trace continuity
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

export interface StockStatus {
  total: number;
  available: number;
  reserved: number;
  lowStockThreshold: number;
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
