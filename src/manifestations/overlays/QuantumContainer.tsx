
import React from 'react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { OverlayType } from '../../core/signals/types';

interface Props {
  mode: OverlayType;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

// 🛠️ Fixed: Variants typing correctly mapped to modes to satisfy framer-motion requirements
const variants: Record<string, Variants> = {
  LENS: { // Hover/Peek - Nhẹ nhàng, tại chỗ
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, stiffness: 400, damping: 30 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  },
  DRAWER: { // Slide from right - Ngữ cảnh bổ sung
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring' as const, damping: 30, stiffness: 300 } },
    exit: { x: '100%', opacity: 0, transition: { duration: 0.3 } }
  },
  VOID: { // Full focus - Deep Work
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
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: mode === 'VOID' ? 0.98 : 0.6 }} // Void tối đen gần như hoàn toàn
            exit={{ opacity: 0 }}
            onClick={mode !== 'VOID' ? onClose : undefined} // Void bắt buộc phải tương tác xong mới thoát (hoặc nút riêng)
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: mode === 'VOID' ? '#020202' : '#050505',
              backdropFilter: mode === 'LENS' ? 'blur(2px)' : 'blur(10px)',
              zIndex: 1000
            }}
          />

          {/* MANIFESTATION CONTAINER */}
          <motion.div
            variants={variants[mode]}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: 'fixed',
              zIndex: 1001,
              // Layout logic based on Mode
              ...(mode === 'DRAWER' ? { top: 0, right: 0, height: '100vh', width: '500px', maxWidth: '90vw' } : {}),
              ...(mode === 'VOID' ? { top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' } : {}),
              ...(mode === 'LENS' ? { top: '20%', left: '50%', transform: 'translateX(-50%)', width: '600px', maxWidth: '90vw' } : {}),
            }}
          >
            {/* The Glass Shell */}
            <div className={`
              relative flex flex-col overflow-hidden
              ${mode === 'VOID' ? 'w-full max-w-5xl h-[80vh] rounded-[3rem]' : ''}
              ${mode === 'DRAWER' ? 'h-full rounded-l-[3rem] border-l' : 'rounded-[2rem] border'}
              ${mode === 'LENS' ? 'rounded-[2rem] border shadow-2xl' : ''}
              border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]
            `}>
              
              {/* Header Context (if provided) */}
              {(title || mode !== 'VOID') && (
                <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/[0.02]">
                  {title && (
                    <h3 className="text-xl font-serif gold-gradient italic uppercase tracking-widest">
                      {mode === 'VOID' ? '⚡ ' : mode === 'DRAWER' ? '📂 ' : '🔍 '}
                      {title}
                    </h3>
                  )}
                  <button 
                    onClick={onClose}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Content Injector */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                {children}
              </div>

              {/* Footer Indicator */}
              <div className="p-2 bg-black text-center">
                 <p className="text-[8px] font-black uppercase text-gray-700 tracking-[0.5em]">
                    Quantum Manifestation • {mode} Layer
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
