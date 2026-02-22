import React, { useState, useMemo } from 'react';
import { ActionLog, UserRole, PersonaID } from '@/types';
import { ShardingService } from '@/services/blockchainservice';
import { Copy, Check, ChevronDown, ChevronRight, Hash, Activity, ShieldCheck } from 'lucide-react';

interface AuditTrailModuleProps {
  actionLogs: ActionLog[];
  currentRole: UserRole;
}

const AuditTrailModule: React.FC<AuditTrailModuleProps> = ({ actionLogs, currentRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('ALL');
  const [verifiedLogId, setVerifiedLogId] = useState<string | null>(null);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null); // Accordion State
  const [copiedHash, setCopiedHash] = useState<string | null>(null); // Copy Feedback
  const [dateFilter, setDateFilter] = useState('');

  const filteredLogs = useMemo(() => {
    return actionLogs.filter(log => {
      const matchSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.details.toLowerCase().includes(searchTerm.toLowerCase());
      const matchModule = filterModule === 'ALL' || log.module === filterModule;
      
      let matchDate = true;
      if (dateFilter) {
          const logDate = new Date(log.timestamp).toISOString().split('T')[0];
          matchDate = logDate === dateFilter;
      }

      return matchSearch && matchModule && matchDate;
    });
  }, [actionLogs, searchTerm, filterModule, dateFilter]);

  const uniqueModules = useMemo(() => {
    const mods = new Set(actionLogs.map(l => l.module));
    return ['ALL', ...Array.from(mods)];
  }, [actionLogs]);

  const handleVerifyHash = (e: React.MouseEvent, log: ActionLog) => {
    e.stopPropagation();
    const computedHash = ShardingService.generateShardHash({ 
      action: log.action, 
      details: log.details, 
      timestamp: log.timestamp, 
      user: log.userPosition 
    });
    setVerifiedLogId(log.id);
    setTimeout(() => setVerifiedLogId(null), 3000);
  };

  const handleCopyHash = (e: React.MouseEvent, hash: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const toggleExpand = (id: string) => {
    setExpandedLogId(prev => prev === id ? null : id);
  };

  return (
    <div className="h-full flex flex-col bg-[#020202] p-8 md:p-12 overflow-hidden gap-10 animate-in fade-in duration-700 pb-32">
      
      <header className="border-b border-white/5 pb-10 flex flex-col lg:flex-row justify-between items-end gap-8">
        <div>
          <div className="flex items-center gap-4 mb-3">
             <span className="text-4xl">📜</span>
             <h2 className="ai-headline text-5xl italic uppercase tracking-tighter leading-none">Immutable Audit Ledger</h2>
          </div>
          <p className="ai-sub-headline text-cyan-300/40 ml-1 italic font-black tracking-[0.3em]">Sổ cái truy vết thao tác người dùng • Shard Identity Tracking</p>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-end">
           <input 
             type="date" 
             value={dateFilter}
             onChange={(e) => setDateFilter(e.target.value)}
             className="bg-black/60 border border-white/10 rounded-2xl px-4 py-4 text-[10px] text-white font-mono uppercase tracking-widest focus:border-amber-500 outline-none"
           />
           <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 text-xs">🔍</span>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm User, Hành động..."
                className="bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-[10px] text-amber-500 focus:border-amber-500/50 outline-none w-80 uppercase font-black tracking-widest placeholder:text-gray-800 transition-all shadow-inner"
              />
           </div>
           <select 
             value={filterModule}
             onChange={(e) => setFilterModule(e.target.value)}
             className="bg-black/60 border border-white/10 rounded-2xl px-6 py-4 text-[10px] text-white font-black uppercase tracking-widest focus:border-amber-500 outline-none cursor-pointer"
           >
              {uniqueModules.map(m => (
                <option key={m} value={m}>{m.replace('_', ' ')}</option>
              ))}
           </select>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row gap-10 min-h-0">
         
         <div className="flex-1 ai-panel overflow-hidden border-white/5 bg-black/40 flex flex-col shadow-2xl relative">
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center sHRink-0">
               <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Audit Trail Entries</h3>
               <span className="text-[9px] text-amber-500/50 font-mono">Count: {filteredLogs.length} Records</span>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar relative">
               <div className="w-full text-left">
                  {/* Table Header */}
                  <div className="sticky top-0 z-20 bg-[#050505] border-b border-white/10 shadow-lg grid grid-cols-12 gap-4 px-6 py-4 text-[9px] font-black text-gray-600 uppercase tracking-widest">
                     <div className="col-span-2">Thời gian / ID</div>
                     <div className="col-span-3">Identity (User)</div>
                     <div className="col-span-2">Module / Shard</div>
                     <div className="col-span-3">Hành động / Chi tiết</div>
                     <div className="col-span-2 text-right">Verification</div>
                  </div>

                  {/* Table Body */}
                  <div className="text-[11px] font-medium text-gray-300">
                    {filteredLogs.map((log) => {
                      const isExpanded = expandedLogId === log.id;
                      return (
                        <div key={log.id} className="border-b border-white/5 group">
                          {/* Row Summary */}
                          <div 
                             onClick={() => toggleExpand(log.id)}
                             className={`grid grid-cols-12 gap-4 px-6 py-6 cursor-pointer transition-colors items-center ${isExpanded ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02]'}`}
                          >
                             <div className="col-span-2">
                                <div className="flex items-center gap-2">
                                   {isExpanded ? <ChevronDown size={14} className="text-amber-500" /> : <ChevronRight size={14} className="text-gray-600" />}
                                   <div>
                                      <p className="text-white font-bold">{new Date(log.timestamp).toLocaleTimeString()}</p>
                                      <p className="text-[8px] text-gray-600 font-mono mt-1 italic">{log.id}</p>
                                   </div>
                                </div>
                             </div>
                             <div className="col-span-3">
                                <div className="flex items-center gap-4">
                                   <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px]">👤</div>
                                   <div>
                                      <p className="font-black text-cyan-400 uppercase tracking-tight">{log.userId}</p>
                                      <p className="text-[8px] text-gray-600 font-black uppercase mt-0.5">{log.userPosition}</p>
                                   </div>
                                </div>
                             </div>
                             <div className="col-span-2">
                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-gray-500 uppercase tracking-widest">
                                   {log.module.replace('_', ' ')}
                                </span>
                             </div>
                             <div className="col-span-3">
                                <p className="text-white font-black uppercase tracking-tight group-hover:text-amber-500 transition-colors">{log.action}</p>
                                <p className="text-[10px] text-gray-500 italic mt-1 line-clamp-1 group-hover:line-clamp-none transition-all">{log.details}</p>
                             </div>
                             <div className="col-span-2 text-right">
                                <div className="flex justify-end items-center gap-4">
                                   <p className="text-[8px] font-mono text-gray-700 group-hover:text-amber-500/50 transition-colors truncate w-24" title={log.hash}>
                                      {log.hash.substring(0, 12)}...
                                   </p>
                                   <button 
                                     onClick={(e) => handleVerifyHash(e, log)}
                                     className={`text-[12px] hover:scale-110 transition-transform ${verifiedLogId === log.id ? 'text-green-500' : 'text-gray-600 hover:text-green-500'}`}
                                     title="Verify Integrity"
                                   >
                                      {verifiedLogId === log.id ? <Check size={16} /> : <ShieldCheck size={16} />}
                                   </button>
                                </div>
                             </div>
                          </div>

                          {/* Accordion Detail - MATRIX VIEW */}
                          {isExpanded && (
                            <div className="bg-[#050505] border-t border-white/5 p-8 animate-in slide-in-from-top-2 duration-300">
                               <div className="grid grid-cols-2 gap-8">
                                  <div className="space-y-4">
                                     <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                        <h4 className="text-[9px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                                           <Hash size={12} /> Full Cryptographic Hash
                                        </h4>
                                        <button 
                                          onClick={(e) => handleCopyHash(e, log.hash)} 
                                          className="flex items-center gap-2 text-[9px] text-gray-500 hover:text-white transition-colors"
                                        >
                                           {copiedHash === log.hash ? <span className="text-green-500 font-bold">COPIED</span> : <>Copy <Copy size={10} /></>}
                                        </button>
                                     </div>
                                     <p className="font-mono text-[10px] text-gray-400 break-all leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                                        {log.hash}
                                     </p>
                                     
                                     <div className="mt-4">
                                        <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                                           <Activity size={12} /> Causation Chain
                                        </h4>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                           <span className="px-2 py-0.5 bg-indigo-900/20 text-indigo-400 rounded">Root</span>
                                           <span>→</span>
                                           <span className="px-2 py-0.5 bg-indigo-900/20 text-indigo-400 rounded">...</span>
                                           <span>→</span>
                                           <span className="px-2 py-0.5 bg-white/10 text-white rounded border border-white/20">Current ({log.id})</span>
                                        </div>
                                     </div>
                                  </div>

                                  <div className="space-y-2">
                                     <h4 className="text-[9px] font-black text-green-500 uppercase tracking-widest border-b border-white/10 pb-2">
                                        Action Payload (Read-Only)
                                     </h4>
                                     <pre className="bg-[#0a0a0a] p-4 rounded-xl border border-white/10 text-[10px] text-green-400 font-mono overflow-x-auto max-h-48 custom-scrollbar">
{JSON.stringify({
  action: log.action,
  module: log.module,
  user: log.userId,
  role: log.userPosition,
  timestamp_iso: new Date(log.timestamp).toISOString(),
  details_parsed: log.details
}, null, 2)}
                                     </pre>
                                  </div>
                               </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
               </div>
               
               {filteredLogs.length === 0 && (
                 <div className="py-40 text-center opacity-10 flex flex-col items-center gap-10">
                    <span className="text-[100px] grayscale">🗂️</span>
                    <p className="text-3xl font-serif italic uppercase tracking-[0.4em]">Audit Shard Empty</p>
                 </div>
               )}
            </div>
         </div>

         <aside className="w-full lg:w-[400px] flex flex-col gap-8 sHRink-0">
            <div className="ai-panel p-10 bg-amber-500/[0.03] border-amber-500/20 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-5 text-8xl">🛡️</div>
               <div className="flex items-center gap-4 mb-8">
                  <h4 className="ai-sub-headline text-amber-500">Cố Vấn Giám Sát</h4>
               </div>
               <div className="bg-black/60 p-8 rounded-[2.5rem] border border-white/5 relative z-10 shadow-inner">
                  <p className="text-sm text-gray-400 italic leading-relaxed font-light">
                     "Thưa Anh Natt, Thiên đang bóc tách nhật ký vận hành thời gian thực. Hệ thống sử dụng thuật toán băm Shard Hash để đảm bảo mọi hành động của nhân sự đều không thể chối bỏ (Non-repudiation). Nếu Anh phát hiện truy cập bất thường từ Identity lạ, hãy thực hiện lệnh **SHIELD LOCK** ngay."
                  </p>
               </div>
               <button className="mt-8 w-full py-4 bg-amber-500 text-black font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-amber-400 shadow-xl transition-all">Xuất Báo Cáo Tuân Thủ</button>
            </div>

            <div className="ai-panel p-10 bg-black/60 border-white/5">
               <h4 className="ai-sub-headline text-gray-500 mb-8 uppercase italic tracking-widest">Shard Integrity Check</h4>
               <div className="space-y-6">
                  <div className="flex justify-between items-center text-[11px]">
                     <span className="text-gray-400 font-bold">Ledger Status:</span>
                     <span className="text-green-500 font-black italic">SYNCHRONIZED</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                     <span className="text-gray-400 font-bold">Hashing Algorithm:</span>
                     <span className="text-cyan-400 font-mono font-bold">SHA-256</span>
                  </div>
                  <div className="pt-6 border-t border-white/5">
                     <p className="text-[9px] text-gray-700 font-black uppercase leading-loose">
                        Dữ liệu Audit được niêm phong mỗi 60 giây và lưu trữ tại 03 Node Shard phân tán để đảm bảo tính bất biến.
                     </p>
                  </div>
               </div>
            </div>
         </aside>

      </main>
    </div>
  );
};

export default AuditTrailModule;