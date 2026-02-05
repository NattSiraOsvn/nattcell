
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import ThreatDetectionService, { SecurityThreat } from '../services/threatDetectionService';
import QuantumPulse from './QuantumPulse';
import { QuantumBuffer } from '../services/quantumBufferService';

interface SecurityOverlayProps {
  children: React.ReactNode;
  autoLockDelay?: number;
  blurSensitiveData?: boolean;
}

const SecurityOverlay: React.FC<SecurityOverlayProps> = ({
  children,
  autoLockDelay = 300000,
  blurSensitiveData = true,
}) => {
  const [isLocked, setIsLocked] = useState(false);
  const [isStaging, setIsStaging] = useState(false);
  const [lockStep, setLockStep] = useState<'PIN' | 'MFA'>('PIN');
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [pin, setPin] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [error, setError] = useState('');
  const [threatDetails, setThreatDetails] = useState<SecurityThreat | null>(null);
  const [bufferCount, setBufferCount] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const unsubscribeThreats = ThreatDetectionService.subscribe((threat) => {
      // Nếu là STAGING, không khóa màn hình đỏ, chỉ hiển thị lớp điều tiết (Pulse)
      if (threat.level === 'STAGING') {
        setIsStaging(true);
        setThreatDetails(threat);
        return;
      }

      // Các lỗi bảo mật cấp cao (CRITICAL/HIGH) vẫn giữ cơ chế khóa cứng Lockdown
      if (threat.level === 'CRITICAL' || threat.level === 'HIGH') {
        setIsLocked(true);
        setLockStep('PIN');
        setThreatDetails(threat);
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {});
      }
    });

    // Theo dõi hàng đợi Buffer để tự động tắt Staging khi đã xử lý xong
    const unsubscribeBuffer = QuantumBuffer.subscribe((queue) => {
      setBufferCount(queue.length);
      if (queue.length === 0 && isStaging) {
        // Delay nhẹ để chuyển cảnh mượt mà
        setTimeout(() => setIsStaging(false), 800);
      }
    });

    return () => {
      unsubscribeThreats();
      unsubscribeBuffer();
    };
  }, [isStaging]);

  const updateActivity = useCallback((e?: Event) => {
    if (!isLocked) {
      setLastActivity(Date.now());
      if (e?.type === 'click' || e?.type === 'keydown') {
         ThreatDetectionService.trackUserActivity(e.type);
      }
      if (e?.type === 'keydown') {
         ThreatDetectionService.trackKeystroke();
      }
    }
  }, [isLocked]);

  useEffect(() => {
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('touchstart', updateActivity);
    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('touchstart', updateActivity);
    };
  }, [updateActivity]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLocked && Date.now() - lastActivity > autoLockDelay) {
        setIsLocked(true);
        setLockStep('PIN');
        setPin('');
        setMfaCode('');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isLocked, lastActivity, autoLockDelay]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockStep === 'PIN') {
        if (pin === '123456' || pin === '654321') { // Mock PINs for demo
            if (threatDetails) {
                setLockStep('MFA');
                setError('');
            } else {
                completeUnlock();
            }
        } else {
            setError('Mã PIN quản trị không chính xác');
        }
    } else {
        if (mfaCode === '123456') {
            completeUnlock();
        } else {
            setError('Mã xác thực MFA không đúng');
        }
    }
  };

  const completeUnlock = () => {
      setIsLocked(false);
      setIsStaging(false);
      setLastActivity(Date.now());
      setPin('');
      setMfaCode('');
      setError('');
      setThreatDetails(null);
      setLockStep('PIN');
  };

  const watermarks = useMemo(() => {
    const items = [];
    const rows = isMobile ? 6 : 8;
    const cols = isMobile ? 3 : 6;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        items.push({
          top: `${(i * 100) / rows}%`,
          left: `${(j * 100) / cols}%`,
          text: `NATT-OS • SECURE • AES-256`
        });
      }
    }
    return items;
  }, [isMobile]);

  return (
    <div className="relative w-full h-full">
      <div className={`w-full h-full transition-all duration-700 ${(isLocked || isStaging) ? 'blur-3xl scale-[1.02] opacity-40 pointer-events-none' : ''}`}>
        {children}
        <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden opacity-[0.03]">
            {watermarks.map((wm, i) => (
                <div key={i} className="absolute text-white font-mono font-black text-xl -rotate-12 whitespace-nowrap select-none" 
                     style={{ top: wm.top, left: wm.left }}>
                    {wm.text}
                </div>
            ))}
        </div>
      </div>

      {/* QUANTUM PULSE OVERLAY (SOFT STAGING) */}
      {isStaging && !isLocked && (
        <div className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-black/40 backdrop-blur-3xl animate-in fade-in duration-700">
           <div className="ai-panel p-16 border-cyan-500/20 bg-black/80 shadow-[0_0_100px_rgba(6,182,212,0.15)] relative overflow-hidden text-center max-w-lg rounded-[4rem]">
              <QuantumPulse message={threatDetails?.details} />
              <div className="mt-8 px-6 py-3 bg-cyan-950/40 border border-cyan-500/20 rounded-2xl inline-block">
                 <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-black">
                    Buffer Shard Queue: {bufferCount} tasks pending
                 </p>
              </div>
           </div>
        </div>
      )}

      {/* LOCK SCREEN OVERLAY (HARD LOCKDOWN) */}
      {isLocked && (
        <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center backdrop-blur-2xl animate-in fade-in duration-500 ${threatDetails ? 'bg-red-950/90' : 'bg-black/90'}`}>
          <div className={`w-full max-w-md p-12 glass border-2 rounded-[4rem] shadow-[0_0_150px_rgba(0,0,0,0.8)] text-center relative overflow-hidden ${threatDetails ? 'border-red-500' : 'border-white/10'}`}>
             <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r animate-[shimmer_2s_infinite] ${threatDetails ? 'from-red-600 via-white to-red-600' : 'from-blue-600 via-cyan-500 to-blue-600'}`}></div>
             <div className="text-8xl mb-10 animate-pulse">{threatDetails ? '🚨' : '🔐'}</div>
             <h2 className="text-4xl font-serif gold-gradient uppercase tracking-widest mb-4 italic leading-none">Access Restricted</h2>
             <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-10 font-black">Session Verification Required</p>
             
             <form onSubmit={handleUnlock} className="space-y-10">
                <div className="relative">
                   <input 
                       ref={inputRef}
                       type={lockStep === 'PIN' ? "password" : "text"} 
                       value={lockStep === 'PIN' ? pin : mfaCode}
                       onChange={(e) => lockStep === 'PIN' ? setPin(e.target.value) : setMfaCode(e.target.value)}
                       placeholder={lockStep === 'PIN' ? "NHẬP PIN QUẢN TRỊ" : "MÃ XÁC THỰC OMEGA"}
                       className="w-full bg-black/60 border border-white/10 rounded-2xl py-6 px-6 text-center text-white text-3xl font-black tracking-[0.5em] focus:border-amber-500 outline-none transition-all placeholder:text-[10px] placeholder:tracking-widest placeholder:opacity-30"
                       maxLength={6}
                       autoFocus
                   />
                </div>
                {error && <p className="text-[10px] text-red-500 font-black uppercase tracking-widest animate-shake">{error}</p>}
                <button type="submit" className="w-full py-6 bg-white text-black font-black text-[12px] uppercase tracking-[0.5em] rounded-[2rem] hover:bg-amber-500 transition-all shadow-2xl active:scale-95">
                    {lockStep === 'PIN' ? 'VALIDATE IDENTITY' : 'RESTORE TERMINAL'}
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityOverlay;
