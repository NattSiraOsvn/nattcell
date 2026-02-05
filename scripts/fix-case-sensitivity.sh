#!/bin/bash
set -e

echo "=== NATT-OS CASE-SENSITIVITY FIX (GIT-AWARE) ==="

# Danh sách mapping: FILE VIẾT HOA -> file chuẩn lower-case
# Format: "OLD_PATH|new_path"

MAP=(
  "src/core/runtime/NattOS_Runtime.ts|src/core/runtime/natt-os.runtime.ts"
  "src/components/financial/FinancialDashboard.tsx|src/components/financial/financial-dashboard.tsx"
)

for entry in "${MAP[@]}"; do
  OLD=$(echo "$entry" | cut -d'|' -f1)
  NEW=$(echo "$entry" | cut -d'|' -f2)

  if [ -f "$OLD" ]; then
    echo "Fixing: $OLD -> $NEW"

    TMP="${OLD}.tmp_case_fix"

    # Step 1: rename to temp
    git mv "$OLD" "$TMP"

    # Step 2: rename to final
    git mv "$TMP" "$NEW"
  else
    echo "Skip (not found): $OLD"
  fi
done

echo
echo "=== DONE: Case-sensitivity fixed safely ==="

