
import React, { useState, useEffect } from 'react';
import { ProductionJobBag, OrderStatus, PersonaID } from '../types';
import { ProductionEngine } from '../services/productionEngine';
import { NotifyBus } from '../services/notificationService';
import AIAvatar from './AIAvatar';
import { AlertCircle, Gauge, Save, ArrowRight, ShieldAlert, CheckCircle } from 'lucide-react';

const ProductionManager: React.FC = () => {
  const [jobBags, setJobBags] = useState<ProductionJobBag[]>([
    { id: 'JB-2026-001', sku: 'NNA-ROLEX-SUPREME', customerName: 'Anh Natt', status: OrderStatus.MATERIAL_ISSUED, issuedWeight: 12.5, deadline: Date.now() + 86400000 * 7, workerId: 'Bùi Cao Sơn' },
    { id: 'JB-2026-002', sku: 'NNU-HALO-QUEEN', customerName: 'Chị Lan', status: OrderStatus.CASTING, issuedWeight: 8.2, deadline: Date.now() + 86400000 * 5, workerId: 'Nguyễn Văn Vẹn' }
  ]);

  const [selectedJob, setSelectedJob] = useState<ProductionJobBag | null>(null);
  const [inputWeight, setInputWeight] = useState({ btp: 0, recovery: 0 });

  const handleUpdateWeight = () => {
    if (!selectedJob) return;

    // 🛠️ Fixed: cast to ProductionJobBag to satisfy parameter type strictly
    const nextStatus = ProductionEngine.determineNextStatus({
        ...(selectedJob as ProductionJobBag),
        btpWeight: inputWeight.btp,
        recoveryWeight: inputWeight.recovery
    });

    setJobBags(prev => prev.map(jb => jb.id === selectedJob.id ? { 
        ...jb, 
        btpWeight: inputWeight.btp, 
        recoveryWeight: inputWeight.recovery,
        status: nextStatus
    } : jb));

    if (nextStatus === OrderStatus.CASTING_LOSS_ALERT || nextStatus === OrderStatus.TOTAL_LOSS_LOCKED) {
        NotifyBus.push({
            type: 'RISK',
            title: 'HAO HỤT VƯỢT ĐỊNH MỨC',
            content: `Lệnh ${selectedJob.id} bị kẹt tại ${nextStatus}. Cần Anh duyệt để giải phóng nguyên liệu.`,
            persona: PersonaID.KRIS,
            priority: 'HIGH'
        });
    }

    setSelectedJob(null);
    setInputWeight({ btp: 0, recovery: 0 });
  };

  const getStatusStyle = (status: OrderStatus) => {
    if (status === OrderStatus.CASTING_LOSS_ALERT || status === OrderStatus.TOTAL_LOSS_LOCKED) return 'bg-red-500/10 text-red-500 border-red-500/30';
    if (status === OrderStatus.COMPLETED) return 'bg-green-500/10 text-green-500 border-green-500/30';
    return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
  };

  return (
    <div className="h-full flex flex-col p-8 lg:p-12 overflow-hidden gap-10 bg-[#020202] animate-in fade-in duration-700">
      <header className="flex justify-between items-end border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-4 mb-3">
             <span className="px-3 py-1 bg-amber-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest animate-pulse shadow-lg">Production Ledger v2026</span>
             <h2 className="ai-headline text-5xl italic uppercase tracking-tighter leading-none">Trung tâm Chế tác</h2>
          </div>
          <p className="ai-sub-headline text-cyan-300/40 ml-1 italic font-black tracking-[0.4em]">Giám sát luồng nguyên liệu & Cảnh báo rò rỉ vàng</p>
        </div>
        
        <div className="flex items-center gap-6 bg-black/40 p-4 rounded-3xl border border-white/5">
            <div className="text-right">
                <p className="text-[9px] text-gray-500 uppercase font-black">Hao hụt TB</p>
                <p className="text-xl font-mono text-white font-bold">1.24%</p>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-right">
                <p className="text-[9px] text-gray-500 uppercase font-black">Job Bags</p>
                <p className="text-xl font-mono text-amber-500 font-bold">{jobBags.length}</p>
            </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-10 min-h-0">
         <div className="xl:col-span-2 ai-panel overflow-hidden border-white/5 bg-black/40 flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
               <h3 className="text-sm font-bold text-white uppercase italic tracking-widest flex items-center gap-3">
                  <Gauge size={16} className="text-amber-500" />
                  Active Job Bag Stream
               </h3>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar">
               <table className="w-full text-left text-[11px]">
                  <thead>
                     <tr className="text-gray-500 font-black uppercase tracking-widest border-b border-white/10 bg-black">
                        <th className="p-6">Mã Job / SKU</th>
                        <th className="p-6">Thợ phụ trách</th>
                        <th className="p-6">Phát đi (Chỉ)</th>
                        <th className="p-6">Trạng thái</th>
                        <th className="p-6 text-right">Tác vụ</th>
                     </tr>
                  </thead>
                  <tbody className="text-gray-300">
                     {jobBags.map(job => (
                       <tr key={job.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                          <td className="p-6">
                             <p className="font-bold text-white uppercase group-hover:text-amber-500 transition-colors">{job.id}</p>
                             <p className="text-[9px] text-gray-600 font-mono mt-1 italic">{job.sku}</p>
                          </td>
                          <td className="p-6">
                             <span className="text-indigo-400 font-bold">{job.workerId || 'Chưa gán'}</span>
                          </td>
                          <td className="p-6 font-mono text-lg">{job.issuedWeight}</td>
                          <td className="p-6">
                             <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border flex items-center gap-2 w-fit ${getStatusStyle(job.status)}`}>
                                {job.status === OrderStatus.TOTAL_LOSS_LOCKED && <ShieldAlert size={10} />}
                                {job.status.replace('_', ' ')}
                             </span>
                          </td>
                          <td className="p-6 text-right">
                             <button 
                                onClick={() => setSelectedJob(job)}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase hover:bg-indigo-500 shadow-lg active:scale-95"
                             >
                                CẬP NHẬT CÂN
                             </button>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         <div className="space-y-8 flex flex-col">
            {selectedJob ? (
               <div className="ai-panel p-10 bg-black border-amber-500/20 shadow-2xl animate-in slide-in-from-right-10 flex flex-col gap-8">
                  <h3 className="text-2xl font-serif gold-gradient italic uppercase tracking-tighter">Đối soát công đoạn</h3>
                  <div className="space-y-6">
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Job Identity</p>
                        <p className="text-sm font-bold text-white uppercase">{selectedJob.sku}</p>
                        <p className="text-xs text-amber-500 italic mt-1">Cân phát: {selectedJob.issuedWeight} chỉ</p>
                     </div>
                     
                     <div className="space-y-4">
                        <div>
                           <label className="text-[10px] text-gray-500 uppercase font-black ml-2 mb-2 block">Cân sau chế tác (BTP)</label>
                           <input 
                             type="number" 
                             value={inputWeight.btp}
                             onChange={e => setInputWeight({...inputWeight, btp: parseFloat(e.target.value)})}
                             className="w-full bg-black border border-white/10 p-5 rounded-2xl text-xl font-mono text-white outline-none focus:border-amber-500 shadow-inner" 
                             placeholder="0.00"
                           />
                        </div>
                        <div>
                           <label className="text-[10px] text-gray-500 uppercase font-black ml-2 mb-2 block">Vàng thu hồi (Ti/Bụi)</label>
                           <input 
                             type="number" 
                             value={inputWeight.recovery}
                             onChange={e => setInputWeight({...inputWeight, recovery: parseFloat(e.target.value)})}
                             className="w-full bg-black border border-white/10 p-5 rounded-2xl text-xl font-mono text-white outline-none focus:border-cyan-500 shadow-inner" 
                             placeholder="0.00"
                           />
                        </div>
                     </div>
                  </div>

                  <div className="mt-4 pt-6 border-t border-white/5">
                     <button 
                        onClick={handleUpdateWeight}
                        className="w-full py-5 bg-amber-500 text-black font-black text-[11px] uppercase tracking-[0.4em] rounded-[2rem] hover:bg-amber-400 transition-all flex items-center justify-center gap-3 active:scale-95"
                     >
                        <Save size={16}/> NIÊM PHONG SHARD
                     </button>
                  </div>
               </div>
            ) : (
               <div className="ai-panel p-10 bg-indigo-500/5 border-indigo-500/20 shadow-2xl flex-1 flex flex-col justify-center items-center text-center opacity-40">
                  <span className="text-8xl mb-8 grayscale animate-pulse">💎</span>
                  <p className="text-2xl font-serif gold-gradient italic">Xưởng Đang Chờ...</p>
                  <p className="text-[10px] text-gray-500 mt-4 uppercase font-black tracking-[0.3em]">Chọn một Job Bag để bắt đầu bóc tách hao hụt</p>
               </div>
            )}

            <div className="ai-panel p-8 bg-black border-white/5 flex items-center gap-6">
                <AIAvatar personaId={PersonaID.THIEN} size="sm" isThinking={false} />
                <p className="text-[11px] text-gray-400 italic leading-relaxed">
                   "Thưa Anh Natt, quy chuẩn 2.3% tổng hao hụt là ranh giới thép. Nếu vượt qua, Thiên sẽ tự động khóa Job Bag và gửi tín hiệu đỏ tới Kris để rà soát hành vi thợ."
                </p>
            </div>
         </div>
      </main>
    </div>
  );
};

export default ProductionManager;
