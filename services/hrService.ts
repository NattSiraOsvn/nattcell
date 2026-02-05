
import { 
    DetailedPersonnel, HRDepartment, HRPosition, HRAttendance, 
    PositionType, UserRole
} from '../types';

class HRService {
  private static instance: HRService;
  private employees: DetailedPersonnel[] = []; // Đã dọn dẹp rác Hardcoded

  static getInstance() {
    if (!HRService.instance) HRService.instance = new HRService();
    return HRService.instance;
  }

  async getEmployees(params?: any): Promise<{ data: DetailedPersonnel[], meta: any }> {
    let data = [...this.employees];
    if (params?.search) {
        const s = params.search.toLowerCase();
        data = data.filter(e => e.fullName.toLowerCase().includes(s) || e.employeeCode.toLowerCase().includes(s));
    }
    return { data, meta: { total: data.length } };
  }

  async getAttendance(employeeId: string): Promise<HRAttendance[]> {
      return []; // Kết nối Shard Chấm công thực tế tại Giai đoạn 3
  }

  async getDepartments(): Promise<HRDepartment[]> {
      return [
          { id: 'd1', code: 'HQ', name: 'Ban Giám Đốc', is_active: true, description: 'Lõi chỉ huy' },
          { id: 'd2', code: 'FINANCE', name: 'Phòng Tài Chính', is_active: true, description: 'Quản trị dòng tiền' },
          { id: 'd3', code: 'PRODUCTION', name: 'Khối Sản Xuất', is_active: true, description: 'Chế tác' }
      ];
  }

  async getPositions(): Promise<HRPosition[]> {
      return []; // Sẽ được bóc tách từ SuperDictionary
  }
}

export const HRProvider = HRService.getInstance();
