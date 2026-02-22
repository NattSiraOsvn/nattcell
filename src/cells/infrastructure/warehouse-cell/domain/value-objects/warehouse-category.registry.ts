/**
 * NATT-OS — Warehouse Cell
 * Value Object: WarehouseCategoryRegistry
 * Giao thức kho mở — người dùng tự thêm hạng mục
 *
 * Pattern: Open Registry — không hardcode enum,
 * seed defaults từ thực tế Tâm Luxury, mở rộng qua register()
 */

// ═══ TYPES ═══

export type WarehouseUnit =
  | 'GR' | 'KG'           // Khối lượng — vàng, hóa chất
  | 'VIEN'                // Viên — đá, kim cương rời
  | 'CAI' | 'BO'          // Đếm đơn/bộ
  | 'MUI'                 // Mũi khoan
  | 'CAN' | 'CHAI' | 'LIT' // Lỏng — hóa chất
  | 'BICH' | 'TAM'        // Gói/tấm
  | 'CAY' | 'MIENG' | 'CON' // Cây/miếng/con
  | 'CUSTOM';             // Đơn vị tự định nghĩa

export type WarehouseLocation =
  | 'KHO_MUI'
  | 'KHO_HOP'
  | 'KHO_HOA_CHAT'
  | 'KHO_VAT_TU'
  | 'KHO_NGUYEN_LIEU'     // Vàng thỏi, kim cương rời
  | 'KHO_BAN_THANH_PHAM'  // Vỏ chưa gắn đá
  | 'KHO_KHAC';           // Kho tùy chỉnh

export interface CategoryDefinition {
  code: string;                      // Mã danh mục — unique key
  name: string;                      // Tên hiển thị
  description?: string;
  defaultUnit: WarehouseUnit;        // ĐVT mặc định
  defaultLocation: WarehouseLocation; // Vị trí kho mặc định
  requiresInsurance: boolean;        // Cần bảo hiểm? (vàng, kim cương)
  isConsumable: boolean;             // Tiêu hao (hóa chất, vật tư) hay tài sản cố định (máy móc)
  minStockAlert?: number;            // Cảnh báo tồn kho tối thiểu
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
}

export interface RegisterCategoryCommand {
  code: string;
  name: string;
  description?: string;
  defaultUnit: WarehouseUnit;
  defaultLocation: WarehouseLocation;
  requiresInsurance?: boolean;
  isConsumable?: boolean;
  minStockAlert?: number;
  createdBy: string;
}

// ═══ SEED DEFAULTS — Từ thực tế Sổ Kho Tâm Luxury ═══

export const DEFAULT_CATEGORIES: RegisterCategoryCommand[] = [
  {
    code: 'CONG_CU_CO_DINH',
    name: 'Công cụ cố định',
    description: 'Máy strong, máy treo, kính hiển vi, thước đo — tài sản giao theo người',
    defaultUnit: 'CAI',
    defaultLocation: 'KHO_VAT_TU',
    requiresInsurance: false,
    isConsumable: false,
    minStockAlert: 1,
    createdBy: 'SYSTEM',
  },
  {
    code: 'CONG_CU_TIEU_HAO',
    name: 'Công cụ tiêu hao',
    description: 'Mũi khoan, đĩa xoàn, kềm, dũa Thụy Sĩ — mòn theo sử dụng',
    defaultUnit: 'MUI',
    defaultLocation: 'KHO_MUI',
    requiresInsurance: false,
    isConsumable: true,
    minStockAlert: 10,
    createdBy: 'SYSTEM',
  },
  {
    code: 'VAT_TU_SAN_XUAT',
    name: 'Vật tư sản xuất',
    description: 'Thạch cao, thuốc hàn, láp đúc, mẻ đất — dùng trong gia công',
    defaultUnit: 'CAI',
    defaultLocation: 'KHO_VAT_TU',
    requiresInsurance: false,
    isConsumable: true,
    minStockAlert: 5,
    createdBy: 'SYSTEM',
  },
  {
    code: 'HOA_CHAT',
    name: 'Hóa chất',
    description: 'Axit đen, nước cất, bột run, metalor RH, resin, bột siêu âm',
    defaultUnit: 'LIT',
    defaultLocation: 'KHO_HOA_CHAT',
    requiresInsurance: false,
    isConsumable: true,
    minStockAlert: 2,
    createdBy: 'SYSTEM',
  },
  {
    code: 'HOP_DONG_GOI',
    name: 'Hộp đóng gói sản phẩm',
    description: 'Hộp nhẫn mới/cũ, hộp vòng, hộp lắc, hộp mặt dây, hộp bộ Tâm',
    defaultUnit: 'CAI',
    defaultLocation: 'KHO_HOP',
    requiresInsurance: false,
    isConsumable: true,
    minStockAlert: 50,
    createdBy: 'SYSTEM',
  },
  {
    code: 'BAO_BI_DONG_GOI',
    name: 'Bao bì đóng gói',
    description: 'Túi zip các cỡ, túi giấy, bìa da cá sấu, ribbon, xâu nịt nhựa',
    defaultUnit: 'CAI',
    defaultLocation: 'KHO_HOP',
    requiresInsurance: false,
    isConsumable: true,
    minStockAlert: 100,
    createdBy: 'SYSTEM',
  },
  {
    code: 'VAN_PHONG_PHAM',
    name: 'Văn phòng phẩm & thiết bị',
    description: 'Thẻ nhớ, chuột máy tính, bìa lò xo, áo thun đồng phục',
    defaultUnit: 'CAI',
    defaultLocation: 'KHO_VAT_TU',
    requiresInsurance: false,
    isConsumable: false,
    createdBy: 'SYSTEM',
  },
  {
    code: 'NGUYEN_LIEU_QUY',
    name: 'Nguyên liệu quý',
    description: 'Vàng thỏi, vàng nhẫn SBJ, kim tấm, viên chủ, đá phụ rời',
    defaultUnit: 'GR',
    defaultLocation: 'KHO_NGUYEN_LIEU',
    requiresInsurance: true,   // ← BẮT BUỘC bảo hiểm
    isConsumable: true,
    minStockAlert: 100,        // gram
    createdBy: 'SYSTEM',
  },
  {
    code: 'BAN_THANH_PHAM',
    name: 'Bán thành phẩm',
    description: 'Vỏ nhẫn chưa gắn đá, dây chuyền chưa gắn mặt, WIP',
    defaultUnit: 'CAI',
    defaultLocation: 'KHO_BAN_THANH_PHAM',
    requiresInsurance: false,
    isConsumable: false,
    minStockAlert: 5,
    createdBy: 'SYSTEM',
  },
];

// ═══ REGISTRY ═══

export class WarehouseCategoryRegistry {
  private categories: Map<string, CategoryDefinition> = new Map();

  constructor() {
    // Seed defaults khi khởi tạo
    for (const cmd of DEFAULT_CATEGORIES) {
      this._registerInternal(cmd);
    }
  }

  // ─── Register ───

  register(cmd: RegisterCategoryCommand): { success: boolean; error?: string } {
    const code = cmd.code.toUpperCase().trim();
    if (!code) return { success: false, error: 'Mã danh mục không được để trống' };
    if (this.categories.has(code)) return { success: false, error: `Mã ${code} đã tồn tại` };
    if (!cmd.name?.trim()) return { success: false, error: 'Tên danh mục không được để trống' };

    this._registerInternal({ ...cmd, code });
    return { success: true };
  }

  private _registerInternal(cmd: RegisterCategoryCommand): void {
    const def: CategoryDefinition = {
      code: cmd.code.toUpperCase(),
      name: cmd.name,
      description: cmd.description,
      defaultUnit: cmd.defaultUnit,
      defaultLocation: cmd.defaultLocation,
      requiresInsurance: cmd.requiresInsurance ?? false,
      isConsumable: cmd.isConsumable ?? true,
      minStockAlert: cmd.minStockAlert,
      isActive: true,
      createdAt: new Date(),
      createdBy: cmd.createdBy,
    };
    this.categories.set(def.code, def);
  }

  // ─── Update ───

  deactivate(code: string): boolean {
    const cat = this.categories.get(code.toUpperCase());
    if (!cat) return false;
    this.categories.set(code.toUpperCase(), { ...cat, isActive: false });
    return true;
  }

  updateMinStock(code: string, minStock: number): boolean {
    const cat = this.categories.get(code.toUpperCase());
    if (!cat) return false;
    this.categories.set(code.toUpperCase(), { ...cat, minStockAlert: minStock });
    return true;
  }

  // ─── Queries ───

  findByCode(code: string): CategoryDefinition | null {
    return this.categories.get(code.toUpperCase()) ?? null;
  }

  getAll(): CategoryDefinition[] {
    return Array.from(this.categories.values());
  }

  getActive(): CategoryDefinition[] {
    return this.getAll().filter(c => c.isActive);
  }

  getInsuranceRequired(): CategoryDefinition[] {
    return this.getActive().filter(c => c.requiresInsurance);
  }

  exists(code: string): boolean {
    return this.categories.has(code.toUpperCase());
  }
}

// Singleton — dùng chung toàn cell
export const WAREHOUSECategoryRegistry = new WarehouseCategoryRegistry();
