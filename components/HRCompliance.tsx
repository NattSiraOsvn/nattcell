
import React, { useState, useEffect, useMemo } from 'react';
import { HREngine } from '../services/hrEngine';
import { PersonnelEngine } from '../services/personnelEngine';
// 🛠️ Fixed: Import casing for Types
import { EmployeePayroll, SalaryRule, BusinessMetrics, UserPosition, PositionType } from '../types';

interface HRComplianceProps {
  logAction?: (action: string, details: string, undoData?: any) => void;
  onBack?: () => void;
  metrics?: BusinessMetrics;
  updateFinance?: (data: Partial<BusinessMetrics>) => void;
}

const HRCompliance: React.FC<HRComplianceProps> = () => {
  const [activeTab, setActiveTab] = useState<'payroll' | 'seniority' | 'rules'>('payroll');
  
  const [employees, setEmployees] = useState<EmployeePayroll[]>([
    { id: 'TL-PRO-001', name: 'Nguyễn Văn Vẹn', employeeCode: 'TL-W045', division: 'Khối Sản Xuất', department: 'Phòng Nguội', role: 'Thợ Nguội', startDate: '2020-05-15', baseSalary: 15000000, actualWorkDays: 26, allowanceLunch: 800000, dependents: 0, insuranceSalary: 5000000 },
    { id: 'TL-PRO-002', name: 'Bùi Cao Sơn', employeeCode: 'TL-W001', division: 'Khối Sản Xuất', department: 'Phòng Chính', role: 'Thợ Chính', startDate: '2018-10-01', baseSalary: 22000000, actualWorkDays: 25, allowanceLunch: 800000, dependents: 2, insuranceSalary: 5000000 }
  ]);

  const [salaryRules] = useState<SalaryRule[]>([
    { division: 'Khối Sản Xuất', role: 'Thợ Nguội', grade: 'V-PRO 1', salary: 15000000 },
    { division: 'Khối Sản Xuất', role: 'Thợ Chính', grade: 'V-PRO 4', salary: 22000000 }
  ]);

  // Logic mapping KPI từ PersonnelEngine sang Payroll
  const processedEmployees = useMemo(() => {
    return employees.map(emp => {
      // Giả lập tìm hồ sơ theo tên hoặc code để lấy KPI thực tế
      /* Fix: UserPosition is an interface, use PositionType enum values for comparisons */
      const profile = PersonnelEngine.getProfileByPosition(
        emp.name === 'Nguyễn Văn Vẹn' ? PositionType.ROUGH_FINISHER : PositionType.CASTING_MANAGER
      );
      
      const basicProcessed = HREngine.processPayroll(emp, salaryRules);
      const performanceBonus = profile.kpiPoints * 1000; // 1000 VNĐ cho mỗi KPI Point
      
      return {
        ...basicProcessed,
        kpiPoints: profile.kpiPoints,
        performanceBonus,
        netSalary: (basicProcessed.netSalary || 0) + performanceBonus
      };
    });
  }, [employees, salaryRules]);

  return (
    <div className="p-8 md:p-12 max-w-[1800px] mx-auto h-full overflow-y-auto space-y-12 animate-in fade-in duration-700 pb-24 no-scrollbar">
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-indigo-500/10 pb-10">
        <div>
          <h2 className="ai-headline text-5xl italic uppercase tracking-tighter">BẢNG LƯƠNG TỰ ĐỘNG (KPI)</h2>
          <p className="ai-sub-headline text-indigo-300/60 mt-3 italic uppercase">Tính lương dựa trên tác vụ thực tế bóc tách từ Shard</p>
        </div>
        
        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-indigo-500/20 shrink-0">
          <button onClick={() => setActiveTab('payroll')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'payroll' ? 'bg-indigo-500/20 text-cyan-300' : 'text-gray-500 hover:text-white'}`}>💰 Bảng Lương Master</button>
          <button onClick={() => setActiveTab('seniority')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'seniority' ? 'bg-indigo-500/20 text-cyan-300' : 'text-gray-500 hover:text-white'}`}>📅 Hồ Sơ Identity</button>
        </div>
      </header>

      <div className="ai-panel p-10 bg-black/20 overflow-hidden">
         {activeTab === 'payroll' && (
           <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-[11px]">
                 <thead>
                    <tr className="ai-sub-headline text-white/40 border-b border-white/10 bg-white/5">
                       <th className="p-6">Nhân sự / Identity</th>
                       <th className="p-6">Lương Cứng</th>
                       <th className="p-6 text-amber-500">KPI Points</th>
                       <th className="p-6 text-amber-500">Thưởng Hiệu Suất</th>
                       <th className="p-6">BHXH & Thuế</th>
                       <th className="p-6 text-right">Thực Lãnh OMEGA</th>
                    </tr>
                 </thead>
                 <tbody className="text-indigo-100">
                    {processedEmployees.map(emp => (
                      <tr key={emp.id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                         <td className="p-6">
                            <p className="font-bold text-sm text-white uppercase tracking-tight">{emp.name}</p>
                            <p className="text-[9px] text-indigo-400 font-mono mt-1">{emp.employeeCode}</p>
                         </td>
                         <td className="p-6 font-mono text-gray-400">{emp.grossSalary?.toLocaleString()} đ</td>
                         <td className="p-6 font-mono font-black text-amber-500 text-lg">{emp.kpiPoints} pts</td>
                         <td className="p-6 font-mono font-bold text-amber-400">+{emp.performanceBonus?.toLocaleString()} đ</td>
                         <td className="p-6 font-mono text-red-400">-{((emp.insuranceEmployee || 0) + (emp.personalTax || 0)).toLocaleString()} đ</td>
                         <td className="p-6 text-right font-mono font-black text-xl text-cyan-400">
                            {emp.netSalary?.toLocaleString()} đ
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
         )}
      </div>

      <div className="glass p-10 rounded-[3rem] border border-blue-500/20 bg-blue-500/5">
         <h4 className="text-[10px] text-blue-400 font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></span>
            Tham mưu Kế toán Lương (Thiên)
         </h4>
         <p className="text-sm text-gray-400 italic leading-relaxed font-light">
           "Thưa Anh Natt, Thiên đã thiết lập công thức tính thưởng `1 KPI = 1,000 VND`. Mọi thao tác hoàn thành đơn hàng tại Xưởng (Daily Report) hoặc Phê duyệt Master (Governance) đều được cộng dồn vào quỹ thưởng cuối tháng của nhân sự. Điều này giúp tối ưu hóa 100% chi phí dựa trên hiệu quả thực tế."
         </p>
      </div>
    </div>
  );
};

export default HRCompliance;
