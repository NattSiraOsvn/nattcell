
import React, { useState } from 'react';
import { Product } from '@/types';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onRequestCustomization: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onAddToCart, onRequestCustomization }) => {
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(product.minOrder);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300 overflow-hidden">
      <div className="ai-panel w-full max-w-7xl max-h-[90vh] flex flex-col bg-black border-indigo-500/20 relative">
        <button onClick={onClose} className="absolute top-8 right-8 text-4xl text-gray-500 hover:text-white transition-colors z-[110]">✕</button>
        
        <div className="flex-1 overflow-y-auto no-scrollbar p-10 md:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Gallery Section */}
            <div className="space-y-8">
               <div className="aspect-square rounded-[3rem] overflow-hidden border border-white/10 bg-black group relative shadow-2xl">
                  <img src={product.images[activeImg]} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" alt="p" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
               </div>
               <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                  {product.images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)} className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${activeImg === i ? 'border-amber-500 scale-105' : 'border-white/5 opacity-40'}`}>
                      <img src={img} className="w-full h-full object-cover" />
                    </button>
                  ))}
               </div>
            </div>

            {/* Info Section */}
            <div className="space-y-10">
               <div>
                  <div className="flex items-center gap-3 mb-4">
                     <span className="px-3 py-1 bg-amber-500/20 text-amber-500 text-[9px] font-black rounded-full uppercase tracking-widest rounded-full border border-amber-500/30">Mã SKU: {product.sku}</span>
                     <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-[9px] font-black rounded-full uppercase tracking-widest rounded-full border border-cyan-500/30">GIA Certified</span>
                  </div>
                  <h2 className="text-5xl font-serif gold-gradient italic uppercase tracking-tighter leading-none mb-6">{product.name}</h2>
                  <p className="text-gray-400 text-lg font-light leading-relaxed italic">"{product.description}"</p>
               </div>

               <div className="grid grid-cols-2 gap-10 border-y border-white/5 py-10">
                  <div>
                     <p className="ai-sub-headline opacity-40 mb-2">Giá niêm yết (Node Price)</p>
                     <p className="text-4xl font-mono font-black text-white">{product.price.toLocaleString()} đ</p>
                  </div>
                  <div>
                     <p className="ai-sub-headline opacity-40 mb-2">Lead-time Dự kiến</p>
                     <p className="text-4xl font-serif text-amber-500 italic">{product.leadTime} <span className="text-sm font-black uppercase">Ngày</span></p>
                  </div>
               </div>

               <div className="space-y-6">
                  <h4 className="ai-sub-headline text-indigo-400">Thông số Kỹ thuật (OMEGA SPECS)</h4>
                  <div className="grid grid-cols-2 gap-6">
                    {Object.entries(product.specifications).map(([k, v]) => (
                      <div key={k} className="flex flex-col gap-1">
                         <span className="text-[10px] text-gray-600 uppercase font-black">{k}</span>
                         <span className="text-sm text-gray-200 italic">{(v as any)}</span>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="pt-10 flex gap-6">
                  <div className="flex items-center border border-white/10 rounded-2xl bg-white/5 p-1">
                     <button onClick={() => setQty(prev => Math.max(1, prev - 1))} className="w-14 h-14 text-2xl text-gray-500 hover:text-white">-</button>
                     <input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} className="w-20 bg-transparent text-center font-mono font-bold text-white focus:outline-none" />
                     <button onClick={() => setQty(prev => prev + 1)} className="w-14 h-14 text-2xl text-gray-500 hover:text-white">+</button>
                  </div>
                  <button onClick={() => { onAddToCart(product, qty); onClose(); }} className="flex-1 bg-white text-black font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl hover:bg-cyan-400 transition-all text-sm">Ủy nhiệm RFQ (Báo giá)</button>
                  {product.isCustomizable && (
                    <button onClick={onRequestCustomization} className="px-10 py-5 border border-amber-500 text-amber-500 font-black uppercase tracking-widest rounded-2xl hover:bg-amber-500/10 transition-all text-[10px]">Customize</button>
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
