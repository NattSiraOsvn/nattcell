#!/bin/zsh
set -euo pipefail

echo "⚖️ NATT-OS FINAL CASING ROUND – CONSTITUTIONAL SAFE MODE"

TARGETS=("src/components" "src/hooks" "src/services")

for base in "${TARGETS[@]}"; do
  [ -d "$base" ] || continue

  find "$base" -depth \
    \( -path "*/node_modules/*" -o -path "*/dist/*" -o -path "*/build/*" \) -prune -o \
    -name "*[A-Z]*" -print | while read -r file; do

      # Skip governance cores explicitly
      case "$file" in
        *GatekeeperCore.ts|*RBACCore.ts) continue ;;
      esac

      dir=$(dirname "$file")
      old=$(basename "$file")
      new=$(echo "$old" \
        | sed -E 's/([a-z0-9])([A-Z])/\1-\2/g; s/[_ ]+/-/g' \
        | tr '[:upper:]' '[:lower:]')

      [ "$old" = "$new" ] && continue

      tmp="$dir/.natt_tmp_$old"

      if [ -e "$dir/$new" ]; then
        echo "🧹 COLLISION → removing legacy $old"
        git rm -f "$file"
      else
        echo "🔁 $old → $new"
        git mv "$file" "$tmp"
        git mv "$tmp" "$dir/$new"
      fi
  done
done

echo "✅ FINAL CASING ROUND COMPLETED"
