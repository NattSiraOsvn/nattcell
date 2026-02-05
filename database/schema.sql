
-- NATT-OS UNIFIED SCHEMA v5.0 (Hirono Reshape)

-- 1. FINANCE CLUSTER
CREATE SCHEMA IF NOT EXISTS finance;

CREATE TABLE finance.accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE
    balance DECIMAL(18, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE finance.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_id VARCHAR(50),
    account_id UUID REFERENCES finance.accounts(id),
    amount DECIMAL(18, 2) NOT NULL,
    type VARCHAR(10), -- DEBIT, CREDIT
    description TEXT,
    gateway VARCHAR(50), -- VNPAY, MOMO, BANK
    status VARCHAR(20), -- COMPLETED, PENDING, FAILED
    timestamp TIMESTAMP DEFAULT NOW(),
    hash VARCHAR(64) NOT NULL -- Blockchain Integrity Hash
);

CREATE TABLE finance.tax_calculations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period VARCHAR(20) NOT NULL,
    revenue_total DECIMAL(18, 2),
    tax_type VARCHAR(20), -- VAT, CIT, PIT
    amount_due DECIMAL(18, 2),
    status VARCHAR(20) DEFAULT 'DRAFT',
    sealed_by UUID,
    sealed_at TIMESTAMP
);

-- 2. HR CLUSTER
CREATE SCHEMA IF NOT EXISTS hr;

CREATE TABLE hr.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE hr.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_code VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    department_id UUID REFERENCES hr.departments(id),
    position_role VARCHAR(50) NOT NULL,
    base_salary DECIMAL(15, 2) NOT NULL,
    hire_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE'
);

CREATE TABLE hr.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES hr.employees(id),
    work_date DATE NOT NULL,
    check_in TIMESTAMP,
    check_out TIMESTAMP,
    total_hours DECIMAL(4, 2),
    status VARCHAR(50), -- PRESENT, LATE, ABSENT
    source VARCHAR(30) DEFAULT 'MANUAL', -- MANUAL, MACHINE, OMEGA_SYNC, HR_ADJUSTED
    audit_hash VARCHAR(64) NOT NULL
);

CREATE TABLE hr.compliance_docs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES hr.employees(id),
    doc_type VARCHAR(50), -- CONTRACT, KYC, NDA
    file_hash VARCHAR(64) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID,
    expiry_date DATE
);

-- 3. AUDIT TRAIL (GLOBAL)
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    user_id UUID,
    details JSONB,
    timestamp TIMESTAMP DEFAULT NOW(),
    hash VARCHAR(64) NOT NULL
);
