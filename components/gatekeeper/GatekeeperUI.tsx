
import React, { useState } from 'react';
import { Fingerprint, BadgeCheck, CheckCircle, ArrowRight } from 'lucide-react';

interface GatekeeperProps {
  onUnlock: () => void;
}

const GATEKEEPER_IMGS = {
  idle: "https://lh3.googleusercontent.com/d/1nCMP1A3Ge8JMb2X7K6fQrcemZDTvF-ud", 
  success: "https://lh3.googleusercontent.com/d/1DevqOFX3Kc4pJGHgXysWmdU8tMYTigw3"
};

const Gatekeeper: React.FC<GatekeeperProps> = ({ onUnlock }) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success'>('idle');
  
  const handleEnter = () => {
    setStatus('scanning');
    setTimeout(() => {
        setStatus('success');
        setTimeout(onUnlock, 1200);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-[#FAFAFA] flex flex-col items-center justify-center font-sans text-stone-800 overflow-hidden">
        {/* Decorative Floating Neural Grid */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
            {Array.from({length: 20}).map((_, i) => (
                <div 
                    key={i} 
                    className="absolute animate-float"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${Math.random() * 10 + 8}s`,
                        transform: `rotate(${Math.random() * 45}deg)`
                    }}
                >
                    <span className="text-4xl">Ω</span>
                </div>
            ))}
        </div>

        <div className="relative z-10 flex flex-col items-center">
            {/* Gatekeeper Card - Nexus Style */}
            <div className={`
                relative w-80 h-[450px] bg-white rounded-[3rem] shadow-[0_30px_80px_-15px_rgba(0,0,0,0.15)] p-5
                transition-all duration-700 ease-in-out border border-white
                ${status === 'scanning' ? 'scale-105 shadow-[0_40px_100px_-15px_rgba(0,0,0,0.2)]' : ''}
                ${status === 'success' ? 'scale-110 rotate-1' : ''}
            `}>
                <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative bg-stone-50 group border border-stone-100">
                    <img 
                        src={status === 'success' ? GATEKEEPER_IMGS.success : GATEKEEPER_IMGS.idle} 
                        className={`w-full h-full object-cover transition-all duration-1000 ${status === 'scanning' ? 'scale-110 blur-[2px] contrast-125' : 'scale-100'}`}
                        alt="Gatekeeper"
                    />
                    
                    {/* Laser Scan Line */}
                    {status === 'scanning' && (
                        <div className="absolute inset-0 z-20">
                            <div className="w-full h-1 bg-red-500 shadow-[0_0_20px_red] animate-scan absolute top-0"></div>
                        </div>
                    )}

                    {/* Enterprise Badge Sticker */}
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur text-stone-900 p-3 rounded-[1.5rem] shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-500 border border-stone-200">
                        <BadgeCheck size={28} className="text-blue-600" />
                    </div>
                    
                    {/* Status Pill */}
                    <div className={`
                        absolute bottom-10 left-1/2 -translate-x-1/2 px-10 py-4 bg-white/90 backdrop-blur-xl rounded-full shadow-2xl border border-stone-100
                        text-sm font-extrabold tracking-wide transition-all duration-500 flex items-center gap-3 whitespace-nowrap
                        ${status === 'scanning' ? 'w-16 h-16 p-0 justify-center text-transparent' : 'w-auto'}
                    `}>
                        {status === 'idle' && <>
                            <Fingerprint size={20} className="text-amber-500"/> <span>VERIFY IDENTITY</span>
                        </>}
                        {status === 'scanning' && <span className="w-6 h-6 border-[3px] border-stone-800 border-t-transparent rounded-full animate-spin"></span>}
                        {status === 'success' && <span className="text-emerald-600 flex items-center gap-2 font-black uppercase"><CheckCircle size={20}/> Access Granted</span>}
                    </div>
                </div>
            </div>

            {/* Unlock Button */}
            <div className="mt-16 h-20">
                {status === 'idle' && (
                    <button 
                        onClick={handleEnter}
                        className="px-14 py-5 bg-stone-900 text-white rounded-full font-black text-sm uppercase tracking-[0.2em] hover:bg-black hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 group"
                    >
                        <span>Open Dashboard</span>
                        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                )}
            </div>
        </div>

        <div className="absolute bottom-10 opacity-30 text-[10px] font-black uppercase tracking-[0.5em]">
            Natt-OS • Reshape Protocol • v5.0
        </div>
    </div>
  );
};

export default Gatekeeper;
