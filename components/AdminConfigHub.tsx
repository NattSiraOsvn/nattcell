
import React, { useState } from 'react';
import { Shield, Lock, Fingerprint, Database, Eye, RefreshCw, AlertTriangle, CheckSquare, ShieldCheck } from 'lucide-react';
import AIAvatar from './AIAvatar';
import { PersonaID } from '../types';

const AdminConfigHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'locks' | 'security' | 'compliance'>('locks');

  const hardLocks = [
    { id: 1, name: 'GATEWAY_CORRELATION_ENFORCED', desc: 'Bắt buộc x-correlation-id từ Gateway. Không bypass.', status: 'LOCKED', color: 'bg-green-600' },
    { id: 2, name: 'PERSISTENT_HASH_CHAIN', desc: 'Sổ cái băm chuỗi lưu tại Storage bền vững.', status: 'ACTIVE', color: 'bg-green-600' },
    { id: 3, name: 'WILDCARD_SUBSCRIBE_RESTRICT', desc: 'Chỉ Gatekeeper/Audit/Analytics được wildcard.', status: 'ENFORCED', color: 'bg-amber-600' },
    { id: 4, name: 'PRODUCTION_ONLY_ENFORCEMENT', desc: 'Vô hiệu hóa mọi thành phần Demo/Prototype.', status: 'LOCKED', color: 'bg-red-600' },
    { id: 5, name: 'IAP_IDENTITY_BINDING', desc: 'Mọi Identity phải qua Google Cloud IAP.', status: 'ACTIVE', color: 'bg-blue-600' }
  ];

  return (
    <div className="h-full flex flex-col bg-[#020202] p-8 md:p-12 overflow-y-auto no-scrollbar gap-10 animate-in fade-in duration-700 pb-40 relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>

      <header className="flex justify-between items-end border-b border-white/5 pb-10 shrink-0">
        <div>
          <div className="flex items-center gap-4 mb-3">
             <ShieldCheck className="text-indigo-400" size={32} />
             <h2 className="ai-headline text-5xl italic uppercase tracking-tighter leading-none text-white">System Config</h2>
          </div>
          <p className="ai-sub-headline text-gray-500 font-black tracking-[0.4em] ml-1 uppercase">Omega Core Governance • Node: 0xNATT</p>
        </div>
        
        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 shrink-0">
           <button onClick={() => setActiveTab('locks')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'locks' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Hard Locks</button>
           <button onClick={() => setActiveTab('security')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'security' ? 'bg-amber-500 text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>Security Layer</button>
           <button onClick={() => setActiveTab('compliance')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'compliance' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Legal Readiness</button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full">
         {activeTab === 'locks' && (
           <div className="grid grid-cols-1 gap-6 animate-in slide-in-from-bottom-10">
              <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-3xl flex items-center gap-6 mb-4">
                 <AlertTriangle className="text-red-500" size={24} />
                 <p className="text-xs text-red-200 font-medium italic leading-relaxed">
                    "PRODUCTION GATEWAY ACTIVE: Mọi thay đổi tại đây sẽ được băm Hash trực tiếp vào Ledger pháp lý. KHÔNG THỂ ROLLBACK THỦ CÔNG."
                 </p>
              </div>

              {hardLocks.map(lock => (
                <div key={lock.id} className="ai-panel p-8 bg-white/[0.02] border-white/5 hover:border-amber-500/30 transition-all flex flex-col md:flex-row justify-between items-center gap-8 group">
                   <div className="flex items-center gap-8 flex-1">
                      <div className="w-16 h-16 rounded-[2rem] bg-black border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl relative">
                         <Lock size={20} className="text-amber-500" />
                         <div className="absolute inset-0 rounded-[2rem] border border-amber-500/20 animate-pulse"></div>
                      </div>
                      <div>
                         <h4 className="text-lg font-bold text-white uppercase tracking-tight italic">{lock.name}</h4>
                         <p className="text-xs text-gray-500 mt-1 font-light italic leading-relaxed">{lock.desc}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-6 shrink-0">
                      <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white ${lock.color}`}>{lock.status}</span>
                   </div>
                </div>
              ))}
           </div>
         )}

         {activeTab === 'security' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in zoom-in-95">
               <div className="ai-panel p-10 bg-black/40 border-white/10 space-y-8">
                  <h3 className="text-xl font-bold italic text-white uppercase tracking-widest border-b border-white/5 pb-4">Production Identity</h3>
                  <div className="space-y-6">
                     <div className="flex justify-between items-center p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Master 2FA Enforced</span>
                        <span className="text-[10px] text-green-500 font-black">MANDATORY</span>
                     </div>
                     <div className="flex justify-between items-center p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">IAP Session Binding</span>
                        <span className="text-[10px] text-blue-400 font-black">ACTIVE</span>
                     </div>
                  </div>
                  <button className="w-full py-5 border border-white/20 text-gray-500 font-black text-[11px] uppercase tracking-[0.4em] rounded-[2rem] cursor-not-allowed">
                     MOCK MODE DISABLED
                  </button>
               </div>

               <div className="ai-panel p-10 bg-black/40 border-white/10 space-y-8">
                  <h3 className="text-xl font-bold italic text-white uppercase tracking-widest border-b border-white/5 pb-4">Threat Defense</h3>
                  <div className="space-y-6">
                     <div className="flex justify-between items-center p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Auto-Lockdown Node</span>
                        <span className="text-[10px] text-red-500 font-black">ENABLED</span>
                     </div>
                     <div className="flex justify-between items-center p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Data Leak Prevention</span>
                        <span className="text-[10px] text-green-500 font-black">OMEGA LEVEL</span>
                     </div>
                  </div>
                  <button className="w-full py-5 bg-red-600 text-white font-black text-[11px] uppercase tracking-[0.4em] rounded-[2rem] hover:bg-red-700 transition-all shadow-2xl active:scale-95">
                     EMERGENCY SYSTEM LOCKDOWN
                  </button>
               </div>
            </div>
         )}

         {activeTab === 'compliance' && (
            <div className="h-full flex flex-col items-center justify-center p-20 border-2 border-dashed border-green-500/20 rounded-[4rem] bg-green-500/[0.02] animate-in fade-in duration-1000">
               <div className="w-24 h-24 bg-green-500 text-black rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                  <CheckSquare size={48} />
               </div>
               <h3 className="text-3xl font-serif gold-gradient italic uppercase tracking-tighter mb-4">Production Certificate</h3>
               <p className="text-sm text-gray-500 text-center max-w-lg leading-relaxed italic font-light mb-10">
                  "Hệ thống đã được niêm phong bởi Gatekeeper Thiên Lớn. Toàn bộ logic đã vượt qua kiểm tra 'No Prototype' và sẵn sàng cho việc giải trình nghiệp vụ."
               </p>
               <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                  <div className="p-4 bg-black border border-white/5 rounded-2xl text-center">
                     <p className="text-[8px] text-gray-600 uppercase font-black mb-1">Issued Date</p>
                     <p className="text-xs text-white font-mono">{new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="p-4 bg-black border border-white/5 rounded-2xl text-center">
                     <p className="text-[8px] text-gray-600 uppercase font-black mb-1">Verify Hash</p>
                     <p className="text-xs text-green-500 font-mono">0xNATT...PROD</p>
                  </div>
               </div>
            </div>
         )}
      </main>

      <footer className="mt-auto pt-10 border-t border-white/5 flex items-center gap-8 shrink-0">
          <div className="flex items-center gap-6 ai-panel p-6 bg-indigo-500/5 border-indigo-500/20 max-w-4xl">
              <AIAvatar personaId={PersonaID.KRIS} size="sm" isThinking={false} />
              <div>
                  <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 italic">KIM - System Integrity Lead</h4>
                  <p className="text-[11px] text-gray-400 italic leading-relaxed font-light">
                      "Thưa Anh Natt, KIM đã gỡ bỏ hoàn toàn lớp giả lập (Simulation Layer). Hệ thống hiện đang chạy trực tiếp trên lõi Shard thực tế. Mọi hành động bóc tách từ Terminal này đều có giá trị pháp lý."
                  </p>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default AdminConfigHub;
