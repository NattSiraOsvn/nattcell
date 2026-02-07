
import React from 'react';
import { ShowroomProduct } from '@/types/showroom';
import { getPrimaryMedia } from '@/utils/validateproductmedia';

export const HeroMediaBlock: React.FC<{ product: ShowroomProduct }> = ({ product }) => {
  const primary = getPrimaryMedia(product.media);

  return (
    <div className="relative aspect-[4/3] lg:aspect-[16/9] w-full overflow-hidden rounded-[3rem] border border-white/10 group shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-80" />
      
      <img 
        src={primary?.url} 
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
      />

      <div className="absolute bottom-0 left-0 p-10 z-20 w-full">
        <div className="flex items-center gap-4 mb-2">
            <span className="px-3 py-1 bg-amber-500 text-black text-[10px] font-black rounded-full uppercase tracking-widest">
                {product.status}
            </span>
            <span className="text-[10px] text-white/60 font-mono tracking-widest uppercase">
                SKU: {product.sku}
            </span>
        </div>
        <h1 className="text-4xl lg:text-6xl font-serif text-white italic tracking-tighter gold-gradient mb-4">
            {product.name}
        </h1>
        <p className="text-3xl font-mono text-white font-bold">
            {product.price.toLocaleString()} <span className="text-sm text-amber-500">{product.currency}</span>
        </p>
      </div>

      <div className="absolute top-8 right-8 z-20">
         <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl animate-pulse">
            💎
         </div>
      </div>
    </div>
  );
};
