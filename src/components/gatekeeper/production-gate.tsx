
import React from 'react';
import { ShieldCheck, AlertCircle, Clock, CheckCircle2, XCircle, Fingerprint } from 'lucide-react';

export interface ProductionGateCheck {
  check: string;
  status: 'PASS' | 'FAIL' | 'PENDING';
  details?: any;
}

export interface ProductionGateProps {
  status?: 'BOOTING' | 'CHECKING' | 'PASSED' | 'FAILED' | 'EMERGENCY';
  checks?: ProductionGateCheck[];
  error?: string;
  emergencyOverrideAvailable?: boolean;
  onPassed?: () => void;
  meta?: {
    planId?: string;
    timestamp?: string;
    gatekeeper?: string;
    sovereign?: string;
    sealed_nodes?: number;
  };
}

export const ProductionGate: React.FC<ProductionGateProps> = ({
  status = 'BOOTING',
  checks = [],
  error,
  onPassed
}) => {
  const isFailed = status === 'FAILED' || status === 'EMERGENCY';
  
  const iconFor = (s: string) => {
    if (s === 'PASS') return <CheckCircle2 size={16} className="text-green-500" />;
    if (s === 'FAIL') return <XCircle size={16} className="text-red-500" />;
    return <Clock size={16} className="text-amber-500 animate-spin" />;
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-[#050505] flex flex-col items-center justify-center p-6 md:p-12 font-sans overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.03)_0%,_transparent_70%)] pointer-events-none"></div>
      
      <div className="w-full max-w-2xl space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <div className={`w-24 h-24 rounded-[2.5rem] mx-auto flex items-center justify-center shadow-2xl border transition-all duration-700 ${
            status === 'PASSED' ? 'bg-green-600 border-green-400 scale-110' : 
            isFailed ? 'bg-red-500/10 border-red-500/30' : 'bg-amber-500/10 border-amber-500/30'
          }`}>
            {status === 'PASSED' ? <Fingerprint size={48} className="text-white" /> : isFailed ? <AlertCircle size={40} className="text-red-500" /> : <ShieldCheck size={40} className="text-amber-500" />}
          </div>
          <h1 className="text-5xl font-serif gold-gradient italic uppercase tracking-tighter">
            {status === 'PASSED' ? 'ANH NAT DNA DETECTED' : isFailed ? '🚨 SECURITY VIOLATION' : '🔐 PRODUCTION GATE'}
          </h1>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.6em]">
            NATT-OS • SIG_BY_ADMIN_NAT_2026 • v1.1
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {checks.map((c, i) => (
            <div key={i} className={`p-5 rounded-2xl border flex items-center justify-between transition-all ${
              c.status === 'PASS' ? 'bg-green-500/5 border-green-500/20' : 
              c.status === 'FAIL' ? 'bg-red-500/5 border-red-500/20' : 
              'bg-white/[0.02] border-white/5 opacity-40'
            }`}>
              <div className="flex items-center gap-4">
                {iconFor(c.status)}
                <span className={`text-[11px] font-bold uppercase tracking-widest ${
                  c.status === 'PASS' ? 'text-white' : c.status === 'FAIL' ? 'text-red-400' : 'text-gray-500'
                }`}>{c.check}</span>
              </div>
              <span className={`text-[9px] font-mono font-black ${
                c.status === 'PASS' ? 'text-green-500' : c.status === 'FAIL' ? 'text-red-500' : 'text-amber-500'
              }`}>{c.status}</span>
            </div>
          ))}
        </div>

        {status === 'PASSED' && onPassed && (
          <div className="pt-6 text-center animate-in fade-in zoom-in-95 duration-1000">
            <button 
              onClick={onPassed}
              className="w-full py-5 bg-white text-black font-black text-xs uppercase tracking-[0.4em] rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:bg-amber-400 transition-all active:scale-95"
            >
              Enter Sovereign Terminal
            </button>
          </div>
        )}
        
        {isFailed && (
           <div className="p-6 bg-red-950/20 border border-red-500/30 rounded-3xl text-center">
              <p className="text-red-500 font-mono text-xs">{error || 'IDENTITY_VERIFICATION_FAILED'}</p>
           </div>
        )}
      </div>
    </div>
  );
};
