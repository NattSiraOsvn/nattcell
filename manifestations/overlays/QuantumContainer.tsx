import React from 'react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { OverlayType } from '../../core/signals/types.ts';
import { Natt3DIcon } from '../../components/common/Natt3DIcon.tsx';

interface Props {
  mode: OverlayType;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const variants: Record<string, Variants> = {
  LENS: {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, stiffness: 400, damping: 30 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  },
  DRAWER: {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring' as const, damping: 30, stiffness: 300 } },
    exit: { x: '100%', opacity: 0, transition: { duration: 0.3 } }
  },
  VOID: {
    hidden: { opacity: 0, scale: 1.1 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, scale: 1.05, transition: { duration: 0.3 } }
  }
};

const QuantumContainer: React.FC<Props> = ({ mode, isOpen, onClose, title, children }) => {
  if (mode === 'NONE' || !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: mode === 'VOID' ? 0.98 : 0.6 }}
            exit={{ opacity: 0 }}
            onClick={mode !== 'VOID' ? onClose : undefined}
            className="fixed inset-0 z-[1000] backdrop-blur-sm"
            style={{
              background: mode === 'VOID' ? '#020202' : '#050505',
              backdropFilter: mode === 'LENS' ? 'blur(2px)' : 'blur(10px)',
            }}
          />

          <motion.div
            variants={variants[mode]}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed z-[1001]"
            style={{
              ...(mode === 'DRAWER' ? { top: 0, right: 0, height: '100vh', width: '500px', maxWidth: '95vw' } : {}),
              ...(mode === 'VOID' ? { top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' } : {}),
              ...(mode === 'LENS' ? { top: '20%', left: '50%', transform: 'translateX(-50%)', width: '600px', maxWidth: '90vw' } : {}),
            }}
          >
            <div className={`
              relative flex flex-col overflow-hidden h-full
              ${mode === 'VOID' ? 'w-full max-w-6xl h-[85vh] rounded-[4rem]' : ''}
              ${mode === 'DRAWER' ? 'rounded-l-[4rem] border-l' : 'rounded-[3rem] border'}
              border-white/10 bg-[#080808]/95 backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.8)]
            `}>
              
              {/* 3D Industrial Gold Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-yellow-200 to-amber-600 shadow-[0_2px_10px_rgba(212,175,55,0.4)]"></div>

              {(title || mode !== 'VOID') && (
                <div className="flex justify-between items-center p-8 border-b border-white/5 bg-white/[0.02]">
                  {title && (
                    <div className="flex items-center gap-4">
                      <Natt3DIcon type={mode === 'DRAWER' ? 'database' : 'brain'} size={24} pulse />
                      <h3 className="text-2xl font-serif gold-gradient italic uppercase tracking-[0.1em]">
                        {title}
                      </h3>
                    </div>
                  )}
                  <button 
                    onClick={onClose}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-gray-500 hover:text-amber-500 hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="flex-1 overflow-y-auto no-scrollbar p-10">
                {children}
              </div>

              <div className="p-4 bg-black/60 text-center border-t border-white/5">
                 <p className="text-[10px] font-black uppercase text-stone-700 tracking-[0.5em] flex items-center justify-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse"></span>
                    OMEGA SHARD INFRASTRUCTURE • {mode} ACTIVE
                 </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuantumContainer;