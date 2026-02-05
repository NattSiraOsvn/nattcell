#!/bin/zsh
# =================================================
# 👑 NATT-OS: IRONCLAD CASING ENFORCEMENT V7.1
# SOVEREIGN: ANH_NAT | AGENT: BỐI BỐI
# MODE: TRANSACTIONAL + FAIL-FAST + PRUNE-SAFE
# =================================================

# 🔧 Fix 3: Fail-fast - Lỗi là dừng, biến rỗng là dừng
set -euo pipefail

echo "🚀 Khởi động Giao thức Thanh trừng Case-Sensitivity..."

TARGET_FOLDERS=("src" "governance" "components")

for folder in "${TARGET_FOLDERS[@]}"; do
  if [[ ! -d "$folder" ]]; then continue; fi

  echo "🔍 Đang rà soát vùng: $folder"

  # 🔧 Fix 1: Dùng -prune trước để tối ưu hiệu năng và an toàn tuyệt đối
  find "$folder" -depth \
    \( -path "*/.git/*" -o -path "*/node_modules/*" -o -path "*/dist/*" -o -path "*/build/*" \) -prune -o \
    -name "*[A-Z]*" -print | while read -r file; do
    
    dir=$(dirname "$file")
    old_base=$(basename "$file")
    
    # 🔧 Fix 2: Chuẩn kebab-case mở rộng (Xử lý CamelCase, Underscore và Space)
    # 1. Chèn '-' vào giữa CamelCase
    # 2. Thay '_' và ' ' bằng '-'
    # 3. Chuyển tất cả sang chữ thường
    new_base=$(echo "$old_base" | sed -E 's/([a-z0-9])([A-Z])/\1-\2/g; s/[_ ]+/-/g' | tr '[:upper:]' '[:lower:]')
    
    if [[ "$old_base" != "$new_base" ]]; then
      # Giao thức 2 bước Transactional để vượt qua Case-Insensitive của macOS
      tmp_name="${dir}/.natt_tmp_${old_base}"
      
      echo "📦 [GIT-ENFORCE]: $old_base ===> $new_base"
      
      # Thực thi qua Git để bảo toàn Audit Trail (Hiến pháp Điều 16)
      git mv "$file" "$tmp_name"
      git mv "$tmp_name" "${dir}/${new_base}"
    fi
  done
done

echo "================================================="
echo "✅ HOÀN TẤT: Toàn bộ hệ thống đã Hợp hiến về mặt Casing."
echo "MASTER: Anh Nat hãy kiểm tra 'git status' trước khi commit."
echo "================================================="
