
import React, { useState, useEffect } from 'react';
import { MarketplaceProduct, UserRole, PersonaID } from '../../types';
import { ProductProvider } from '../../services/ProductService';
import ProductCardMarketplace from './ProductCardMarketplace';
import { Grid, List, Search, SlidersHorizontal, Flame, ChevronRight } from 'lucide-react';

interface Props {
  mode: 'SALES' | 'SELLER';
  currentRole: UserRole;
}

const MarketplaceShelf: React.FC<Props> = ({ mode, currentRole }) => {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [deals, setDeals] = useState<MarketplaceProduct[]>([]);
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const [pData, dData] = await Promise.all([
        ProductProvider.getMarketplaceProducts({}),
        ProductProvider.getHotDeals({ limit: 5 })
      ]);
      setProducts(pData);
      setDeals(dData);
      setIsLoading(false);
    };
    load();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col p-8 lg:p-12 overflow-y-auto no-scrollbar gap-12 bg-[#020202] pb-40 animate-in fade-in duration-700">
      
      {/* HERO / HOT DEALS SECTION */}
      {deals.length > 0 && (
        <section className="space-y-6">
           <div className="flex justify-between items-end border-l-2 border-red-500 pl-6">
              <div>
                 <h2 className="text-3xl font-serif gold-gradient italic uppercase tracking-tighter flex items-center gap-3">
                    <Flame className="text-red-500 animate-pulse" /> 
                    Deal Sốc Hôm Nay
                 </h2>
                 <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Sản phẩm giới hạn • Niêm phong bởi Thiên</p>
              </div>
              <button className="text-xs font-black text-gray-400 hover:text-white flex items-center gap-1 uppercase tracking-widest transition-colors">
                 Xem tất cả <ChevronRight size={14} />
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {deals.map(deal => (
                <div key={deal.id} className="ai-panel p-8 bg-gradient-to-br from-red-950/20 to-transparent border-red-500/20 group hover:border-red-500/40 transition-all">
                   <div className="flex gap-6 items-center">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                         <img src={deal.media.images[0].url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                      </div>
                      <div className="flex-1">
                         <h4 className="text-sm font-bold text-white uppercase truncate">{deal.name}</h4>
                         <p className="text-2xl font-mono font-black text-red-500 mt-1">{deal.salePrice?.toLocaleString()} đ</p>
                         <div className="mt-3 flex items-center gap-2">
                            <span className="text-[9px] text-gray-500 uppercase font-black">Ends in:</span>
                            <span className="text-[10px] font-mono text-white bg-red-600 px-2 py-0.5 rounded animate-pulse">04:25:12</span>
                         </div>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </section>
      )}

      {/* FILTER BAR */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/[0.02] border border-white/5 p-6 rounded-[2.5rem] backdrop-blur-xl shrink-0">
         <div className="flex items-center gap-8 w-full md:w-auto">
            <div className="relative flex-1 md:w-96">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
               <input 
                 type="text" 
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
                 placeholder="Mã SKU, Tên sản phẩm..." 
                 className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-xs text-amber-500 outline-none focus:border-amber-500/50 uppercase font-black tracking-widest transition-all"
               />
            </div>
            <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white transition-all"><SlidersHorizontal size={20}/></button>
         </div>

         <div className="flex items-center gap-6">
            <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10">
               <button onClick={() => setViewMode('GRID')} className={`p-3 rounded-xl transition-all ${viewMode === 'GRID' ? 'bg-amber-500 text-black shadow-lg' : 'text-gray-600 hover:text-white'}`}><Grid size={20}/></button>
               <button onClick={() => setViewMode('LIST')} className={`p-3 rounded-xl transition-all ${viewMode === 'LIST' ? 'bg-amber-500 text-black shadow-lg' : 'text-gray-600 hover:text-white'}`}><List size={20}/></button>
            </div>
            <div className="h-10 w-px bg-white/5"></div>
            <div className="flex gap-3">
               {['Mới nhất', 'Phổ biến', 'Giá: Thấp-Cao'].map(f => (
                  <button key={f} className="px-5 py-2.5 rounded-xl border border-white/5 text-[10px] font-black uppercase text-gray-500 hover:text-white hover:bg-white/5 transition-all">{f}</button>
               ))}
            </div>
         </div>
      </header>

      {/* PRODUCT GRID */}
      <main className="flex-1">
         {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 opacity-20">
               <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-6"></div>
               <p className="text-xl font-serif uppercase tracking-widest">Đang tải Shard Sản phẩm...</p>
            </div>
         ) : (
            <div className={viewMode === 'GRID' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8' : 'flex flex-col gap-8'}>
               {filteredProducts.map(p => (
                 <ProductCardMarketplace 
                   key={p.id}
                   product={p}
                   viewMode={viewMode}
                   mode={mode}
                   onAddToCart={() => {}}
                   onQuickView={() => {}}
                   onBuyNow={() => {}}
                 />
               ))}
            </div>
         )}
      </main>
    </div>
  );
};

export default MarketplaceShelf;
