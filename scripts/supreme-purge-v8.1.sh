#!/bin/zsh
# =================================================
# 👑 NATT-OS: SUPREME-PURGE V8.1 (CONSTITUTIONAL)
# SOVEREIGN: ANH_NAT
# AGENT: BỐI BỐI (APPROVED)
# MODE: TRANSACTIONAL | FAIL-FAST | AUDIT-SAFE
# =================================================

set -euo pipefail

echo "🔥 NATT-OS SUPREME-PURGE V8.1 – CONSTITUTIONAL MODE"
echo "-------------------------------------------------"

# 0) Dọn mảnh tạm còn sót (an toàn, không đụng git)
echo "🧹 Cleaning leftover tmp fragments (.natt_tmp_*)..."
find . -name ".natt_tmp_*" -type f -delete || true

TARGET_FOLDERS=("src" "governance" "components")

# Hàm chuyển sang kebab-case chuẩn
to_kebab() {
  echo "$1" | sed -E 's/([a-z0-9])([A-Z])/\1-\2/g; s/[_ ]+/-/g' | tr '[:upper:]' '[:lower:]'
}

for folder in "${TARGET_FOLDERS[@]}"; do
  [[ -d "$folder" ]] || continue
  echo "🔍 Scanning zone: $folder"

  find "$folder" -depth \
    \( -path "*/.git/*" -o -path "*/node_modules/*" -o -path "*/dist/*" -o -path "*/build/*" \) -prune -o \
    -name "*[A-Z]*" -print | \
  while read -r file; do
    dir="$(dirname "$file")"
    old_base="$(basename "$file")"
    new_base="$(to_kebab "$old_base")"
    new_file="${dir}/${new_base}"

    # Không đổi nếu đã đúng
    [[ "$old_base" == "$new_base" ]] && continue

    # 1) COLLISION DETECTION – TUYỆT ĐỐI KHÔNG XOÁ
    if [[ -e "$new_file" ]]; then
      echo "⛔ [COLLISION-HALT]"
      echo "    Source : $file"
      echo "    Target : $new_file"
      echo "    Action : MANUAL DECISION REQUIRED (script halted)"
      echo "-------------------------------------------------"
      exit 1
    fi

    # 2) RENAME TRANSACTIONAL 2-STEP (macOS-safe)
    tmp_name="${dir}/.natt_tmp_${old_base}"

    echo "📦 [GIT-RENAME]: $old_base  →  $new_base"
    git mv "$file" "$tmp_name"
    git mv "$tmp_name" "$new_file"
  done
done

# 3) BOUNDARY CHECK – KHÔNG DI TRÚ TỰ ĐỘNG
# (Điều 7: migration phải có phán quyết)
if [[ -d "components" ]]; then
  echo "⚠️  [BOUNDARY-NOTICE]: 'components/' root detected."
  echo "    No auto-migration performed."
  echo "    Review & migrate manually into 'src/components/' if needed."
fi

echo "================================================="
echo "✅ SUPREME-PURGE V8.1 COMPLETED (NO VIOLATIONS)"
echo "NEXT:"
echo "  1) git status"
echo "  2) npm run build"
echo "  3) git commit -m \"chore(fs): supreme-purge v8.1 (constitutional)\""
echo "================================================="

