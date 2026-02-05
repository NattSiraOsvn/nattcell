
import React, { useState } from 'react';
/* Fix: Import SalesChannel, WarehouseLocation from types directly */
import { SalesChannel, WarehouseLocation } from '../types';

const SalesArchitectureView: React.FC = () => {
  const [activeChannel, setActiveChannel] = useState<string | null>(null);

  const channels = [
    { id: SalesChannel.DIRECT_SALE, label: 'Bán Tại Showroom', icon: '💎', color: 'text-amber-500', desc: 'Giao dịch trực tiếp, thanh toán POS, in hóa đơn tại chỗ.' },
    { id: SalesChannel.ONLINE, label: 'E-Commerce / Livestream', icon: '📹', color: 'text-pink-500', desc: 'Đơn hàng từ Website/Social, đồng bộ kho online.' },
    { id: SalesChannel.LOGISTICS, label: 'Đối tác Vận chuyển', icon: '🚚', color: 'text-blue-500', desc: 'Giao hàng COD, tích hợp API GHN/Viettel Post.' },
    { id: SalesChannel.WHOLESALE, label: 'Đại lý / Bán sỉ', icon: '🏢', color: 'text-purple-500', desc: 'Bán buôn số lượng lớn, chiết khấu theo Tier đại lý.' }
  ];

  const warehouses = [
    { id: WarehouseLocation.HCM_HEADQUARTER, label: 'KHO TỔNG HCM', stock: '85%' },
    { id: WarehouseLocation.HANOI_BRANCH, label: 'CN HÀ NỘI', stock: '45%' },
    { id: WarehouseLocation.DA_NANG_BRANCH, label: 'CN ĐÀ NẴNG', stock: '30%' }
  ];

  const logicSteps = [
    { id: 1, title: 'Pricing Engine', desc: 'Tính giá GĐB, Thuế, KM' },
    { id: 2, title: 'Inventory Check', desc: 'Khóa tồn kho (Soft Lock)' },
    { id: 3, title: 'Payment Gate', desc: 'Xác thực thanh toán / Cọc' },
    { id: 4, title: 'Commission', desc: 'Tính hoa hồng Seller & KPI' },
    { id: 5, title: 'Invoice/Logistics', desc: 'Xuất hóa đơn & Vận đơn' }
  ];

  return (
    <div className="p-8 md:p-12 h-full overflow-y-auto no-scrollbar bg-[#020202] animate-in fade-in duration-700 pb-32">
      <header className="mb-12 border-b border-white/5 pb-8">
        <div className="flex items-center gap-4 mb-2">
           <span className="text-4xl">🏢</span>
           <h2 className="ai-headline text-5xl italic uppercase tracking-tighter">Sales & Distribution Core</h2>
        </div>
        <p className="ai-sub-headline text-gray-500 font-black tracking-[0.3em] ml-1">Kiến trúc hệ thống phân phối đa kênh • Định giá GĐB</p>
      </header>

      {/* CHANNELS LAYER */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 relative z-10">
         {channels.map(ch => (
           <div 
             key={ch.id} 
             onMouseEnter={() => setActiveChannel(ch.id)}
             onMouseLeave={() => setActiveChannel(null)}
             className={`p-6 rounded-[2.5rem] border transition-all cursor-pointer group relative overflow-hidden ${
               activeChannel === ch.id ? 'bg-white/[0.05] border-white/20 scale-105 shadow-2xl' : 'bg-black/40 border-white/5'
             }`}
           >
              <div className={`absolute top-0 left-0 w-full h-1 ${ch.color.replace('text', 'bg')}`}></div>
              <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">{ch.icon}</div>
              <h3 className={`text-sm font-black uppercase tracking-widest mb-2 ${ch.color}`}>{ch.label}</h3>
              <p className="text-[10px] text-gray-500 leading-relaxed font-light">{ch.desc}</p>
              
              {/* Connection Line Animation */}
              {activeChannel === ch.id && (
                 <div className="absolute bottom-0 left-1/2 w-0.5 h-10 bg-gradient-to-b from-white/20 to-white/5"></div>
              )}
           </div>
         ))}
      </div>

      {/* LOGIC ENGINE LAYER */}
      <div className="ai-panel p-10 bg-gradient-to-r from-indigo-900/10 to-purple-900/10 border-indigo-500/20 mb-16 relative">
         <h3 className="text-center text-indigo-400 font-black uppercase tracking-[0.5em] mb-10 text-xs">Sales Core Engine Processing</h3>
         
         <div className="flex flex-wrap justify-center gap-4 md:gap-10 relative z-10">
            {logicSteps.map((step, i) => (
               <div key={step.id} className="flex items-center">
                  <div className={`w-32 p-4 bg-black/60 border border-white/10 rounded-2xl text-center transition-all ${
                     activeChannel ? 'border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : ''
                  }`}>
                     <p className="text-[9px] text-gray-500 font-bold mb-1">Step {step.id}</p>
                     <p className="text-[10px] text-white font-black uppercase">{step.title}</p>
                  </div>
                  {i < logicSteps.length - 1 && (
                     <div className="w-8 h-0.5 bg-white/10 mx-2 md:mx-4 relative">
                        <div className={`absolute top-0 left-0 h-full bg-indigo-500 transition-all duration-1000 ${activeChannel ? 'w-full' : 'w-0'}`}></div>
                     </div>
                  )}
               </div>
            ))}
         </div>
      </div>

      {/* WAREHOUSE DISTRIBUTION LAYER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {warehouses.map(wh => (
            <div key={wh.id} className="ai-panel p-8 bg-black/40 border-white/5 flex items-center justify-between group hover:border-amber-500/30 transition-all">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🏭</div>
                  <div>
                     <h4 className="text-white font-bold text-xs uppercase tracking-widest">{wh.label}</h4>
                     <p className="text-[9px] text-gray-500 mt-1 font-mono">{wh.id}</p>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Capacity</p>
                  <p className="text-xl font-mono font-black text-amber-500">{wh.stock}</p>
               </div>
            </div>
         ))}
      </div>

      <div className="mt-16 text-center opacity-30">
         <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.5em]">Architecture Blueprint v1.0 • Powered by SalesCoreEngine</p>
      </div>
    </div>
  );
};

export default SalesArchitectureView;
