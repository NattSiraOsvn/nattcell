#!/bin/bash
set -e

echo "=== NATT-OS TREE SYNC (SAFE, LOWER-CASE ONLY) ==="

# ---------- DATABASE ----------
mkdir -p database/schema
touch database/schema/approval.schema.sql
touch database/schema.sql

# ---------- SCRIPTS ----------
mkdir -p scripts
touch scripts/deploy-production.sh
touch scripts/emergency-rollback.sh

# ---------- SRC ROOT ----------
mkdir -p src

# ---------- APPS ----------
mkdir -p src/apps/{analytics-ingestion-service,finance-service,hr-service,sale-terminal,shared}

# analytics-ingestion-service
mkdir -p src/apps/analytics-ingestion-service/src/{application,domain/projections}
touch src/apps/analytics-ingestion-service/src/application/ingestion-pipeline.ts
touch src/apps/analytics-ingestion-service/src/domain/projections/saga-health.projection.ts

# finance-service
mkdir -p src/apps/finance-service/src/{application/handlers,application/pipeline,application/projections,application/sagas,application/usecases,domain,infrastructure/audit,infrastructure/messaging}

touch src/apps/finance-service/src/application/handlers/{invoice-issued.handler.ts,payment-failed.handler.ts,payment-succeeded.handler.ts}
touch src/apps/finance-service/src/application/pipeline/finance-event.pipeline.ts
touch src/apps/finance-service/src/application/projections/risk.projection.ts
touch src/apps/finance-service/src/application/sagas/{compensation.saga.ts,finance.saga.ts,payment.saga.ts}
touch src/apps/finance-service/src/application/usecases/create-invoice.usecase.ts
touch src/apps/finance-service/src/domain/{invoice.aggregate.ts,payment.aggregate.ts}
touch src/apps/finance-service/src/infrastructure/audit/audit-logger.ts
touch src/apps/finance-service/src/infrastructure/messaging/{dead-letter.handler.ts,retry.policy.ts}
touch src/apps/finance-service/src/{finance-production.base.ts,production.base.ts,readme.md}

# hr-service
mkdir -p src/apps/hr-service/src/application/handlers
touch src/apps/hr-service/src/application/handlers/{employee-created.handler.ts,training-assigned.handler.ts,training-completed.handler.ts}
touch src/apps/hr-service/src/production.base.ts

# sale-terminal
touch src/apps/sale-terminal/sale-terminal.tsx

# shared
touch src/apps/shared/{config.ts,health.ts,logger.ts}

# ---------- COMPONENTS ----------
mkdir -p src/components/{admin,analytics,approval,calibration,common,compliance,financial,gatekeeper,marketplace}

touch src/components/admin/audit-dashboard.tsx
touch src/components/analytics/governance-kpi-board.tsx
touch src/components/approval/approval-dashboard.tsx
touch src/components/calibration/calibration-wizard.tsx

touch src/components/common/{error-boundary.tsx,error-display.tsx,loading-spinner.tsx,luxury-button.tsx,natt-3d-icon.tsx,permission-guard.tsx}

touch src/components/compliance/{certification-manager.tsx,compliance-dashboard.tsx,policy-manager.tsx}
touch src/components/financial/financial-dashboard.tsx
touch src/components/gatekeeper/emergency-dashboard.tsx
touch src/components/marketplace/{marketplace-shelf.tsx,product-card-marketplace.tsx}

# ---------- CORE ----------
mkdir -p src/core/{dictionary/services,ingestion,processing/ai,production,runtime,signals}

touch src/core/dictionary/services/dictionary.service.ts
touch src/core/ingestion/ingestion.service.ts
touch src/core/processing/ai/ai-core.processor.ts
touch src/core/production/{production.base.ts,production-enforcer.ts}
touch src/core/runtime/natt-os.runtime.ts
touch src/core/signals/types.ts

touch src/core/{chaos-engine.ts,design-tokens.ts,idempotency.service.ts,outbox.service.ts,policy-engine.ts,runtime.ts,state-manager.ts,trace-manager.ts,ui-runtime.tsx}

# ---------- SERVICES ----------
mkdir -p src/services/{admin,analytics,approval,calibration,compliance,config,conflict,cost,decorators,haptic,hr,ingestion,mapping,monitoring,parser,physics,pricing,scoring,shared,staging,supplier}

touch src/services/admin/{admin.service.ts,audit-compliance.checker.ts,audit.interceptor.ts,audit.service.ts,rbac.service.ts}
touch src/services/analytics/{analytics.api.ts,analytics.service.ts}
touch src/services/pricing/{pricing-runtime.ts,rule-engine.ts}
touch src/services/shared/global-idempotency.enforcer.ts
touch src/services/warehouse.service.ts

# ---------- TYPES / UTILS ----------
mkdir -p src/types src/utils
touch src/types/{accounting.types.ts,enums.ts,interfaces.ts}
touch src/utils/{supplier-classifier.ts,supplier-import.helper.ts}

# ---------- ROOT ----------
touch src/{constants.tsx,index.tsx,super-dictionary.ts,types.ts}

echo "=== DONE: SAFE TREE SYNC COMPLETED ==="

