
import React, { useState, useEffect } from 'react';
import { ShowroomAPI } from '@/services/showroom/api';
import { ShowroomProduct } from '@/types/showroom';
import { HeroMediaBlock } from './heromediablock';
import { BranchContextPanel } from './branchcontextpanel';
import { SpecificationBlock } from './specificationblock';
import { ExperienceTrustBlock } from './experiencetrustblock';
import { RelatedProducts } from './relatedproducts';
import { OwnerVault } from './ownervault';
import { ReservationModal } from './reservationmodal';
import LoadingSpinner from '@/common/loadingspinner';

const ProductPage: React.FC = () => {
  const [product, setProduct] = useState<ShowroomProduct | null>(null);
  const [related, setRelated] = useState<ShowroomProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      // Hardcoded SKU for Demo Phase 3.5
      const p = await ShowroomAPI.getProduct('NNA-ROLEX-OMEGA');
      const r = await ShowroomAPI.getRelatedProducts();
      setProduct(p);
      setRelated(r);
      setLoading(false);
    };
    load();
  }, []);

  if (loading || !product) return <LoadingSpinner message="Đang tải Showroom Shard (Phase 3.5)..." />;

  return (
    <div className="h-full bg-[#020202] p-6 lg:p-10 overflow-y-auto no-scrollbar animate-in fade-in duration-700 pb-40">
       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT: VISUAL */}
          <div className="lg:col-span-8 space-y-8">
             <HeroMediaBlock product={product} />
             <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem]">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Câu chuyện Chế tác</h3>
                <p className="text-sm text-gray-400 italic leading-relaxed font-light">
                   {product.description}
                </p>
             </div>
             <RelatedProducts products={related} />
          </div>

          {/* RIGHT: CONTEXT & ACTION */}
          <div className="lg:col-span-4 space-y-6">
             <BranchContextPanel branch={product.branch} />
             
             <SpecificationBlock specs={product.specs} />
             
             <ExperienceTrustBlock />
             
             <OwnerVault location={product.vaultLocation} />

             <div className="pt-6 sticky bottom-6 z-20">
                <button 
                  onClick={() => setShowModal(true)}
                  className="w-full py-5 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.3)] hover:scale-[1.02] transition-all"
                >
                   Đặt Lịch Xem (Private)
                </button>
                <p className="text-center text-[9px] text-gray-600 mt-3 font-black uppercase tracking-widest">
                   Mã hóa bởi Natt-OS Security
                </p>
             </div>
          </div>
       </div>

       {showModal && <ReservationModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default ProductPage;
