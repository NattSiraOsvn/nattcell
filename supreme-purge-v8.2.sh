#!/usr/bin/env bash
set -euo pipefail

############################################
# 🔥 NATT-OS SUPREME-PURGE V8.2 (macOS SAFE)
# CONSTITUTIONAL MODE – AUTO COLLISION RESOLVE
############################################

LEGACY_DIR=".natt_legacy"
REPORT_FILE="collision-report.json"
TMP_LIST=".natt_tmp_filelist.txt"
TMP_GROUP=".natt_tmp_group.txt"

echo "🔥 NATT-OS SUPREME-PURGE V8.2 – CONSTITUTIONAL MODE (macOS)"
echo "-------------------------------------------------"

############################################
# 0. Prepare
############################################
mkdir -p "$LEGACY_DIR"
echo "[]" > "$REPORT_FILE"
rm -f "$TMP_LIST" "$TMP_GROUP"

############################################
# 1. Clean leftover tmp fragments
############################################
echo "🧹 Cleaning leftover tmp fragments (.natt_tmp_*)..."
find . -name ".natt_tmp_*" -type f -delete || true

############################################
# 2. Helpers
############################################
to_kebab() {
  echo "$1" \
    | sed -E 's/([a-z0-9])([A-Z])/\1-\2/g' \
    | sed -E 's/[_ ]+/-/g' \
    | tr '[:upper:]' '[:lower:]'
}

log_collision() {
  local src="$1"
  local kept="$2"
  local archived="$3"

  tmp=$(mktemp)
  jq --arg src "$src" \
     --arg kept "$kept" \
     --arg archived "$archived" \
     '. += [{
        "source": $src,
        "kept": $kept,
        "archived": $archived,
        "policy": "kebab-case-canonical"
     }]' "$REPORT_FILE" > "$tmp"
  mv "$tmp" "$REPORT_FILE"
}

############################################
# 3. Build lowercase index
############################################
echo "🔍 Scanning zone: src"

find src -type f | while read -r f; do
  echo "$(echo "$f" | tr '[:upper:]' '[:lower:]')|$f" >> "$TMP_LIST"
done

############################################
# 4. Detect collisions
############################################
cut -d'|' -f1 "$TMP_LIST" | sort | uniq -d > "$TMP_GROUP"

while read -r key; do
  echo "⚠️  COLLISION detected for: $key"

  files=$(grep "^$key|" "$TMP_LIST" | cut -d'|' -f2)
  canonical=""

  for f in $files; do
    base="$(basename "$f")"
    if [ "$(to_kebab "$base")" = "$base" ]; then
      canonical="$f"
      break
    fi
  done

  if [ -z "$canonical" ]; then
    first=$(echo "$files" | head -n1)
    dir="$(dirname "$first")"
    base="$(basename "$first")"
    newbase="$(to_kebab "$base")"
    canonical="$dir/$newbase"

    echo "🔁 Renaming to canonical: $first → $canonical"
    mv "$first" "$canonical"
  fi

  for f in $files; do
    if [ "$f" != "$canonical" ] && [ -f "$f" ]; then
      target="$LEGACY_DIR/$f"
      echo "📦 Archiving legacy: $f → $target"
      mkdir -p "$(dirname "$target")"
      mv "$f" "$target"
      log_collision "$f" "$canonical" "$target"
    fi
  done

  echo "✅ RESOLVED → kept: $canonical"
  echo "-------------------------------------------------"
done < "$TMP_GROUP"

############################################
# 5. Cleanup
############################################
rm -f "$TMP_LIST" "$TMP_GROUP"

echo "📄 Collision report saved to: $REPORT_FILE"
echo "📦 Legacy files archived in: $LEGACY_DIR"
echo "✅ SUPREME-PURGE V8.2 COMPLETED"

