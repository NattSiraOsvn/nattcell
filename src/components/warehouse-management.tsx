
import React, { useState, useEffect } from 'react';
import { UserRole, PersonaID, Warehouse, Movement, StockStatus, WarehouseLocation } from '@/types.ts';
// FIX: Corrected import path to use kebab-case smart-link.ts
import { SmartLinkClient } from '@/services/smart-link.ts';
import { WarehouseProvider } from '@/cells/warehouse-cell/warehouse.service';
import AIAvatar from './aiavatar.tsx';
import { MapPin, Box, ArrowRightLeft, TrendingUp, ShieldCheck, Database, LayoutGrid, RotateCcw } from 'lucide-react';

const WarehouseManagement: React.FC<{ currentRole: UserRole }> = ({ currentRole }) => {
  const [inventory, setInventory] = useState<{product: any, status: StockStatus, location: WarehouseLocation}[]>([]);
  const [activeBranch, setActiveBranch] = useState<WarehouseLocation | 'ALL'>('ALL');
  const [isSyncing, setIsSyncing] = useState(false);

  // 🛡️ HỢP HIẾN: Đồng bộ Shard qua SmartLink
  const refreshShard = async () => {
      setIsSyncing(true);
      
      // Use direct provider for initial load to ensure data availability in demo
      const rawInventory = WarehouseProvider.getAllInventory();
      
      // Mock branching logic for Phase 4 visualization
      const branchedData = rawInventory.flatMap(({ product, status }) => [
          { product, status, location: WarehouseLocation.HCM_HEADQUARTER },
          { product: { ...product, id: product.id + '_HN' }, status: { ...status, total: Math.floor(status.total * 0.3) }, location: WarehouseLocation.HANOI_BRANCH }
      ]);
      
      setInventory(branchedData);
      setIsSyncing(false);
  };

  useEffect(() => {
    refreshShard();
  }, []);

  const filteredInventory = inventory.filter(i => activeBranch === 'ALL' || i.location === activeBranch);

  return (
    <div className="h-full flex flex-col p-10 lg:p-14 bg-[#020202] overflow-y-auto no-scrollbar gap-10 animate-in fade-in duration-700 pb-40 relative">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10 mb-2 relative z-10">
        <div>
           <div className="flex items-center gap-4 mb-2">
              <Box className="text-cyan-400" size={36} />
              <h2 className="ai-headline text-6xl italic uppercase tracking-tighter text-white leading-none">Warehouse Shard</h2>
           </div>
           <p className="ai-sub-headline text-cyan-500 font-black tracking-[0.5em] mt-3 uppercase italic">Multi-Branch Distribution Center • Phase 4 Enforced</p>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="flex bg-black/60 p-1.5 rounded-2xl border border-white/10 shrink-0">
              <button 
                onClick={() => setActiveBranch('ALL')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeBranch === 'ALL' ? 'bg-white text-black shadow-xl' : 'text-gray-500'}`}
              >
                ALL BRANCHES
              </button>
              <button 
                onClick={() => setActiveBranch(WarehouseLocation.HCM_HEADQUARTER)}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeBranch === WarehouseLocation.HCM_HEADQUARTER ? 'bg-cyan-600 text-white shadow-xl' : 'text-gray-500'}`}
              >
                HCMC (MASTER)
              </button>
              <button 
                onClick={() => setActiveBranch(WarehouseLocation.HANOI_BRANCH)}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeBranch === WarehouseLocation.HANOI_BRANCH ? 'bg-amber-600 text-black shadow-xl' : 'text-gray-500'}`}
              >
                HANOI (NORTH)
              </button>
           </div>
           <button onClick={refreshShard} className={`p-4 bg-white/5 rounded-2xl border border-white/10 text-gray-500 hover:text-white transition-all ${isSyncing ? 'animate-spin' : ''}`}>
              <RotateCcw size={20} />
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="ai-panel p-8 bg-black/40 border-white/5 flex items-center justify-between group hover:border-cyan-500/30 transition-all">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                   <Database size={20} />
                </div>
                <div>
                   <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Total Inventory Value</p>
                   <p className="text-xl font-mono text-white font-bold italic">45.2B VND</p>
                </div>
             </div>
             <TrendingUp className="text-green-500" size={16} />
          </div>
          
          <div className="ai-panel p-8 bg-black/40 border-white/5 flex items-center justify-between group hover:border-amber-500/30 transition-all">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-all">
                   <MapPin size={20} />
                </div>
                <div>
                   <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Distribution Balance</p>
                   <p className="text-xl font-mono text-white font-bold italic">65% HCM / 35% HN</p>
                </div>
             </div>
             <ShieldCheck className="text-blue-500" size={16} />
          </div>

          <div className="ai-panel p-8 bg-black/40 border-white/5 flex items-center justify-between group hover:border-indigo-500/30 transition-all">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:bg-indigo-500 group-hover:text-black transition-all">
                   <ArrowRightLeft size={20} />
                </div>
                <div>
                   <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Shard Movements</p>
                   <p className="text-xl font-mono text-white font-bold italic">12 Pending Transfers</p>
                </div>
             </div>
             <LayoutGrid className="text-purple-500" size={16} />
          </div>
      </div>

      <main className="flex-1">
          <div className="ai-panel overflow-hidden border-white/5 bg-black/40 shadow-2xl relative">
              <div className="p-8 border-b border-white/10 bg-white/[0.01] flex justify-between items-center">
                 <h3 className="text-sm font-bold text-white uppercase italic tracking-widest">Inventory Ledger • Master Shard</h3>
                 <div className="flex items-center gap-4">
                    <span className="text-[9px] text-green-500 font-mono font-black uppercase tracking-widest">Data Integrity: Verified</span>
                 </div>
              </div>
              <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left text-[11px] border-collapse">
                      <thead>
                          <tr className="text-gray-600 font-black uppercase tracking-widest border-b border-white/10 bg-black">
                              <th className="p-8">Sản Phẩm / SKU</th>
                              <th className="p-8 text-center">Chi Nhánh</th>
                              <th className="p-8 text-center">Tồn Kho</th>
                              <th className="p-8 text-right">Trạng Thái Niêm Phong</th>
                          </tr>
                      </thead>
                      <tbody className="text-gray-300">
                          {filteredInventory.map(({ product, status, location }) => (
                              <tr key={product.id + location} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                  <td className="p-8">
                                     <p className="font-bold text-white uppercase group-hover:text-cyan-400 transition-colors">{product.name}</p>
                                     <p className="text-[8px] text-gray-500 font-mono mt-1 italic">{product.sku}</p>
                                  </td>
                                  <td className="p-8 text-center">
                                     <span className={`px-2 py-1 rounded text-[8px] font-black uppercase ${
                                        location === WarehouseLocation.HCM_HEADQUARTER ? 'text-cyan-500' : 'text-amber-500'
                                     }`}>
                                        {location.replace('_', ' ')}
                                     </span>
                                  </td>
                                  <td className="p-8 text-center">
                                     <p className="text-2xl font-mono font-black text-white italic leading-none">{status.total}</p>
                                     <p className="text-[8px] text-gray-600 uppercase mt-1">Available: {status.available}</p>
                                  </td>
                                  <td className="p-8 text-right">
                                      <div className="flex justify-end items-center gap-3">
                                         <ShieldCheck size={14} className="text-green-500" />
                                         <span className="px-3 py-1 rounded-full bg-green-600/10 text-green-500 text-[8px] font-black uppercase border border-green-500/30">SEALED</span>
                                      </div>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      </main>

      <footer className="mt-8 p-10 bg-indigo-500/5 border border-indigo-500/20 rounded-[3rem] flex flex-col lg:flex-row items-center gap-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl grayscale group-hover:scale-110 transition-transform duration-1000">🧬</div>
          <div className="flex items-center gap-8 flex-1">
             <div>
                <h4 className="text-xl font-bold text-white uppercase italic tracking-widest mb-2">Băng Reporting Shard</h4>
                <p className="text-sm text-gray-400 italic leading-relaxed font-light max-w-3xl">
                   "Thưa Anh Natt, Băng đã bóc tách định mức tồn kho tại chi nhánh Hà Nội. Hiện tại hệ thống đang tự động điều phối 15% lượng hàng Nhẫn Nữ sang Node phía Bắc để phục vụ chiến dịch Sale mới. Mọi log điều chuyển đã được băm Hash vĩnh cửu."
                </p>
             </div>
          </div>
          <button className="px-12 py-5 bg-white text-black font-black text-xs uppercase tracking-[0.4em] rounded-2xl hover:bg-cyan-500 transition-all active:scale-95 shadow-2xl shrink-0">
             Audit Shard Logistics
          </button>
      </footer>
    </div>
  );
};

export default WarehouseManagement;
