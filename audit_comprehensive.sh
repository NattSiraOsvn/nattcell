#!/bin/bash
set -Eeuo pipefail

echo "=== KIM GATEKEEPER DIRECTIVE: FULL SYSTEM AUDIT SCAN ==="
echo "Timestamp: $(date '+%Y-%m-%d %H:%M:%S %z')"
echo ""

# Check if in project root
if [ ! -d "src" ]; then
    echo "❌ ERROR: 'src' directory not found. Current directory: $(pwd)"
    echo "   Looking for project root..."
    
    # Try to find project root by looking for package.json or src directory
    PROJECT_ROOT=$(find . -type f -name "package.json" 2>/dev/null | head -1 | xargs dirname 2>/dev/null || echo "")
    if [ -n "$PROJECT_ROOT" ]; then
        echo "   Found project root at: $PROJECT_ROOT"
        cd "$PROJECT_ROOT"
    else
        echo "   Cannot find project root. Please run from natt-os directory."
        exit 1
    fi
fi

# 1. BUSINESS CELLS GROUND TRUTH AUDIT
echo "=== PHASE 1: BUSINESS CELLS GROUND TRUTH ==="
echo ""

business_cells=("pricing-cell" "inventory-cell" "sales-cell" "order-cell" "buyback-cell" "warranty-cell" "customer-cell" "promotion-cell" "showroom-cell")
cell_count=0

for cell in "${business_cells[@]}"; do
    cell_path="src/cells/business/${cell}"
    if [ -d "$cell_path" ]; then
        # Count TS files safely
        ts_files=0
        while IFS= read -r -d '' file; do
            ((ts_files++))
        done < <(find "$cell_path" -name "*.ts" -type f -print0 2>/dev/null)
        
        # Count lines in TS files
        ts_lines=0
        if [ "$ts_files" -gt 0 ]; then
            ts_lines=$(find "$cell_path" -name "*.ts" -type f -exec cat {} \; 2>/dev/null | wc -l 2>/dev/null || echo "0")
        fi
        
        # Check for service file
        service_methods=0
        service_file="$cell_path/${cell}.service.ts"
        if [ -f "$service_file" ]; then
            service_methods=$(grep -c "async.*(" "$service_file" 2>/dev/null || echo "0")
        fi
        
        # Check integration imports
        kernel_imports=$(grep -r "cells/kernel" "$cell_path" --include="*.ts" 2>/dev/null | wc -l 2>/dev/null || echo "0")
        infra_imports=$(grep -r "cells/infrastructure" "$cell_path" --include="*.ts" 2>/dev/null | wc -l 2>/dev/null || echo "0")
        
        echo "📊 $cell:"
        echo "   📁 Files: $ts_files TS files"
        echo "   📝 Lines: $ts_lines total"
        echo "   ⚙️  Service methods: $service_methods"
        echo "   🔗 Imports - Kernel: $kernel_imports, Infra: $infra_imports"
        echo ""
        cell_count=$((cell_count + 1))
    else
        echo "❌ $cell: Directory missing!"
        echo ""
    fi
done

# 2. KERNEL BOUNDARY AUDIT
echo "=== PHASE 2: KERNEL BOUNDARY AUDIT ==="
echo ""

kernel_cells=("config-cell" "audit-cell" "rbac-cell" "security-cell" "monitor-cell")
boundary_violations=0

for cell in "${kernel_cells[@]}"; do
    cell_path="src/cells/kernel/${cell}"
    if [ -d "$cell_path" ]; then
        infra_imports=$(grep -r "cells/infrastructure" "$cell_path" --include="*.ts" 2>/dev/null | wc -l 2>/dev/null || echo "0")
        business_imports=$(grep -r "cells/business" "$cell_path" --include="*.ts" 2>/dev/null | wc -l 2>/dev/null || echo "0")
        
        if [ "$infra_imports" -gt 0 ] || [ "$business_imports" -gt 0 ]; then
            echo "⚠️  $cell: BOUNDARY VIOLATION DETECTED"
            echo "   Infra imports: $infra_imports"
            echo "   Business imports: $business_imports"
            boundary_violations=$((boundary_violations + 1))
        else
            echo "✅ $cell: Boundary clean"
        fi
    else
        echo "❌ $cell: Directory missing!"
    fi
done

echo ""
echo "Total kernel boundary violations: $boundary_violations"
echo ""

# 3. AUDIT PORT VERIFICATION
echo "=== PHASE 3: AUDIT PORT IMPLEMENTATION ==="
echo ""

audit_port_path="src/cells/kernel/audit-cell/ports/audit.port.ts"
if [ -f "$audit_port_path" ]; then
    echo "✅ AuditPort exists at: $audit_port_path"
    port_methods=$(grep -c "append\|query\|purge" "$audit_port_path" 2>/dev/null || echo "0")
    echo "   Methods defined: $port_methods"
    
    # Check if ConfigService uses AuditPort
    config_service="src/cells/kernel/config-cell/config.service.ts"
    if [ -f "$config_service" ]; then
        uses_auditport=$(grep -c "AuditPort" "$config_service" 2>/dev/null || echo "0")
        uses_auditservice=$(grep -c "AuditService" "$config_service" 2>/dev/null || echo "0")
        
        echo "   ConfigService AuditPort usage: $uses_auditport"
        echo "   ConfigService AuditService usage: $uses_auditservice"
        
        if [ "$uses_auditservice" -gt 0 ]; then
            echo "   ⚠️  ConfigService still uses AuditService!"
        fi
    fi
else
    echo "❌ AuditPort missing!"
fi

echo ""

# 4. WAVE 3 ROADMAP PROGRESS AUDIT
echo "=== PHASE 4: WAVE 3 ROADMAP PROGRESS ==="
echo ""

echo "Milestone 1: pricing + inventory"
pricing_cell="src/cells/business/pricing-cell"
inventory_cell="src/cells/business/inventory-cell"

pricing_formulas=0
if [ -d "$pricing_cell" ]; then
    pricing_formulas=$(grep -r "calculate\|formula\|markup" "$pricing_cell" --include="*.ts" 2>/dev/null | grep -v "test" 2>/dev/null | wc -l 2>/dev/null || echo "0")
fi
echo "   pricing-cell formulas: $pricing_formulas"

inventory_flows=0
if [ -d "$inventory_cell" ]; then
    inventory_flows=$(grep -r "RAW\|WIP\|FINISHED\|transfer" "$inventory_cell" --include="*.ts" 2>/dev/null | wc -l 2>/dev/null || echo "0")
fi
echo "   inventory-cell flows: $inventory_flows"

echo ""
echo "Milestone 2: sales + order"
sales_cell="src/cells/business/sales-cell"
order_cell="src/cells/business/order-cell"

sales_integration=0
if [ -d "$sales_cell" ]; then
    sales_integration=$(grep -r "pricing\|inventory" "$sales_cell" --include="*.ts" 2>/dev/null | wc -l 2>/dev/null || echo "0")
fi
echo "   sales-cell integrations: $sales_integration"

order_states=0
if [ -d "$order_cell" ]; then
    order_states=$(grep -r "state\|transition\|pending\|completed" "$order_cell" --include="*.ts" 2>/dev/null | wc -l 2>/dev/null || echo "0")
fi
echo "   order-cell states: $order_states"

echo ""
echo "Milestone 3: buyback"
buyback_cell="src/cells/business/buyback-cell"
buyback_rates=0
if [ -d "$buyback_cell" ]; then
    buyback_rates=$(grep -r "95\|90\|85\|75\|rate\|return" "$buyback_cell" --include="*.ts" 2>/dev/null | wc -l 2>/dev/null || echo "0")
fi
echo "   buyback-cell rates: $buyback_rates"

echo ""

# 5. FILESYSTEM STRUCTURE VALIDATION
echo "=== PHASE 5: FILESYSTEM STRUCTURE VALIDATION ==="
echo ""

expected_structure=(
    "src/cells/kernel/config-cell/config.service.ts"
    "src/cells/kernel/audit-cell/ports/audit.port.ts"
    "src/cells/kernel/rbac-cell/rbac.service.ts"
    "src/governance/constitution/v9.2.1.json"
)

missing_files=0
for file in "${expected_structure[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - MISSING"
        missing_files=$((missing_files + 1))
    fi
done

echo ""
echo "=== AUDIT SUMMARY ==="
echo "Current directory: $(pwd)"
echo "Total business cells scanned: $cell_count/${#business_cells[@]}"
echo "Total kernel cells: ${#kernel_cells[@]}"
echo "Kernel boundary violations: $boundary_violations"
echo "Missing critical files: $missing_files"
echo ""
echo "=== RECOMMENDATIONS ==="
echo "1. Priority: Complete inventory-cell production flow"
echo "2. Priority: Integrate sales-cell with pricing-cell"
echo "3. Priority: Add production workflow to order-cell"
echo "4. Governance: Run phase1 scanner after infra adapter completion"
echo ""
echo "=== GROUND TRUTH VERIFIED: $(date '+%Y-%m-%d %H:%M:%S') ==="
