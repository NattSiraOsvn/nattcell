
-- ============================================================
-- PHASE 2: FISCAL WORKBENCH SCHEMA
-- Status: ENFORCED
-- ============================================================

BEGIN;

-- 1. FUNCTION: LOCKDOWN GUARD (FIX 5)
-- Chặn mọi thao tác ghi nếu hệ thống đang bị khóa bởi IntegrityScanner
CREATE OR REPLACE FUNCTION fn_fiscal_lockdown_guard()
RETURNS TRIGGER AS $$
DECLARE
    is_locked BOOLEAN;
BEGIN
    -- Check status form Phase 1 Audit Scanner
    SELECT is_locked_down INTO is_locked 
    FROM audit_scanner_state 
    WHERE id = 'MAIN_SCANNER';

    IF is_locked THEN
        RAISE EXCEPTION 'OMEGA LOCKDOWN ACTIVE: Fiscal operations are suspended due to integrity breach.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. TABLE: fiscal_projections
CREATE TABLE IF NOT EXISTS fiscal_projections (
    id BIGSERIAL PRIMARY KEY,
    projection_id VARCHAR(32) NOT NULL UNIQUE,
    tenant_id VARCHAR(32) NOT NULL,
    order_id VARCHAR(32) NOT NULL,
    
    -- Stored as JSONB but enforced via App Logic to be String-Decimal
    data_payload JSONB NOT NULL, 
    
    diff_guard_status VARCHAR(10) CHECK (diff_guard_status = 'PASS'),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger Lockdown Check
CREATE TRIGGER trg_fiscal_proj_lockdown
    BEFORE INSERT OR UPDATE ON fiscal_projections
    FOR EACH ROW EXECUTE FUNCTION fn_fiscal_lockdown_guard();

-- 3. TABLE: fiscal_invoices
CREATE TABLE IF NOT EXISTS fiscal_invoices (
    id BIGSERIAL PRIMARY KEY,
    invoice_id VARCHAR(32) NOT NULL UNIQUE,
    
    -- FIX 4: Tách Series và Sequence đúng chuẩn TCT
    invoice_serial VARCHAR(10) NOT NULL, -- 1C25TLL
    invoice_sequence VARCHAR(10) NOT NULL, -- 00000001
    
    projection_ref VARCHAR(32) REFERENCES fiscal_projections(projection_id),
    
    -- XML & Hash
    xml_content TEXT NOT NULL,
    xml_hash CHAR(64) NOT NULL, -- Hash of C14N
    canonical_method VARCHAR(10) DEFAULT 'C14N11',
    
    -- Status
    status VARCHAR(20) DEFAULT 'DRAFT',
    
    -- Signature
    signature_value TEXT,
    signed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraint: Sequence unique per Serial within Tenant
    UNIQUE (invoice_serial, invoice_sequence)
);

-- Trigger Lockdown Check
CREATE TRIGGER trg_fiscal_inv_lockdown
    BEFORE INSERT OR UPDATE ON fiscal_invoices
    FOR EACH ROW EXECUTE FUNCTION fn_fiscal_lockdown_guard();

-- 4. TABLE: fiscal_idempotency
-- Separate store for Fiscal specific idempotency
CREATE TABLE IF NOT EXISTS fiscal_idempotency (
    key_hash CHAR(64) PRIMARY KEY,
    action_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMIT;
