
import React from 'react';
import { ShowroomProduct } from '@/types/showroom';

export const RelatedProducts: React.FC<{ products: ShowroomProduct[] }> = ({ products }) => {
  return (
    <div className="mt-12">
      <h3 className="text-lg font-serif text-white italic mb-6">Có thể Anh/Chị quan tâm</h3>
      <div className="grid grid-cols-2 gap-6">
         {products.map(p => (
           <div key={p.id} className="p-4 bg-black/40 border border-white/5 rounded-3xl group cursor-pointer hover:border-amber-500/30 transition-all">
              <div className="aspect-square rounded-2xl overflow-hidden mb-3">
                 <img src={p.media[0]?.url} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt={p.name} />
              </div>
              <h4 className="text-xs font-bold text-white uppercase truncate">{p.name}</h4>
              <p className="text-[10px] text-amber-500 font-mono mt-1">{p.price.toLocaleString()} {p.currency}</p>
           </div>
         ))}
      </div>
    </div>
  );
};
