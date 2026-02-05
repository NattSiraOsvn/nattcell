
import React, { useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  onCustomize: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onCustomize, onAddToCart }) => {
  const [quantity, setQuantity] = useState(product.minOrder);

  return (
    <div className="ai-panel overflow-hidden border-white/5 hover:border-cyan-500/30 group cursor-pointer flex flex-col h-full bg-black/40">
      <div className="relative h-72 overflow-hidden bg-black" onClick={onClick}>
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
        />
        {product.videos.length > 0 && (
          <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
            4K Media
          </div>
        )}
        {product.tradeAssurance && (
          <div className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
            Bảo vệ Giao dịch
          </div>
        )}
      </div>

      <div className="p-8 flex flex-col flex-1 space-y-4">
        <div className="flex justify-between items-start">
           <span className="text-[9px] text-amber-500 font-black uppercase tracking-widest">{product.supplier.tenNhaCungCap}</span>
           <div className="flex items-center gap-1">
              <span className="text-amber-500">★</span>
              <span className="text-[10px] font-bold text-white">{product.rating}</span>
           </div>
        </div>
        
        <h3 className="text-xl font-bold text-white uppercase tracking-tight group-hover:text-cyan-300 transition-colors line-clamp-2" onClick={onClick}>
          {product.name}
        </h3>

        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-mono font-black text-white">
            {product.price.toLocaleString()} <span className="text-xs uppercase text-indigo-400 font-light">đ</span>
          </span>
          <span className="text-[9px] text-gray-500 uppercase font-black">/ {product.moqUnit}</span>
        </div>

        <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
          {product.isCustomizable ? (
            <button
              onClick={(e) => { e.stopPropagation(); onCustomize(); }}
              className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-cyan-400 transition-all shadow-xl"
            >
              🛠 Đặt Sản Xuất Master
            </button>
          ) : (
            <div className="flex gap-3">
              <input
                type="number"
                min={product.minOrder}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(product.minOrder, parseInt(e.target.value) || 1))}
                onClick={(e) => e.stopPropagation()}
                className="w-20 bg-white/5 border border-white/10 rounded-xl px-2 text-center text-xs font-mono text-amber-500 focus:outline-none"
              />
              <button
                onClick={(e) => { e.stopPropagation(); onAddToCart(product, quantity); }}
                className="flex-1 py-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-indigo-500 transition-all"
              >
                🛒 Thêm vào RFQ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
