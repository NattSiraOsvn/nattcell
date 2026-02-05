
#!/bin/bash
set -e

echo "🧹 [BỐI BỐI] KÍCH HOẠT GIAO THỨC DỌN DẸP..."

# 1. DỌN DẸP ROOT (Xóa các thư mục nằm ngoài src/ nếu có do nhầm lẫn)
# Chỉ xóa nếu chúng tồn tại ở root (ngang hàng package.json)
if [ -d "components" ]; then
    echo "🗑️  Deleting root-level components/..."
    rm -rf components
fi

if [ -d "services" ]; then
    echo "🗑️  Deleting root-level services/..."
    rm -rf services
fi

if [ -f "types.ts" ]; then
    echo "🗑️  Deleting root-level types.ts..."
    rm types.ts
fi

# 2. CHUẨN HOÁ CELL (Enforce kebab-case/lowercase)
# Xóa các file PascalCase cũ trong Cell để tránh lỗi Case Sensitivity trên Linux
echo "🔧 NORMALIZING CELLS (Linux Case Sensitivity Fix)..."

# Sales Cell
if [ -f "src/cells/sales-cell/SalesService.ts" ]; then
    echo "🔥 Purging src/cells/sales-cell/SalesService.ts (Duplicate)"
    rm src/cells/sales-cell/SalesService.ts
fi

# Warehouse Cell
if [ -f "src/cells/warehouse-cell/WarehouseService.ts" ]; then
    echo "🔥 Purging src/cells/warehouse-cell/WarehouseService.ts (Duplicate)"
    rm src/cells/warehouse-cell/WarehouseService.ts
fi

# Showroom Cell (Nếu có)
if [ -f "src/cells/showroom-cell/ShowroomService.ts" ]; then
    rm src/cells/showroom-cell/ShowroomService.ts
fi

# HR Cell (Nếu có)
if [ -f "src/cells/hr-cell/HrService.ts" ]; then
    rm src/cells/hr-cell/HrService.ts
fi

echo "✅ CLEANUP COMPLETED. SYSTEM STRUCTURE STANDARDIZED."
echo "🔒 BLUEPRINT LOCKED."
