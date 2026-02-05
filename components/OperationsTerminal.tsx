
import React, { useState, useEffect } from 'react';
import { UserRole, UserPosition, SellerReport, LogisticsSolution, TransferOrder } from '../types';
import { LogisticsCore } from '../services/logisticsService';
import AIAvatar from './AIAvatar';
import { PersonaID } from '../types';

interface OperationsTerminalProps {
  currentRole: UserRole;
  currentPosition: UserPosition;
  logAction: (action: string, details: string) => void;
}

const OperationsTerminal: React.FC<OperationsTerminalProps> = ({ currentRole, currentPosition, logAction }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'logistics_ai' | 'internal_transfer'>('logistics_ai');
  
  // Logistics State
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [solutions, setSolutions] = useState<LogisticsSolution[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [transfers, setTransfers] = useState<TransferOrder[]>([]);
  const [showReport, setShowReport] = useState(false);

  // Mock Orders for Logistics
  const pendingShipments = [
    { id: 'ORD-SHIP-01', dest: '21 Lê Trực, Bình Thạnh, HCM', weight: 500, value: 45000000, urgency: true },
    { id: 'ORD-SHIP-02', dest: 'Hoàn Kiếm, Hà Nội', weight: 1200, value: 120000000, urgency: false },
    { id: 'ORD-SHIP-03', dest: 'Hải Châu, Đà Nẵng', weight: 300, value: 25000000, urgency: false }
  ];

  const handleAnalyzeLogistics = async (order: any) => {
    setSelectedOrder(order.id);
    setIsCalculating(true);
    setSolutions([]);
    
    // Simulate AI Processing
    setTimeout(async () => {
      const result = await LogisticsCore.selectOptimalLogistics(
        order.value, 
        order.weight, 
        order.dest, 
        order.urgency
      );
      setSolutions(result);
      setIsCalculating(false);
    }, 1500);
  };

  const handleCreateTransfer = async () => {
    const newTransfer = await LogisticsCore.createInternalTransfer(
        'MAT-GOLD-18K',
        'Vàng 18K Nguyên Liệu',
        500, // grams
        'KHO TỔNG HCM',
        'CN HÀ NỘI'
    );
    setTransfers([newTransfer, ...transfers]);
    logAction('LOGISTICS_TRANSFER_INIT', `Lệnh chuyển kho nội bộ ${newTransfer.transferId} đã được tạo.`);
  };

  return (
    <div className="h-full flex flex-col bg-[#020202] p-8 md:p-12 overflow-y-auto no-scrollbar gap-10 animate-in fade-in duration-700 pb-32 relative">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10">
        <div>
          <h2 className="ai-headline text-5xl italic uppercase tracking-tighter">OPS TERMINAL</h2>
          <p className="ai-sub-headline text-cyan-300/40 mt-3 italic uppercase">Khối Hậu Cần & Nội Vụ • Quy trình bóc tách chứng từ</p>
        </div>
        <div className="flex gap-4 items-center">
           <button onClick={() => setShowReport(true)} className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 shadow-xl transition-all">
              📊 Báo Cáo Hiệu Quả
           </button>
           <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 shrink-0 overflow-x-auto">
             <button onClick={() => setActiveTab('pending')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === 'pending' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}>Chờ duyệt (2)</button>
             <button onClick={() => setActiveTab('logistics_ai')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === 'logistics_ai' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>AI Logistics (3)</button>
             <button onClick={() => setActiveTab('internal_transfer')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === 'internal_transfer' ? 'bg-amber-600 text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>Điều Chuyển Kho</button>
           </div>
        </div>
      </header>

      <main className="flex-1 space-y-8">
        
        {/* LOGISTICS AI TAB */}
        {activeTab === 'logistics_ai' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
             {/* LEFT: ORDER LIST */}
             <div className="space-y-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Đơn hàng chờ vận đơn</h3>
                {pendingShipments.map(order => (
                   <div 
                     key={order.id} 
                     onClick={() => handleAnalyzeLogistics(order)}
                     className={`p-6 rounded-[2rem] border transition-all cursor-pointer group relative overflow-hidden ${selectedOrder === order.id ? 'bg-indigo-500/20 border-indigo-500' : 'bg-black/40 border-white/10 hover:border-indigo-500/50'}`}
                   >
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-[10px] font-black text-white uppercase">{order.id}</span>
                         {order.urgency && <span className="px-2 py-0.5 bg-red-500 text-white text-[8px] font-black rounded uppercase animate-pulse">Gấp</span>}
                      </div>
                      <p className="text-[11px] text-gray-400 truncate mb-4">{order.dest}</p>
                      <div className="flex justify-between items-end">
                         <span className="text-xl font-mono text-white font-bold">{(order.value/1000000).toFixed(1)}M <span className="text-[9px] text-gray-500">VND</span></span>
                         <span className="text-[9px] font-mono text-indigo-400">{order.weight}g</span>
                      </div>
                   </div>
                ))}
             </div>

             {/* CENTER & RIGHT: AI ANALYSIS */}
             <div className="xl:col-span-2 ai-panel p-10 bg-black/40 border-white/10 relative overflow-hidden flex flex-col">
                {selectedOrder ? (
                   <>
                      <div className="flex justify-between items-center mb-10">
                         <div className="flex items-center gap-4">
                            <AIAvatar personaId={PersonaID.PHIEU} size="md" isThinking={isCalculating} />
                            <div>
                               <h3 className="text-2xl font-serif gold-gradient italic uppercase">Phiêu Logistics Advisor</h3>
                               <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Đang tối ưu đa kênh (Multi-Channel Routing)</p>
                            </div>
                         </div>
                      </div>

                      {isCalculating ? (
                         <div className="flex-1 flex flex-col items-center justify-center opacity-50 space-y-6">
                            <div className="w-24 h-24 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-xs font-mono uppercase tracking-widest text-indigo-400">Comparing GHN vs FedEx vs ViettelPost...</p>
                         </div>
                      ) : (
                         <div className="grid grid-cols-1 gap-6 overflow-y-auto no-scrollbar pb-10">
                            {solutions.map((sol, idx) => (
                               <div key={idx} className={`p-6 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${
                                  sol.recommended ? 'bg-gradient-to-r from-green-500/10 to-transparent border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.1)] scale-[1.02]' : 'bg-white/[0.02] border-white/5 opacity-60 hover:opacity-100'
                               }`}>
                                  <div className="flex items-center gap-6">
                                     <div className={`text-2xl font-black w-16 text-center uppercase tracking-tighter ${sol.partnerId === 'FEDEX' ? 'text-purple-500' : sol.partnerId === 'GHN' ? 'text-orange-500' : 'text-red-500'}`}>
                                        {sol.partnerId}
                                     </div>
                                     <div>
                                        <div className="flex items-center gap-3">
                                           <h4 className="text-sm font-bold text-white uppercase">{sol.partnerName}</h4>
                                           {sol.recommended && <span className="px-2 py-0.5 bg-green-500 text-black text-[8px] font-black rounded uppercase">AI Recommended</span>}
                                        </div>
                                        <p className="text-[10px] text-gray-500 mt-1">Dự kiến: {new Date(sol.estimatedDelivery).toLocaleString()}</p>
                                     </div>
                                  </div>

                                  <div className="flex items-center gap-8">
                                     <div className="text-right">
                                        <p className="text-[9px] text-gray-500 font-black uppercase">Độ tin cậy</p>
                                        <div className="flex items-center gap-1 justify-end">
                                           <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                              <div className="h-full bg-blue-500" style={{width: `${sol.reliability}%`}}></div>
                                           </div>
                                           <span className="text-[9px] text-blue-400 font-mono">{sol.reliability}%</span>
                                        </div>
                                     </div>
                                     <div className="text-right w-32">
                                        <p className="text-[9px] text-gray-500 font-black uppercase">Tổng phí</p>
                                        <p className="text-xl font-mono font-black text-white">{sol.totalCost.toLocaleString()} đ</p>
                                     </div>
                                     <button className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${
                                        sol.recommended ? 'bg-green-500 text-black hover:bg-green-400 shadow-lg' : 'border border-white/10 text-gray-400 hover:text-white'
                                     }`}>
                                        Chọn
                                     </button>
                                  </div>
                               </div>
                            ))}
                         </div>
                      )}
                   </>
                ) : (
                   <div className="h-full flex flex-col items-center justify-center opacity-20">
                      <span className="text-9xl mb-6 grayscale">🚚</span>
                      <p className="text-2xl font-serif italic uppercase tracking-widest">Chọn đơn hàng để AI phân tích</p>
                   </div>
                )}
             </div>
          </div>
        )}

        {/* INTERNAL TRANSFER TAB */}
        {activeTab === 'internal_transfer' && (
           <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 animate-in slide-in-from-right-10">
              <div className="ai-panel p-10 bg-amber-500/5 border-amber-500/20 shadow-2xl">
                 <h3 className="text-2xl font-bold italic text-amber-500 uppercase tracking-tighter mb-8">Điều chuyển kho nội bộ</h3>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-black/40 rounded-[2rem] border border-white/5">
                       <div>
                          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Kho Nguồn</p>
                          <p className="text-xl font-bold text-white">KHO TỔNG HCM</p>
                       </div>
                       <span className="text-2xl text-gray-600">➔</span>
                       <div className="text-right">
                          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Kho Đích</p>
                          <p className="text-xl font-bold text-white">CN HÀ NỘI</p>
                       </div>
                    </div>
                    
                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sản phẩm điều chuyển</p>
                       <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center">
                          <span className="text-sm font-mono text-white">MAT-GOLD-18K</span>
                          <span className="text-amber-500 font-black">500 Gram</span>
                       </div>
                    </div>

                    <button onClick={handleCreateTransfer} className="w-full py-5 bg-amber-500 text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-amber-400 shadow-xl active:scale-95 transition-all">
                       TẠO LỆNH CHUYỂN KHO
                    </button>
                 </div>
              </div>

              <div className="space-y-6">
                 <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Lịch sử điều chuyển</h3>
                 {transfers.length === 0 ? (
                    <p className="text-center py-20 text-gray-600 italic">Chưa có lệnh điều chuyển nào.</p>
                 ) : (
                    transfers.map(t => (
                       <div key={t.id} className="p-6 bg-black/40 border border-white/5 rounded-[2rem] flex justify-between items-center group hover:border-amber-500/30 transition-all">
                          <div>
                             <p className="text-[10px] font-black text-amber-500 uppercase">{t.transferId}</p>
                             <p className="text-sm font-bold text-white mt-1">{t.productName}</p>
                             <p className="text-[9px] text-gray-500 mt-1 italic">{t.fromWarehouse} ➔ {t.toWarehouse}</p>
                          </div>
                          <div className="text-right">
                             <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[8px] font-black uppercase border border-blue-500/20">{t.status}</span>
                             <p className="text-[9px] text-gray-600 mt-2 font-mono">{new Date(t.transferDate).toLocaleDateString()}</p>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>
        )}

        {/* PENDING TAB (OLD CONTENT) */}
        {activeTab === 'pending' && (
          <div className="ai-panel p-16 flex flex-col items-center justify-center text-center bg-black/60 border-indigo-500/20 opacity-40">
             <div className="text-[100px] mb-10 grayscale">📝</div>
             <h3 className="ai-headline text-4xl mb-6 italic uppercase tracking-tighter">Document Verification</h3>
             <p className="ai-sub-headline max-w-sm mx-auto leading-relaxed">Chức năng xác thực chứng từ đang chờ đồng bộ...</p>
          </div>
        )}
      </main>

      {/* SLA REPORT MODAL */}
      {showReport && (
         <div className="fixed inset-0 z-[500] flex items-center justify-center p-8 bg-black/90 backdrop-blur-xl animate-in zoom-in-95 duration-300">
            <div className="bg-[#0a0a0a] w-full max-w-4xl p-12 rounded-[4rem] border border-indigo-500/30 relative overflow-hidden shadow-2xl flex flex-col">
               <button onClick={() => setShowReport(false)} className="absolute top-10 right-10 text-3xl text-gray-500 hover:text-white transition-colors">✕</button>
               <h3 className="text-4xl font-serif gold-gradient italic uppercase tracking-tighter mb-12 text-center">Hiệu Quả Logistics (SLA)</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-8 bg-orange-500/10 border border-orange-500/30 rounded-[2.5rem] text-center">
                     <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-4">GHN (Express)</p>
                     <p className="text-3xl font-mono font-black text-white">98.5% <span className="text-sm text-gray-500">On Time</span></p>
                     <p className="text-[9px] text-gray-500 mt-2">Avg Cost: 22k / Order</p>
                  </div>
                  <div className="p-8 bg-red-500/10 border border-red-500/30 rounded-[2.5rem] text-center">
                     <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-4">Viettel Post</p>
                     <p className="text-3xl font-mono font-black text-white">96.2% <span className="text-sm text-gray-500">On Time</span></p>
                     <p className="text-[9px] text-gray-500 mt-2">Avg Cost: 18k / Order</p>
                  </div>
                  <div className="p-8 bg-purple-500/10 border border-purple-500/30 rounded-[2.5rem] text-center">
                     <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-4">FedEx (Intl)</p>
                     <p className="text-3xl font-mono font-black text-white">99.9% <span className="text-sm text-gray-500">On Time</span></p>
                     <p className="text-[9px] text-gray-500 mt-2">Avg Cost: $35 / Order</p>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default OperationsTerminal;
