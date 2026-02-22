
import { 
    Department, DetailedPersonnel, 
    HRDepartment, HRPosition, HRAttendance, 
    PositionType, UserRole
} from '@/types';

/**
 * 🛡️ @RequirePermission Stub Decorator Simulation
 * Trong môi trường Frontend, Thiên mô phỏng ranh giới này để chuẩn bị cho Backend.
 */
function RequirePermission(permission: string) {
    return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            console.log(`[RBAC_GATE] Checking authorization for: ${permission}`);
            // Logic check quyền thực tế sẽ bind tại đây
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}

class HRService {
  private static instance: HRService;
  
  private employees: DetailedPersonnel[] = [
    { 
        id: 'e1', employeeCode: 'TL-M001', fullName: 'ADMIN NATT', email: 'natt@luxurytam.com', 
        position: { id: 'pos-1', role: PositionType.CFO, department: Department.ACCOUNTING, scope: ['ALL'] },
        role: UserRole.ADMIN,
        status: 'ACTIVE', baseSalary: 0, 
        startDate: '2020-01-01', kpiPoints: 999, tasksCompleted: 450, lastRating: 'ADMIN',
        bankAccountNo: '0071001234567',
        allowanceLunch: 0, allowancePosition: 0, actualWorkDays: 22,
        bio: 'Kiểm toán độc lập, Tổng tham mưu chiến lược.'
    },
    { 
        id: 'e2', employeeCode: 'TL-S007', fullName: 'LÊ TRỌNG KHÔI', email: 'khoi.lt@luxurytam.com', 
        position: { id: 'pos-2', role: PositionType.CONSULTANT, department: Department.SALES, scope: ['CLIENTS'] },
        role: UserRole.SALES_STAFF,
        status: 'ACTIVE', baseSalary: 15000000, 
        startDate: '2023-05-12', kpiPoints: 105, tasksCompleted: 120, lastRating: 'OPTIMAL',
        bankAccountNo: '1903001234567',
        allowanceLunch: 800000, allowancePosition: 1000000, actualWorkDays: 26,
        bio: 'Best Seller 2024.'
    }
  ];

  static getInstance() {
    if (!HRService.instance) HRService.instance = new HRService();
    return HRService.instance;
  }

  @RequirePermission('HR_EMPLOYEE_READ')
  async getEmployees(params?: any): Promise<{ data: DetailedPersonnel[], meta: any }> {
    let data = [...this.employees];
    if (params?.search) {
        const s = params.search.toLowerCase();
        data = data.filter(e => e.fullName.toLowerCase().includes(s) || e.employeeCode.toLowerCase().includes(s));
    }
    return { data, meta: { total: data.length } };
  }

  @RequirePermission('HR_ATTENDANCE_READ')
  async getAttendance(employeeId: string): Promise<HRAttendance[]> {
      const mockSources: Array<'MACHINE' | 'OMEGA_SYNC' | 'HR_ADJUSTED'> = ['MACHINE', 'OMEGA_SYNC', 'HR_ADJUSTED'];
      
      return Array.from({ length: 5 }).map((_, i) => ({
          id: `att-${i}`,
          employee_id: employeeId,
          date: `2026-01-0${i+1}`,
          checkIn: Date.now() - (i * 86400000),
          total_hours: 8,
          status: 'PRESENT',
          source: {
              type: mockSources[i % 3],
              deviceId: 'CAM-OMEGA-01',
              hash: `0x${Math.random().toString(16).slice(2, 40)}`,
              adjustedBy: i % 3 === 2 ? 'HR_MANAGER_01' : undefined
          }
      }));
  }

  async getDepartments(): Promise<HRDepartment[]> {
      return [
          { id: 'd1', code: 'HEADQUARTER', name: 'Ban Giám Đốc', is_active: true, description: 'Lõi chỉ huy' },
          { id: 'd2', code: 'ACCOUNTING', name: 'Phòng Tài Chính', is_active: true, description: 'Quản trị dòng tiền' },
          { id: 'd3', code: 'PRODUCTION', name: 'Khối Sản Xuất', is_active: true, description: 'Chế tác' }
      ];
  }

  async getPositions(): Promise<HRPosition[]> {
      return [
          { id: 'p1', code: 'CFO', title: 'Giám đốc Tài Chính', department_id: 'd2', is_active: true },
          { id: 'p2', code: 'PROD_DIR', title: 'Giám đốc Sản Xuất', department_id: 'd3', is_active: true }
      ];
  }
}

export const HRProvider = HRService.getInstance();
