
import React, { useState, useEffect } from 'react';
import { GovernanceKPI } from '@/types';
import { AnalyticsProvider } from '@/services/analytics/analyticsapi';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

const GovernanceKPIBoard: React.FC = () => {
  const [kpis, setKpis] = useState<GovernanceKPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await AnalyticsProvider.getGovernanceKPIs();
      setKpis(data);
      setIsLoading(false);
    };
    load();
  }, []);

  if (isLoading) return <div className="p-10 animate-pulse text-gray-500 font-mono">Bóc tách KPI...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
      {kpis.map(kpi => (
        <div key={kpi.kpi_id} className={`ai-panel p-8 border-white/5 transition-all ${
          kpi.status === 'CRITICAL' ? 'bg-red-950/10 border-red-500/30' : 
          kpi.status === 'WARNING' ? 'bg-amber-950/10 border-amber-500/30' : 
          'bg-black/40'
        }`}>
          <div className="flex justify-between items-start mb-6">
             <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{kpi.category}</span>
             {kpi.status === 'OK' ? <CheckCircle2 size={16} className="text-green-500" /> : <ShieldAlert size={16} className="text-red-500" />}
          </div>
          <h4 className="text-white font-bold text-sm uppercase tracking-tight mb-2">{kpi.kpi_name}</h4>
          <div className="flex items-baseline gap-4">
             <p className="text-3xl font-mono font-black text-white italic">
               {kpi.actual_value.toLocaleString()}
             </p>
             <div className={`flex items-center gap-1 text-[10px] font-bold ${kpi.change_percent > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {kpi.change_percent > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {Math.abs(kpi.change_percent)}%
             </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
             <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Target: {kpi.target_value.toLocaleString()}</span>
             <span className="text-[8px] text-indigo-400 font-black italic uppercase">Owner: {kpi.owner_team}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GovernanceKPIBoard;
