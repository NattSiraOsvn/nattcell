/**
 * NATT-OS — Inventory Cell
 * Value Object: Location Codes — Chi nhánh & Kho
 * Domain: Tâm Luxury
 *
 * Hệ thống mã vị trí cho 2 chi nhánh Hà Nội & HCM
 */

export interface BranchLocation {
  code: string;
  name: string;
  branch: 'HANOI' | 'HCMC';
  type: 'SHOWROOM' | 'VAULT' | 'WORKSHOP' | 'WAREHOUSE';
  description: string;
  /** Có phép trưng bày khách xem không */
  isCustomerFacing: boolean;
  /** Giới hạn số lượng item tối đa (0 = không giới hạn) */
  capacity: number;
}

/**
 * Danh sách vị trí Tâm Luxury
 */
export const LOCATIONS: Record<string, BranchLocation> = {
  // === HÀ NỘI ===
  'SR-HN': {
    code: 'SR-HN',
    name: 'Showroom Hà Nội',
    branch: 'HANOI',
    type: 'SHOWROOM',
    description: 'Showroom chính — trưng bày & bán hàng',
    isCustomerFacing: true,
    capacity: 500,
  },
  'VAULT-HN': {
    code: 'VAULT-HN',
    name: 'Két sắt Hà Nội',
    branch: 'HANOI',
    type: 'VAULT',
    description: 'Két an toàn — hàng giá trị cao, chờ trưng bày',
    isCustomerFacing: false,
    capacity: 200,
  },
  'WS-HN': {
    code: 'WS-HN',
    name: 'Xưởng Hà Nội',
    branch: 'HANOI',
    type: 'WORKSHOP',
    description: 'Xưởng sửa chữa, đánh bóng, khắc chữ',
    isCustomerFacing: false,
    capacity: 50,
  },

  // === HỒ CHÍ MINH ===
  'SR-HCM': {
    code: 'SR-HCM',
    name: 'Showroom Hồ Chí Minh',
    branch: 'HCMC',
    type: 'SHOWROOM',
    description: 'Showroom chính HCM — trưng bày & bán hàng',
    isCustomerFacing: true,
    capacity: 500,
  },
  'VAULT-HCM': {
    code: 'VAULT-HCM',
    name: 'Két sắt Hồ Chí Minh',
    branch: 'HCMC',
    type: 'VAULT',
    description: 'Két an toàn HCM — hàng giá trị cao',
    isCustomerFacing: false,
    capacity: 200,
  },
  'WS-HCM': {
    code: 'WS-HCM',
    name: 'Xưởng Hồ Chí Minh',
    branch: 'HCMC',
    type: 'WORKSHOP',
    description: 'Xưởng sửa chữa HCM',
    isCustomerFacing: false,
    capacity: 50,
  },

  // === KHO TRUNG TÂM ===
  'WH-CENTRAL': {
    code: 'WH-CENTRAL',
    name: 'Kho trung tâm',
    branch: 'HANOI',
    type: 'WAREHOUSE',
    description: 'Kho tổng — nhập hàng mới, chờ phân phối chi nhánh',
    isCustomerFacing: false,
    capacity: 0,  // Không giới hạn
  },
};

/**
 * Lấy danh sách vị trí theo chi nhánh
 */
export function getLocationsByBranch(branch: 'HANOI' | 'HCMC'): BranchLocation[] {
  return Object.values(LOCATIONS).filter(loc => loc.branch === branch);
}

/**
 * Kiểm tra mã vị trí có hợp lệ không
 */
export function isValidLocation(code: string): boolean {
  return code in LOCATIONS;
}

/**
 * Kiểm tra chuyển kho giữa 2 chi nhánh khác nhau (cần phê duyệt Gatekeeper)
 */
export function isCrossBranchTransfer(fromCode: string, toCode: string): boolean {
  const from = LOCATIONS[fromCode];
  const to = LOCATIONS[toCode];
  if (!from || !to) return false;
  return from.branch !== to.branch;
}
