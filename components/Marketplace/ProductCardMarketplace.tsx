
import React, { useState } from 'react';
import { MarketplaceProduct } from '../../types';
import { Play, Eye, Scale, ShoppingCart, Zap, CheckCircle } from 'lucide-react';

interface Props {
  product: MarketplaceProduct;
  viewMode: 'GRID' | 'LIST';
  mode: 'SALES' | 'SELLER';
  onAddToCart: (product: MarketplaceProduct, quantity: number) => void;
  onQuickView: (product: MarketplaceProduct) => void;
  onBuyNow: (product: MarketplaceProduct) => void;
}

const ProductCardMarketplace: React.FC<Props> = ({ 
  product, viewMode, mode, onAddToCart, onQuickView, onBuyNow 
}) => {
  const [activeImage, setActiveImage] = useState(product.media.images[0]?.url);
  const [isHovered, setIsHovered] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const getStockStatus = () => {
    if (product.stock.available === 0) return { status: 'OUT_OF_STOCK', label: 'Hết hàng', color: 'text-gray-500' };
    if (product.stock.available <= 5) return { status: 'LOW_STOCK', label: `Chỉ còn ${product.stock.available}`, color: 'text-amber-500' };
    return { status: 'IN_STOCK', label: 'Sẵn hàng', color: 'text-emerald-500' };
  };

  const stockStatus = getStockStatus();
  const discountPercent = product.discountPercent || 0;

  return (
    <div 
      className={`ai-panel group relative overflow-hidden transition-all duration-500 bg-black/40 border-white/5 hover:border-amber-500/30 ${
        viewMode === 'GRID' ? 'flex flex-col' : 'flex flex-row gap-8 p-6'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* IMAGE SECTION */}
      <div className={`relative overflow-hidden bg-black ${viewMode === 'GRID' ? 'aspect-square' : 'w-72 h-72 rounded-3xl shrink-0'}`}>
        <img 
          src={activeImage} 
          alt={product.name}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-1000 scale-100 group-hover:scale-110"
        />
        
        {/* Overlay Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
           <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase shadow-lg flex items-center gap-1">
              <CheckCircle size={10} /> Verified Hub
           </div>
           {product.media.video && (
             <div className="bg-red-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase shadow-lg flex items-center gap-1">
                <Play size={10} fill="currentColor" /> 4K Media
             </div>
           )}
           {discountPercent > 0 && (
             <div className="bg-amber-500 text-black px-3 py-1 rounded-full text-[9px] font-black uppercase shadow-lg">
                -{discountPercent}% OFF
             </div>
           )}
        </div>

        {/* Quick Actions Overlay */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
           <button onClick={() => onQuickView(product)} className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"><Eye size={20}/></button>
           <button className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"><Scale size={20}/></button>
        </div>

        {/* Thumbnail Navigation */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
           {product.media.images.slice(0, 3).map((img, i) => (
              <button 
                key={img.id} 
                onClick={() => setActiveImage(img.url)}
                className={`w-10 h-10 rounded-lg border-2 overflow-hidden transition-all ${activeImage === img.url ? 'border-amber-500 scale-110' : 'border-white/20 opacity-60'}`}
              >
                 <img src={img.url} className="w-full h-full object-cover" />
              </button>
           ))}
        </div>
      </div>

      {/* INFO SECTION */}
      <div className={`flex-1 flex flex-col ${viewMode === 'GRID' ? 'p-6' : 'justify-between py-2'}`}>
        <div>
           <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{product.category.name}</span>
              <span className="text-[9px] text-gray-600 font-mono">SKU: {product.sku}</span>
           </div>
           
           <h3 className="text-xl font-bold text-white uppercase tracking-tight line-clamp-2 group-hover:text-amber-500 transition-colors mb-4 h-14">
              {product.name}
           </h3>

           <div className="flex flex-col gap-1 mb-6">
              <div className="flex items-baseline gap-3">
                 <span className="text-3xl font-mono font-black text-white">{(product.salePrice || product.basePrice).toLocaleString()} đ</span>
                 {(product.compareAtPrice) && (
                   <span className="text-xs text-gray-600 line-through">{product.compareAtPrice.toLocaleString()} đ</span>
                 )}
              </div>
              <p className={`text-[10px] font-bold uppercase ${stockStatus.color} flex items-center gap-2`}>
                 <span className={`w-1.5 h-1.5 rounded-full bg-current ${stockStatus.status === 'LOW_STOCK' ? 'animate-pulse' : ''}`}></span>
                 {stockStatus.label} {product.stock.location && `• ${product.stock.location}`}
              </p>
           </div>
        </div>

        <div className="space-y-4 mt-auto">
           <div className="flex gap-3">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2 shrink-0">
                 <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-500 hover:text-white px-2">−</button>
                 <input type="number" value={quantity} readOnly className="w-8 bg-transparent text-center font-mono font-bold text-white text-xs" />
                 <button onClick={() => setQuantity(Math.min(product.stock.available, quantity + 1))} className="text-gray-500 hover:text-white px-2">+</button>
              </div>
              <button 
                onClick={() => onAddToCart(product, quantity)}
                disabled={product.stock.available === 0}
                className="flex-1 py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart size={14} /> THÊM GIỎ HÀNG
              </button>
           </div>
           <button 
             onClick={() => onBuyNow(product)}
             disabled={product.stock.available === 0}
             className="w-full py-4 bg-amber-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-amber-400 shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
           >
             <Zap size={14} fill="currentColor" /> MUA NGAY
           </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCardMarketplace;
