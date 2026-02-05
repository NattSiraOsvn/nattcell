
import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { HRProvider } from '../services/hrService';
import { 
    DetailedPersonnel, UserRole, 
    PersonaID, HRDepartment, HRPosition, HRAttendance 
} from '../types';
import AIAvatar from './AIAvatar';
import LoadingSpinner from './common/LoadingSpinner';

// --- MICRO MODULES (Isolated Logic) ---

const EmployeeShard: React.FC<{ employees: DetailedPersonnel[] }> = ({ employees }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in slide-in-from-bottom-6">
        {employees.map(emp => (
            <div key={emp.id} className="ai-panel p-8 bg-white/[0.01] border-white/5 hover:border-amber-500/40 transition-all group cursor-pointer relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-3xl">👤</div>
                    <span className="px-3 py-1 rounded text-[8px] font-black uppercase border bg-green-600/10 text-green-500 border-green-500/30">ACTIVE</span>
                </div>
                <h4 className="text-xl font-bold text-white uppercase tracking-tight group-hover:text-amber-500 transition-colors">{emp.fullName}</h4>
                {/* Fixed: department is accessed via the position property in PersonnelProfile */}
                <p className="text-indigo-400 font-mono text-[10px] mt-1 italic">{emp.position.role} • {emp.position.department}</p>
                <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4 text-[8px] font-black text-gray-600 uppercase tracking-widest">
                    <div>
                        <p>KPI Points</p>
                        <p className="text-lg text-white font-mono">{emp.kpiPoints}</p>
                    </div>
                    <div className="text-right">
                        <p>Rating</p>
                        <p className="text-xs text-amber-500 italic">{emp.lastRating}</p>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const AttendanceShard: React.FC<{ employeeId: string }> = ({ employeeId }) => {
    const [logs, setLogs] = useState<HRAttendance[]>([]);
    
    useEffect(() => {
        HRProvider.getAttendance(employeeId).then(setLogs);
    }, [employeeId]);

    return (
        <div className="ai-panel overflow-hidden border-white/5 bg-black/40 shadow-2xl">
            <table className="w-full text-left text-[11px]">
                <thead>
                    <tr className="text-gray-500 uppercase font-black tracking-widest border-b border-white/10 bg-black">
                        <th className="p-6">Ngày</th>
                        <th className="p-6">Check-in</th>
                        <th className="p-6">Nguồn (Source)</th>
                        <th className="p-6">Trạng thái</th>
                        <th className="p-6 text-right">Blockchain Hash</th>
                    </tr>
                </thead>
                <tbody className="text-gray-300">
                    {logs.map(log => (
                        <tr key={log.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                            <td className="p-6 font-bold">{log.date}</td>
                            <td className="p-6 font-mono">{new Date(log.checkIn).toLocaleTimeString()}</td>
                            <td className="p-6">
                                <span className={`px-2 py-1 rounded text-[8px] font-black uppercase ${
                                    log.source.type === 'HR_ADJUSTED' ? 'bg-red-600 text-white animate-pulse' : 
                                    log.source.type === 'OMEGA_SYNC' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'
                                }`}>
                                    {log.source.type}
                                </span>
                                {log.source.adjustedBy && <p className="text-[7px] text-gray-600 mt-1">By: {log.source.adjustedBy}</p>}
                            </td>
                            <td className="p-6"><span className="text-green-500">✓ {log.status}</span></td>
                            <td className="p-6 text-right font-mono text-[8px] text-gray-700 truncate max-w-[120px]">{log.source.hash}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// --- MAIN CONTAINER ---

const HRManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'employees' | 'departments' | 'payroll' | 'attendance'>('employees');
  const [employees, setEmployees] = useState<DetailedPersonnel[]>([]);
  const [departments, setDepartments] = useState<HRDepartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadBaseData();
  }, []);

  const loadBaseData = async () => {
    setIsLoading(true);
    try {
      const [empRes, deptRes] = await Promise.all([
        HRProvider.getEmployees(),
        HRProvider.getDepartments()
      ]);
      setEmployees(empRes.data);
      setDepartments(deptRes);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter(e => 
        e.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        e.employeeCode.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [employees, searchQuery]);

  if (isLoading) return <LoadingSpinner message="Reconnecting Identity Nodes..." />;

  return (
    <div className="h-full flex flex-col bg-[#020202] text-white p-6 lg:p-10 overflow-hidden animate-in fade-in duration-700 pb-40">
      
      <header className="flex flex-col lg:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10 mb-8 gap-6">
        <div>
          <h2 className="ai-headline text-5xl italic uppercase tracking-tighter">Human Shard Hub</h2>
          <p className="ai-sub-headline text-indigo-300/40 mt-1 italic font-black uppercase tracking-[0.4em]">Quản trị Identity & Nguồn Chấm công • v5.0</p>
        </div>

        <div className="flex items-center gap-4 bg-black/40 p-2 rounded-2xl border border-white/10">
           <input 
             type="text" 
             value={searchQuery}
             onChange={e => setSearchQuery(e.target.value)}
             placeholder="IDENTITY SEARCH..." 
             className="bg-black/60 border border-white/5 rounded-xl px-4 py-2 text-[10px] text-amber-500 focus:border-amber-500/50 outline-none w-48 uppercase font-black"
           />
           <button className="px-6 py-2 bg-amber-500 text-black rounded-xl font-black text-[10px] uppercase shadow-lg">+ NEW NODE</button>
        </div>
      </header>

      <nav className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/5 mb-8 shrink-0">
          {[
            { id: 'employees', label: 'Nodes', icon: '👤' },
            { id: 'attendance', label: 'Activity & Source', icon: '📡' },
            { id: 'payroll', label: 'Energy Flow', icon: '💰' },
            { id: 'departments', label: 'Cấu trúc', icon: '🏢' }
          ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                    activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl' : 'text-gray-500 hover:text-white'
                }`}
              >
                  {tab.label}
              </button>
          ))}
      </nav>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
          <Suspense fallback={<LoadingSpinner />}>
              {activeTab === 'employees' && <EmployeeShard employees={filteredEmployees} />}
              {activeTab === 'attendance' && <AttendanceShard employeeId={employees[1]?.id || 'e2'} />}
              {activeTab === 'departments' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                      {departments.map(dept => (
                          <div key={dept.id} className="ai-panel p-10 bg-black/40 border-white/5 shadow-2xl relative overflow-hidden group">
                              <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl grayscale">🏢</div>
                              <h3 className="text-2xl font-bold text-white uppercase italic mb-4">{dept.name}</h3>
                              <p className="text-[11px] text-gray-500 italic mb-8">{dept.description}</p>
                              <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase hover:bg-white/10">Expand Shard</button>
                          </div>
                      ))}
                  </div>
              )}
              {activeTab === 'payroll' && (
                  <div className="py-20 text-center opacity-20 italic">
                      <p className="text-4xl font-serif uppercase tracking-widest">Energy Transfer Protocol...</p>
                      <p className="text-xs mt-4">Chờ băm Shard từ Can & Kế toán</p>
                  </div>
              )}
          </Suspense>
      </main>

      <footer className="mt-auto pt-8 border-t border-white/10 flex items-center gap-8 shrink-0">
          <div className="flex items-center gap-6 ai-panel p-6 bg-indigo-500/5 border-indigo-500/20 max-w-3xl">
              <AIAvatar personaId={PersonaID.KRIS} size="sm" />
              <div>
                  <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 italic">Kris - HR Compliance</h4>
                  <p className="text-[12px] text-gray-400 italic leading-relaxed font-light">
                      "Thưa Anh Natt, Kris đang rà soát nguồn chấm công. Lưu ý các log đánh dấu **HR_ADJUSTED** là các trường hợp sửa thủ công, Thiên sẽ tự động băm vào Shard báo cáo rủi ro hàng tuần."
                  </p>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default HRManagement;
