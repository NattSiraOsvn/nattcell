
import React from 'react';

interface FilterPanelProps {
  filters: any;
  onFilterChange: (filters: any) => void;
  suppliers?: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, suppliers = [] }) => {
  const categories = ['Trang sức Nam', 'Trang sức Nữ', 'Kim cương rời', 'BST I LIKE IT'];

  return (
    <div className="w-80 h-full glass border-r border-white/5 flex flex-col p-8 hidden xl:flex shrink-0 bg-black">
      <div className="mb-12">
         <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] mb-3">Phân loại Tri thức</h3>
         <p className="text-white font-serif italic text-2xl gold-gradient">Bộ lọc Master</p>
      </div>

      <div className="flex-1 space-y-10 overflow-y-auto no-scrollbar pb-10">
         <div className="space-y-4">
            <h4 className="ai-sub-headline text-amber-500">Danh mục Sản phẩm</h4>
            <div className="space-y-2">
               {categories.map(cat => (
                 <button
                   key={cat}
                   onClick={() => onFilterChange({ ...filters, category: filters.category === cat ? '' : cat })}
                   className={`w-full text-left px-5 py-3 rounded-xl text-[11px] transition-all border ${filters.category === cat ? 'bg-amber-500/20 text-amber-500 border-amber-500/30' : 'bg-white/5 text-gray-500 border-white/5 hover:text-white'}`}
                 >
                   {cat}
                 </button>
               ))}
            </div>
         </div>

         {suppliers.length > 0 && (
           <div className="space-y-4">
              <h4 className="ai-sub-headline text-indigo-400">Nhà cung cấp (Nodes)</h4>
              <div className="space-y-2">
                 {suppliers.map(sup => (
                   <button
                     key={sup}
                     onClick={() => onFilterChange({ ...filters, supplierName: filters.supplierName === sup ? '' : sup })}
                     className={`w-full text-left px-5 py-3 rounded-xl text-[11px] transition-all border ${filters.supplierName === sup ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'bg-white/5 text-gray-500 border-white/5 hover:text-white'}`}
                   >
                     {sup}
                   </button>
                 ))}
              </div>
           </div>
         )}

         <div className="space-y-4">
            <h4 className="ai-sub-headline text-amber-500">Khoảng giá (VND)</h4>
            <div className="space-y-6 px-2">
               <input 
                 type="range" 
                 min="0" 
                 max="500000000" 
                 step="10000000"
                 value={filters.maxPrice}
                 onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
                 className="w-full accent-amber-500"
               />
               <div className="flex justify-between text-[10px] font-mono text-gray-500">
                  <span>0</span>
                  <span className="text-white font-bold">{(filters.maxPrice / 1000000).toFixed(0)} Triệu</span>
                  <span>500T</span>
               </div>
            </div>
         </div>

         <div className="space-y-4">
            <h4 className="ai-sub-headline text-amber-500">Xác thực Node</h4>
            <div className="space-y-3">
               <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={filters.verifiedOnly} onChange={e => onFilterChange({...filters, verifiedOnly: e.target.checked})} className="w-4 h-4 rounded border-white/10 accent-amber-500 bg-white/5" />
                  <span className="text-[10px] font-black text-gray-500 group-hover:text-white uppercase transition-colors">Chỉ nhà cung cấp Đã xác minh</span>
               </label>
               <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={filters.tradeAssurance} onChange={e => onFilterChange({...filters, tradeAssurance: e.target.checked})} className="w-4 h-4 rounded border-white/10 accent-amber-500 bg-white/5" />
                  <span className="text-[10px] font-black text-gray-500 group-hover:text-white uppercase transition-colors">Có Bảo vệ Giao dịch</span>
               </label>
            </div>
         </div>

         <button 
           onClick={() => onFilterChange({ category: '', minPrice: 0, maxPrice: 500000000, verifiedOnly: false, tradeAssurance: false, supplierName: '', searchTerm: '' })}
           className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-gray-500 uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all"
         >
           Đặt lại Bộ lọc
         </button>
      </div>

      <div className="pt-8 border-t border-white/5 text-[9px] text-gray-700 italic">
         "Hệ thống tự động lọc các mã SP GIA tiêu chuẩn cao nhất cho Anh Natt." — CAN
      </div>
    </div>
  );
};

export default FilterPanel;
