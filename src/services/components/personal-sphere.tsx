
import React, { useState } from 'react';
import { UserPosition, UserRole, PersonaID } from '@/types';

interface PersonalSphereProps {
  currentRole: UserRole;
  currentPosition: UserPosition; // 1️⃣ Fix: Interface UserPosition
  logAction: (action: string, details: string) => void;
}

const PersonalSphere: React.FC<PersonalSphereProps> = ({ currentPosition, currentRole }) => {
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  
  return (
    <div className="h-full bg-[#020202] text-white p-8 overflow-y-auto no-scrollbar pb-32">
      <header className="flex justify-between items-end mb-12">
        <div className="flex items-center gap-6">
           <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-2 border-amber-500/30 animate-[spin_10s_linear_infinite]"></div>
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" className="w-full h-full rounded-full object-cover p-2" alt="Profile" />
           </div>
           <div>
              <h1 className="text-4xl font-serif italic gold-gradient tracking-tighter leading-none">Identity Node</h1>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-3">
                 {/* 2️⃣ Fix: Truy xuất thuộc tính role và id từ object currentPosition */}
                 {currentPosition.role} (NODE: {currentPosition.id}) • Diamond Member
              </p>
           </div>
        </div>
        
        <div className="flex gap-4">
           {['DASHBOARD', 'VAULT', 'NETWORK'].map(tab => (
              <button 
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab ? 'bg-white text-black shadow-xl' : 'bg-white/5 text-gray-500 hover:text-white'
                 }`}
              >
                 {tab}
              </button>
           ))}
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 ai-panel p-10 bg-gradient-to-br from-white/[0.03] to-transparent border-white/10 min-h-[400px]">
            <h3 className="text-sm font-black text-amber-500 uppercase tracking-widest mb-10 italic">Neural Personal Analytics</h3>
            <div className="flex flex-col items-center justify-center py-20 opacity-20">
               <span className="text-8xl mb-6">🧠</span>
               <p className="text-xl font-serif italic">Đang bóc tách nhịp điệu sinh học...</p>
            </div>
         </div>

         <div className="space-y-8">
            <div className="ai-panel p-8 bg-black/40 border-white/5">
               <div className="flex items-center gap-4 mb-6">
                  <h4 className="text-[10px] text-indigo-400 font-black uppercase">Thiên Identity Guard</h4>
               </div>
               <p className="text-[12px] text-gray-400 italic leading-relaxed font-light">
                  "Thưa Anh Natt, Shard định danh của Anh đã được niêm phong. Mọi tác vụ bóc tách từ đây sẽ được ký số bằng mã vân tay điện tử của riêng Anh."
               </p>
            </div>
         </div>
      </section>
    </div>
  );
};

export default PersonalSphere;
