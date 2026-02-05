
import React, { useState, useEffect } from 'react';
import { TeamPerformance, PersonaID, GovernanceKPI } from '../types.ts';
import { AnalyticsProvider } from '../services/analytics/AnalyticsAPI.ts';
import GovernanceKPIBoard from './analytics/GovernanceKPIBoard.tsx';
import AIAvatar from './AIAvatar.tsx';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { LayoutDashboard, Users, Activity, BarChart3, TrendingUp, Target } from 'lucide-react';

const UnifiedReportingHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'GOVERNANCE' | 'TEAMS' | 'LIFECYCLE'>('GOVERNANCE');
  const [teamStats, setTeamStats] = useState<TeamPerformance[]>([]);
  const [kpis, setKpis] = useState<GovernanceKPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
    const interval = setInterval(loadAnalyticsData, 5000); // Live sync mỗi 5s
    return () => clearInterval(interval);
  }, []);

  const loadAnalyticsData = async () => {
    try {
      const [stats, kpiData] = await Promise.all([
        AnalyticsProvider.getTeamPerformance(),
        AnalyticsProvider.getGovernanceKPIs()
      ]);
      setTeamStats(stats);
      setKpis(kpiData);
      setLoading(false);
    } catch (e) {
      console.error("Failed to load analytics read models:", e);
    }
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

  return (
    <div className="h-full flex flex-col p-8 md:p-12 overflow-y-auto no-scrollbar gap-10 animate-in fade-in duration-700 pb-40 bg-[#020202]">
      <header className="flex flex-col lg:flex-row justify-between items-end gap-8 border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-4 mb-3">
             <BarChart3 className="text-amber-500" size={32} />
             <h2 className="ai-headline text-6xl italic uppercase tracking-tighter leading-none text-white">Unified Intelligence</h2>
          </div>
          <p className="ai-sub-headline text-cyan-300/40 ml-1 italic font-black tracking-[0.4em] uppercase">
            Băng (Team 4) Read-model Layer • Real-time Data Sync
          </p>
        </div>
        
        <nav className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 shrink-0">
           {[
             { id: 'GOVERNANCE', label: 'Quản trị (KPI)', icon: <LayoutDashboard size={14}/> },
             { id: 'TEAMS', label: 'Tải trọng Shard', icon: <Users size={14}/> },
             { id: 'LIFECYCLE', label: 'Saga Lifecycle', icon: <Activity size={14}/> }
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
             <div className="space-y-10 animate-in slide-in-from-bottom-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {kpis.map(kpi => (
                      <div key={kpi.kpi_id} className="ai-panel p-8 bg-black/40 border-white/5 relative overflow-hidden group hover:border-amber-500/40 transition-all">
                         <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl italic font-serif grayscale group-hover:grayscale-0 group-hover:opacity-20 transition-all">
                            {kpi.category[0]}
                         </div>
                         <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">{kpi.category} NODE</p>
                         <h4 className="text-white font-bold text-sm uppercase mb-6">{kpi.kpi_name}</h4>
                         <div className="flex items-end justify-between">
                            <div>
                               <p className="text-4xl font-mono font-black text-white italic">{kpi.actual_value.toLocaleString()}</p>
                               <p className="text-[9px] text-gray-600 mt-2 font-bold uppercase tracking-widest">Target: {kpi.target_value.toLocaleString()}</p>
                            </div>
                            <div className={`text-right ${kpi.status === 'OK' ? 'text-green-500' : 'text-amber-500'}`}>
                               <p className="text-xl font-black italic">{(kpi.actual_value / kpi.target_value * 100).toFixed(1)}%</p>
                               <p className="text-[8px] font-black uppercase tracking-widest">{kpi.status}</p>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>

                <div className="ai-panel p-10 bg-gradient-to-br from-indigo-900/10 to-transparent border-indigo-500/20 shadow-2xl">
                   <h3 className="text-xl font-bold text-white uppercase italic tracking-widest mb-10 flex items-center gap-4">
                      <Target size={24} className="text-indigo-400" />
                      Executive Projection Matrix
                   </h3>
                   <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={kpis}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#111" vertical={false} />
                            <XAxis dataKey="kpi_name" stroke="#444" fontSize={9} />
                            <YAxis stroke="#444" fontSize={9} />
                            <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #222' }} />
                            <Line type="monotone" dataKey="actual_value" stroke="#f59e0b" strokeWidth={4} dot={{ r: 6, fill: '#f59e0b' }} />
                            <Line type="monotone" dataKey="target_value" stroke="#333" strokeDasharray="5 5" />
                         </LineChart>
                      </ResponsiveContainer>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'TEAMS' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in slide-in-from-right-10">
               <div className="ai-panel p-10 bg-black/40 border-white/5 flex flex-col h-[550px] shadow-2xl">
                  <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-10 italic">Distributed Task Intensity per Team</h3>
                  <div className="flex-1">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={teamStats} margin={{ bottom: 40 }}>
                           <CartesianGrid stroke="#111" vertical={false} />
                           <XAxis dataKey="team_name" stroke="#444" fontSize={8} angle={-15} textAnchor="end" />
                           <YAxis stroke="#444" fontSize={9} />
                           <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #222' }} />
                           <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 20, fontSize: '9px', fontWeight: 900 }} />
                           <Bar dataKey="tasks_completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Done" />
                           <Bar dataKey="tasks_in_progress" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Processing" />
                           <Bar dataKey="tasks_blocked" fill="#ef4444" radius={[4, 4, 0, 0]} name="Blocked" />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               <div className="space-y-8 flex flex-col">
                  <div className="ai-panel p-10 bg-white/[0.01] border-white/5 flex-1 shadow-2xl">
                     <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-8">Neural Load Distribution</h3>
                     <div className="space-y-10">
                        {teamStats.map((team, idx) => (
                           <div key={team.team_name} className="space-y-3">
                              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                 <span className="text-stone-400">{team.team_name}</span>
                                 <span className={team.load_percentage > 80 ? 'text-red-500' : 'text-green-500'}>
                                    {team.load_percentage}% LOAD
                                 </span>
                              </div>
                              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                 <div 
                                    className="h-full transition-all duration-1000" 
                                    style={{ 
                                       width: `${team.load_percentage}%`,
                                       backgroundColor: COLORS[idx % COLORS.length]
                                    }}
                                 ></div>
                              </div>
                              <div className="flex justify-between text-[8px] font-bold text-gray-700 uppercase tracking-widest">
                                 <span>Completion Rate: {team.completion_rate}%</span>
                                 <span>{team.tasks_completed} Units Processed</span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="ai-panel p-8 bg-black border-white/5 flex items-center gap-8 shadow-[0_0_60px_rgba(0,0,0,0.8)]">
                      <AIAvatar personaId={PersonaID.THIEN} size="sm" />
                      <div className="flex-1">
                         <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 italic">Băng (Team 4) - System Insights</h4>
                         <p className="text-[11px] text-gray-400 italic leading-relaxed font-light">
                            "Báo cáo Master: Các Node đang vận hành tại cường độ tối ưu. Team 1 (Bối Bối) đang gánh tải 85% do lượng đơn hàng tăng đột biến. Shard Kế toán của Team 2 vẫn duy trì 100% tính vẹn toàn."
                         </p>
                      </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'LIFECYCLE' && (
             <div className="py-32 text-center opacity-20 italic animate-in zoom-in-95 duration-1000">
                <Activity size={100} className="mx-auto mb-10 grayscale" />
                <p className="text-4xl font-serif uppercase tracking-[0.4em]">Saga Lifecycle Shard...</p>
                <p className="text-xs mt-6 uppercase font-black text-amber-500 tracking-[0.2em]">Đang đồng bộ luồng băm Hash xuyên Shard (Causation Chain)</p>
             </div>
          )}
      </main>
    </div>
  );
};

export default UnifiedReportingHub;
