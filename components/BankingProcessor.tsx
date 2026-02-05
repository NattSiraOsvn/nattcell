
import React, { useState } from 'react';
import { BankingEngine, FINGERPRINT_SCHEMAS, RESOLUTION_TIMELINE } from '../services/bankingService';
// 🛠️ Fixed: Import casing for Types
import { PersonaID, UserRole } from '../types';
import AIAvatar from './AIAvatar';

const BankingProcessor: React.FC = () => {
  const [activeView, setActiveView] = useState<'GOVERNANCE' | 'RECONCILIATION'>('GOVERNANCE');
  const stuckItems = BankingEngine.getMockStuckTransactions();

  return (
    <div className="p-8 md:p-12 max-w-[1800px] mx-auto h-full overflow-y-auto no-scrollbar space-y-12 animate-in fade-in duration-700 pb-40">
      
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-4 mb-2">
             <span className="px-3 py-1 bg-amber-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-amber-900/20">Fiscal Sealing Node</span>
             <h2 className="ai-headline text-5xl italic uppercase tracking-tighter leading-none">Banking Governance</h2>
          </div>
          <p className="ai-sub-headline text-indigo-300/40 ml-1 italic font-black uppercase tracking-[0.3em]">Niêm phong nguyên tắc & Trách nhiệm con người • Master Protocol</p>
        </div>
        
        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 shrink-0">
           <button onClick={() => setActiveView('GOVERNANCE')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeView === 'GOVERNANCE' ? 'bg-amber-500 text-black shadow-lg' : 'text-gray-500'}`}>1. Ma trận Vân tay</button>
           <button onClick={() => setActiveView('RECONCILIATION')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all relative ${activeView === 'RECONCILIATION' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}>
             2. Gỡ Treo Thủ Công
             {stuckItems.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[8px] flex items-center justify-center rounded-full animate-pulse">{stuckItems.length}</span>}
           </button>
        </div>
      </header>

      {activeView === 'GOVERNANCE' && (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in slide-in-from-bottom-10">
            {/* FINGERPRINT STANDARDS */}
            <div className="ai-panel p-10 bg-black/40 border-amber-500/20 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl">🧬</div>
               <h3 className="text-2xl font-serif gold-gradient italic uppercase tracking-widest mb-10">Ma Trận Thuộc Tính Bất Biến</h3>
               <div className="space-y-8">
                  {Object.entries(FINGERPRINT_SCHEMAS).map(([key, schema]) => (
                     <div key={key} className={`p-6 rounded-[2rem] border group transition-all ${schema.securityLevel === 'CRITICAL' ? 'bg-red-950/10 border-red-500/30' : 'bg-white/[0.02] border-white/5'}`}>
                        <div className="flex justify-between items-center mb-4">
                           <span className={`px-3 py-1 rounded text-[9px] font-black uppercase ${
                             schema.securityLevel === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-amber-500 text-black'
                           }`}>{key}</span>
                           <span className="text-[8px] text-gray-500 font-mono">SEC_LEVEL: {schema.securityLevel}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-4 italic">{schema.label}</h4>
                        <div className="flex flex-wrap gap-2">
                           {schema.requiredFields.map(f => (
                              <span key={f} className="px-3 py-1 bg-black/60 border border-white/10 rounded-lg text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-tighter">
                                {f}
                              </span>
                           ))}
                        </div>
                        {schema.securityLevel === 'CRITICAL' && (
                          <p className="mt-4 text-[9px] text-red-400 font-black uppercase italic">⚠️ Điểm chặn cứng: Không được phép auto-match.</p>
                        )}
                     </div>
                  ))}
               </div>
            </div>

            {/* RESOLUTION TIMELINE */}
            <div className="space-y-8">
               <div className="ai-panel p-10 bg-gradient-to-br from-indigo-900/10 to-transparent border-indigo-500/20 shadow-2xl">
                  <h3 className="text-2xl font-serif text-indigo-400 italic uppercase tracking-widest mb-10">Timeline Trách Nhiệm</h3>
                  <div className="relative pl-8 space-y-12">
                     <div className="absolute left-3 top-0 bottom-0 w-px bg-white/5 border-l border-dashed border-indigo-500/30"></div>
                     
                     {RESOLUTION_TIMELINE.map((step, i) => (
                        <div key={i} className="relative">
                           <div className={`absolute -left-[26px] top-1 w-4 h-4 rounded-full border-4 border-black ${
                             i === 0 ? 'bg-indigo-500' : i === 1 ? 'bg-amber-500' : 'bg-green-500'
                           } shadow-[0_0_15px_rgba(255,255,255,0.1)]`}></div>
                           <h4 className="text-sm font-bold text-white uppercase tracking-widest">{step.limit}: {step.role}</h4>
                           <p className="text-[11px] text-gray-400 mt-2 font-light italic leading-relaxed">
                             Nhiệm vụ: {step.action}.<br/>
                             Dấu vết Audit: <span className="text-cyan-500 font-mono">[{step.traceLabel}]</span>
                           </p>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="ai-panel p-8 bg-black border-white/5 flex items-center gap-6">
                  <AIAvatar personaId={PersonaID.CAN} size="sm" isThinking={false} />
                  <div>
                    <h4 className="text-[10px] font-black text-pink-500 uppercase mb-2">Thông điệp từ CAN</h4>
                    <p className="text-[11px] text-gray-400 italic leading-relaxed">
                       "Thưa Anh Natt, CAN đã khóa toàn bộ cơ chế tự học (Self-learning) của Shard này. Hệ thống bây giờ chỉ đóng vai trò là Người gác cổng (Gatekeeper). Mọi gánh nặng xác thực logic đều nằm trên vai nhân sự được định danh."
                    </p>
                  </div>
               </div>
            </div>
         </div>
      )}

      {activeView === 'RECONCILIATION' && (
         <div className="space-y-10 animate-in slide-in-from-right-10">
            <div className="flex justify-between items-center px-4">
               <div>
                  <h3 className="text-2xl font-bold italic text-white uppercase tracking-widest">Shard Staging (Vùng Treo)</h3>
                  <p className="text-xs text-gray-500 italic mt-1">Chờ can thiệp từ Identity được ủy quyền.</p>
               </div>
               <div className="flex gap-4">
                  <span className="px-4 py-2 bg-red-950/20 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black">LOCKED: {stuckItems.length}</span>
               </div>
            </div>
            
            <div className="ai-panel overflow-hidden border-white/5 bg-black/40">
               <table className="w-full text-left text-[11px]">
                  <thead>
                     <tr className="text-gray-500 font-black uppercase tracking-widest border-b border-white/10 bg-black">
                        <th className="p-6">ID Giao dịch</th>
                        <th className="p-6">Loại</th>
                        <th className="p-6">Giá trị</th>
                        <th className="p-6">Lý do treo (Thiếu Vân tay)</th>
                        <th className="p-6 text-center">Trạng thái</th>
                        <th className="p-6 text-right">Thao tác</th>
                     </tr>
                  </thead>
                  <tbody className="text-gray-300 italic">
                     {stuckItems.map(item => (
                        <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-all group">
                           <td className="p-6 font-mono text-[10px] text-gray-400">{item.id}</td>
                           <td className="p-6">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                                item.type === 'EXCHANGE' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                              }`}>{item.type}</span>
                           </td>
                           <td className="p-6 font-mono font-bold text-white">{item.amount.toLocaleString()} đ</td>
                           <td className="p-6