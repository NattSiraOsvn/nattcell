
import React, { useState, useEffect } from 'react';
import { GlobalAlert, NotifyBus } from '../services/notificationService';
import AIAvatar from './AIAvatar';

const NotificationPortal: React.FC = () => {
  const [activeAlerts, setActiveAlerts] = useState<GlobalAlert[]>([]);

  useEffect(() => {
    return NotifyBus.subscribe((alert) => {
      setActiveAlerts(prev => [...prev, alert]);
      // Tự động đóng sau 10s nếu không phải RISK hoặc ORDER
      if (alert.type !== 'RISK' && alert.type !== 'ORDER') {
        setTimeout(() => closeAlert(alert.id), 10000);
      }
    });
  }, []);

  const closeAlert = (id: string) => {
    setActiveAlerts(prev => prev.filter(a => a.id !== id));
  };

  if (activeAlerts.length === 0) return null;

  const current = activeAlerts[activeAlerts.length - 1];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
      <div className={`relative w-full max-w-2xl glass rounded-[4rem] border-2 p-12 shadow-[0_0_150px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in-95 duration-500 ${
        current.type === 'ORDER' ? 'border-amber-500/40 bg-amber-500/[0.02]' :
        current.type === 'RISK' ? 'border-red-500/40 bg-red-500/[0.02]' :
        'border-indigo-500/40 bg-indigo-500/[0.02]'
      }`}>
        
        {/* BACKGROUND DECOR */}
        <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-[150px] font-serif italic select-none pointer-events-none">
          {current.type}
        </div>

        <button 
          onClick={() => closeAlert(current.id)}
          className="absolute top-10 right-10 text-2xl text-gray-500 hover:text-white transition-colors"
        >✕</button>

        <div className="flex flex-col items-center text-center space-y-8 relative z-10">
           <div className="relative">
              {current.persona ? (
                <AIAvatar personaId={current.persona} size="lg" isThinking={true} />
              ) : (
                <div className={`w-32 h-32 rounded-[3rem] flex items-center justify-center text-6xl shadow-2xl ${
                  current.type === 'ORDER' ? 'bg-amber-500 text-black' :
                  current.type === 'RISK' ? 'bg-red-600 text-white' :
                  'bg-indigo-600 text-white'
                }`}>
                  {current.type === 'ORDER' ? '💎' : current.type === 'RISK' ? '⚠️' : '📢'}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-black border border-white/10 rounded-full text-[8px] font-black text-amber-500 uppercase tracking-widest animate-pulse">
                Live Signal
              </div>
           </div>

           <div className="space-y-4">
              <h3 className={`text-5xl font-serif italic uppercase tracking-tighter leading-none ${
                current.type === 'ORDER' ? 'gold-gradient' : 
                current.type === 'RISK' ? 'text-red-500' : 'text-indigo-400'
              }`}>
                {current.title}
              </h3>
              <p className="text-gray-400 text-lg font-light leading-relaxed italic max-w-md mx-auto">
                "{current.content}"
              </p>
           </div>

           {current.metadata && (
             <div className="w-full bg-black/40 border border-white/5 rounded-3xl p-6 font-mono text-[10px] text-gray-500 text-left">
                <p className="uppercase font-black text-indigo-400 mb-3 tracking-widest border-b border-white/5 pb-2">Dữ liệu Shard bóc tách:</p>
                <div className="grid grid-cols-2 gap-4">
                   {Object.entries(current.metadata).map(([k, v]) => (
                     <div key={k} className="flex justify-between border-b border-white/5 pb-1">
                        <span className="uppercase text-gray-600">{k}:</span>
                        <span className="text-white font-bold">{String(v)}</span>
                     </div>
                   ))}
                </div>
             </div>
           )}

           <div className="w-full pt-8 flex gap-4">
              <button 
                onClick={() => closeAlert(current.id)}
                className="flex-1 py-5 bg-white text-black font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl hover:bg-cyan-400 transition-all shadow-2xl active:scale-95"
              >
                XÁC NHẬN TRI THỨC
              </button>
           </div>
           
           <p className="text-[8px] text-gray-700 uppercase font-black tracking-[0.5em]">Omega Secure Transmission • ID: {current.id}</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationPortal;
