
import React, { useState, useEffect } from 'react';
import { TeamPerformance, PersonaID } from '../types';
import { AnalyticsProvider } from '../services/analytics/AnalyticsAPI';
import GovernanceKPIBoard from './analytics/GovernanceKPIBoard.tsx';
import AIAvatar from './AIAvatar';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { LayoutDashboard, Users, Activity, BarChart3 } from 'lucide-react';

const UnifiedReportingHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'GOVERNANCE' | 'TEAMS' | 'LIFECYCLE'>('GOVERNANCE');
  const [teamStats, setTeamStats] = useState<TeamPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const stats = await AnalyticsProvider.getTeamPerformance();
      setTeamStats(stats);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="h-full flex flex-col p-8 md:p-12 overflow-y-auto no-scrollbar gap-10 animate-in fade-in duration-700 pb-40 bg-[#020202]">
      <header className="flex flex-col lg:flex-row justify-between items-end gap-8 border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-4 mb-3">
             <BarChart3 className="text-amber-500" size={32} />
             <h2 className="ai-headline text-6xl italic uppercase tracking-tighter leading-none text-white">Unified Intelligence</h2>
          </div>
          <p className="ai-sub-headline text-cyan-300/40 ml-1 italic font-black tracking-[0.4em]">Tổng hợp Shard đa chiều • Team 4 Analytics Core</p>
        </div>
        
        <nav className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 shrink-0">
           {[
             { id: 'GOVERNANCE', label: 'Quản trị (KPI)', icon: <LayoutDashboard size={14}/> },
             { id: 'TEAMS', label: 'Tải trọng AI Team', icon: <Users size={14}/> },
             { id: 'LIFECYCLE', label: 'Vòng đời dữ liệu', icon: <Activity size={14}/> }
           ].map(t => (
             <button 
                key={t.id} 
                onClick={() => setActiveTab(t.id as any)} 
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-3 ${activeTab === t.id ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-gray-500 hover:text-white'}`}
             >
                {t.icon} {t.label}
             </button>
           ))}
        </nav>
      </header>

      <main className="flex-1 space-y-12">
          {activeTab === 'GOVERNANCE' && (
             <div className="space-y-8 animate-in slide-in-from-bottom-10">
                <div className="flex justify-between items-center px-4">
                   <h3 className="text-xl font-bold italic text-white uppercase tracking-widest">Executive KPI Monitor</h3>
                   <span className="text-[9px] text-gray-600 font-mono italic">DSP v2026.01 COMPLIANT</span>
                </div>
                <GovernanceKPIBoard />
             </div>
          )}

          {activeTab === 'TEAMS' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in slide-in-from-right-10">
               <div className="ai-panel p-10 bg-black/40 border-white/5 flex flex-col h-[500px]">
                  <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-10 italic">Task Distribution per Team</h3>
                  <div className="flex-1">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={teamStats}>
                           <CartesianGrid stroke="#111" vertical={false} />
                           <XAxis dataKey="team_name" stroke="#444" fontSize={9} />
                           <YAxis stroke="#444" fontSize={9} />
                           <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #222' }} />
                           <Bar dataKey="tasks_completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Hoàn thành" />
                           <Bar dataKey="tasks_in_progress" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Đang thực thi" />
                           <Bar dataKey="tasks_blocked" fill="#ef4444" radius={[4, 4, 0, 0]} name="Bị chặn" />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="ai-panel p-10 bg-white/[0.01] border-white/5">
                     <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-8">System Load Average</h3>
                     <div className="space-y-8">
                        {teamStats.map(team => (
                           <div key={team.team_name} className="space-y-2">
                              <div className="flex justify-between text-[10px] font-black uppercase text-gray-400">
                                 <span>{team.team_name}</span>
                                 <span className={team.load_percentage > 80 ? 'text-red-500' : 'text-green-500'}>{team.load_percentage}%</span>
                              </div>
                              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                 <div className={`h-full transition-all duration-1000 ${team.load_percentage > 80 ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${team.load_percentage}%` }}></div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="ai-panel p-8 bg-black border-white/5 flex items-center gap-6 shadow-2xl">
                      <AIAvatar personaId={PersonaID.THIEN} size="sm" />
                      <p className="text-[11px] text-gray-400 italic leading-relaxed font-light">
                         "Thưa Anh Natt, BĂNG đã bóc tách tải trọng của 4 Team. Hiện tại Team **Bối Bối** đang vận hành 85% công suất để xử lý đơn hàng Showroom. Team **KIM** đang ở trạng thái Standby để bảo vệ Shard an ninh."
                      </p>
                  </div>
               </div>
            </div>
          )}
      </main>
    </div>
  );
};

export default UnifiedReportingHub;
