
-- ============================================================
-- ARTEFACT 2: DB MIGRATION SPEC
-- Owner: TEAM 4 (Băng)
-- Database: PostgreSQL 15+
-- Status: ENFORCED
-- ============================================================

BEGIN;

-- ============================================================
-- TABLE 1: audit_log (Main Merkle Chain)
-- Fix 1: Multi-tenant + Multi-chain Sequence
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_log (
    id                  BIGSERIAL PRIMARY KEY,
    record_id           VARCHAR(32) NOT NULL, -- Metadata only
    tenant_id           VARCHAR(64) NOT NULL, -- Fix 1
    chain_id            VARCHAR(64) NOT NULL, -- Fix 1
    sequence_number     BIGINT NOT NULL,
    
    timestamp           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    event_type          VARCHAR(64) NOT NULL,
    actor               JSONB NOT NULL, -- Stored as JSONB
    
    payload             JSONB NOT NULL DEFAULT '{}',
    payload_hash        CHAR(64) NOT NULL,
    
    prev_hash           CHAR(64) NOT NULL,
    entry_hash          CHAR(64) NOT NULL,
    
    metadata            JSONB,
    
    CONSTRAINT uq_audit_record_id UNIQUE (record_id),
    -- Fix 1: Unique sequence per chain per tenant
    CONSTRAINT uq_audit_sequence UNIQUE (tenant_id, chain_id, sequence_number),
    CONSTRAINT uq_audit_entry_hash UNIQUE (entry_hash)
);

-- ============================================================
-- TABLE 2: audit_chain_head (Head Pointer)
-- Fix 4: No ORDER BY DESC LIMIT 1
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_chain_head (
    tenant_id           VARCHAR(64) NOT NULL,
    chain_id            VARCHAR(64) NOT NULL,
    last_sequence       BIGINT NOT NULL DEFAULT 0,
    last_hash           CHAR(64) NOT NULL DEFAULT '0000000000000000000000000000000000000000000000000000000000000000', -- GENESIS
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    PRIMARY KEY (tenant_id, chain_id)
);

-- ============================================================
-- TABLE 3: audit_scanner_state (Persistence)
-- Fix 5: State persisted in DB
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_scanner_state (
    id                  VARCHAR(64) PRIMARY KEY, -- Singleton ID e.g. 'MAIN_SCANNER'
    current_status      VARCHAR(16) NOT NULL DEFAULT 'OK',
    last_scan_time      TIMESTAMPTZ,
    last_scan_head      BIGINT,
    errors_found        INT DEFAULT 0,
    is_locked_down      BOOLEAN DEFAULT FALSE
);

-- Indexing
CREATE INDEX IF NOT EXISTS idx_audit_lookup ON audit_log (tenant_id, chain_id, sequence_number);

COMMIT;
