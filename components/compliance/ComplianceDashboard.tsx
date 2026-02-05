
import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  LineChart, Line 
} from 'recharts';
import { ComplianceProvider } from '../../services/compliance/ComplianceService.ts';
import { CertificationProvider } from '../../services/compliance/CertificationService.ts';
import LoadingSpinner from '../common/LoadingSpinner.tsx';
import { Shield, FileText, Award, AlertTriangle, TrendingUp, Calendar, Zap, CheckCircle } from 'lucide-react';

const ComplianceDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [certStats, setCertStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [cData, sData] = await Promise.all([
      ComplianceProvider.getComplianceDashboard(),
      CertificationProvider.getStatistics()
    ]);
    setData(cData);
    setCertStats(sData);
    setLoading(false);
  };

  if (loading || !data) return <LoadingSpinner message="Đang bóc tách Shard tuân thủ..." />;

  // Chuẩn bị dữ liệu biểu đồ
  const policyStatusData = Object.entries(data.policyStats.byStatus).map(([name, value]) => ({
    name: name.replace('_', ' '),
    value: value,
    color: name === 'ACTIVE' ? '#10b981' : name === 'UNDER_REVIEW' ? '#f59e0b' : name === 'ARCHIVED' ? '#6b7280' : '#3b82f6'
  }));

  const upcomingRenewals = [
    { name: 'GIA-223...01', daysLeft: 15 },
    { name: 'ISO-9001', daysLeft: 45 },
    { name: 'PNJ-LAB-X', daysLeft: 8 },
    { name: 'SJC-SECURE', daysLeft: 22 }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/[0.02] border border-white/5 p-6 rounded-[2.5rem]">
         <div>
            <h3 className="text-xl font-bold text-white uppercase italic tracking-widest">Executive Compliance Insight</h3>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-1">Real-time Governance Monitoring</p>
         </div>
         <div className="flex items-center gap-4">
            <select className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[10px] text-amber-500 font-black uppercase outline-none focus:border-amber-500">
               <option>This Month</option>
               <option>Last Quarter</option>
               <option>Fiscal Year 2026</option>
            </select>
            <button onClick={loadData} className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg hover:bg-indigo-500 transition-all">Refresh Node</button>
         </div>
      </div>

      {/* ALERT STRIP */}
      {data.alerts.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-3xl flex items-center justify-between animate-pulse">
           <div className="flex items-center gap-4">
              <AlertTriangle className="text-amber-500" size={20} />
              <p className="text-xs text-amber-200 font-medium">Phát hiện {data.alerts.length} cảnh báo tuân thủ cần rà soát ngay.</p>
           </div>
           <button className="text-[10px] font-black text-amber-500 uppercase underline">View All</button>
        </div>
      )}

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="ai-panel p-8 bg-white/5 border-white/5 group hover:border-indigo-500/30 transition-all">
           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Total Policies</p>
           <div className="flex items-end justify-between">
              <p className="text-5xl font-mono font-black text-white leading-none">{data.policyStats.total}</p>
              <div className="flex items-center gap-1 text-green-500">
                 <TrendingUp size={14} />
                 <span className="text-[10px] font-bold">+{data.policyStats.trend}%</span>
              </div>
           </div>
           <p className="text-[9px] text-gray-600 mt-4 italic font-light tracking-wide">Increased from last period</p>
        </div>

        <div className="ai-panel p-8 bg-white/5 border-white/5">
           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Active Certifications</p>
           <p className="text-5xl font-mono font-black text-white leading-none mb-4">{certStats.active}</p>
           <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: `${certStats.activePercent}%` }}></div>
           </div>
           <p className="text-[9px] text-gray-600 mt-2 font-bold uppercase tracking-widest">{certStats.activePercent.toFixed(0)}% Optimal State</p>
        </div>

        <div className="ai-panel p-8 bg-indigo-500/5 border-indigo-500/20 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5 text-4xl">🛡️</div>
           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Compliance Score</p>
           <p className="text-6xl font-mono font-black text-white italic leading-none">{data.complianceScore}%</p>
           <div className="mt-6 flex items-center gap-2">
              <CheckCircle size={12} className="text-indigo-500" />
              <span className="text-[9px] text-indigo-300 font-bold uppercase">Standard Grade: EXCELLENT</span>
           </div>
        </div>

        <div className="ai-panel p-8 bg-amber-500/5 border-amber-500/20">
           <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-4">Pending Actions</p>
           <p className="text-5xl font-mono font-black text-white leading-none mb-6">{data.pendingActions}</p>
           <button className="w-full py-2 bg-amber-500 text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-400">Review Now</button>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* POLICY PIE */}
         <div className="ai-panel p-10 bg-black/40 border-white/5 h-[450px] flex flex-col shadow-2xl">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-10 flex items-center gap-3 italic">
               <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
               Policy Status Distribution
            </h3>
            <div className="flex-1 min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie 
                        data={policyStatusData} 
                        cx="50%" cy="50%" 
                        innerRadius={80} 
                        outerRadius={120} 
                        paddingAngle={5} 
                        dataKey="value"
                        stroke="none"
                     >
                        {policyStatusData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                     </Pie>
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px', fontSize: '10px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                     />
                     <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 900 }} />
                  </PieChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* EXPIRY BAR */}
         <div className="ai-panel p-10 bg-black/40 border-white/5 h-[450px] flex flex-col shadow-2xl">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-10 flex items-center gap-3 italic text-red-500">
               <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
               Certifications Expiring Soon
            </h3>
            <div className="flex-1 min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={upcomingRenewals} layout="vertical" margin={{ left: 20 }}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={true} vertical={false} />
                     <XAxis type="number" stroke="#444" fontSize={9} label={{ value: 'Days Left', position: 'insideBottom', offset: -10, fill: '#444' }} />
                     <YAxis dataKey="name" type="category" stroke="#888" fontSize={9} width={80} />
                     <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
                     />
                     <Bar dataKey="daysLeft" fill="#ff4d4f" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* TREND LINE */}
         <div className="lg:col-span-2 ai-panel p-10 bg-black/40 border-white/5 h-[450px] flex flex-col shadow-2xl">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-10 flex items-center gap-3 italic text-cyan-400">
               <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
               Compliance Score Trend
            </h3>
            <div className="flex-1 min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.complianceTrend}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                     <XAxis dataKey="month" stroke="#444" fontSize={10} fontStyle="italic" />
                     <YAxis stroke="#444" fontSize={10} domain={[0, 100]} />
                     <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                     <Legend />
                     <Line type="monotone" dataKey="score" stroke="#1890ff" strokeWidth={3} dot={{ r: 4, fill: '#1890ff' }} name="Actual Score" />
                     <Line type="monotone" dataKey="target" stroke="#52c41a" strokeDasharray="5 5" name="System Target" />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* QUICK ACTIONS SECTION */}
      <div className="ai-panel p-12 bg-white/[0.01] border-white/5">
         <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-10 italic">Quick Access Master Commands</h3>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
               { icon: <FileText size={18} />, label: 'New Policy', color: 'indigo' },
               { icon: <Calendar size={18} />, label: 'Schedule Audit', color: 'amber' },
               { icon: <Zap size={18} />, label: 'Generate Report', color: 'cyan' },
               { icon: <Award size={18} />, label: 'Verify Certs', color: 'green' }
            ].map((btn, i) => (
               <button key={i} className="flex flex-col items-center justify-center p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-white/30 hover:bg-white/[0.05] transition-all group">
                  <div className={`mb-4 text-gray-500 group-hover:text-white transition-colors`}>{btn.icon}</div>
                  <span className="text-[10px] font-black text-gray-500 group-hover:text-white uppercase tracking-widest">{btn.label}</span>
               </button>
            ))}
         </div>
      </div>
    </div>
  );
};

export default ComplianceDashboard;
