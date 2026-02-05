
import React, { useState, useEffect } from 'react';
import { PersonaID, RiskNodeStatus, OutsourceRiskShard, UserRole } from '../types';
import AIAvatar from './AIAvatar';
import { ShardingService } from '../services/blockchainService';

const OutsourceRiskTerminal: React.FC = () => {
  const [activeShard, setActiveShard] = useState<OutsourceRiskShard | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // MOCK DATA: Giả lập một đơn hàng nhạy cảm
  const simulateNewOrder = () => {
    const orderData = {
        orderId: 'ORD-2026-X01',
        stoneId: 'GIA 223485960',
        initialWeight: 12.45, // Chỉ
        goldPurity: '18K (75%)',
        senderId: 'USR-NATT'
    };
    
    const shard: OutsourceRiskShard = {
      id: `RISK-${Date.now()}`,
      ...orderData,
      status: RiskNodeStatus.PRE_FLIGHT,
      outsourcerId: 'EXTERNAL-PRO-01',
      checkpoints: { laserCodeVerified: false, macroPhotoCaptured: false, purityTested: false },
      threatLevel: 'LOW',
      hash: ShardingService.generateShardHash(orderData)
    };
    setActiveShard(shard);
  };

  const handleCheckpoint = (key: keyof OutsourceRiskShard['checkpoints']) => {
    if (!activeShard) return;
    setActiveShard({
        ...activeShard,
        checkpoints: { ...activeShard.checkpoints, [key]: true }
    });
  };

  const triggerReturn = () => {
    if (!activeShard) return;
    setIsSimulating(true);
    // Giả lập 2 tình huống
    setTimeout(() => {
        const returnedWeight = 12.10; // Giả lập hao hụt vượt ngưỡng (12.45 - 12.10 = 0.35 -> ~2.8%)
        const delta = activeShard.initialWeight - returnedWeight;
        const lossPercent = (delta / activeShard.initialWeight) * 100;

        setActiveShard({
            ...activeShard,
            currentWeight: returnedWeight,
            status: RiskNodeStatus.RETURNED,
            threatLevel: lossPercent > 2.3 ? 'CRITICAL' : 'LOW'
        });
        setIsSimulating(false);
    }, 1500);
  };

  return (
    <div className="h-full bg-[#020202] p-8 md:p-12 overflow-y-auto no-scrollbar animate-in fade-in duration-700 pb-40">
      <header className="flex justify-between items-end border-b border-red-500/20 pb-10 mb-10">
        <div>
          <div className="flex items-center gap-4 mb-3">
             <span className="text-4xl">🔬</span>
             <h2 className="ai-headline text-5xl italic uppercase tracking-tighter text-red-500">Risk Mapping: Outsourcing</h2>
          </div>
          <p className="ai-sub-headline text-red-400/40 font-black tracking-[0.3em]">Hệ thống giám sát Shard Đá Chủ & Trọng lượng</p>
        </div>
        {!activeShard && (
            <button onClick={simulateNewOrder} className="px-8 py-4 bg-red-600 text-white font-black text-[10px] uppercase rounded-2xl shadow-xl hover:bg-red-500 transition-all">
                KHỞI TẠO SHARD GIÁM SÁT
            </button>
        )}
      </header>

      {activeShard && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 animate-in slide-in-from-right-10">
              {/* CỘT 1: THÔNG TIN BẤT BIẾN (IMMUTABLE) */}
              <div className="ai-panel p-8 bg-black/60 border-white/5 space-y-8">
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-4">Dữ liệu niêm phong (Immutable)</h3>
                  <div className="space-y-6">
                      <div>
                          <p className="text-[8px] text-gray-600 uppercase font-black mb-1">Mã GIA / Định danh đá</p>
                          <p className="text-xl font-mono text-cyan-400 font-bold">{activeShard.stoneId}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[8px] text-gray-600 uppercase font-black mb-1">TL Giao (Chỉ)</p>
                            <p className="text-2xl font-mono text-white">{activeShard.initialWeight}</p>
                        </div>
                        <div>
                            <p className="text-[8px] text-gray-600 uppercase font-black mb-1">Hàm lượng</p>
                            <p className="text-2xl font-mono text-white">{activeShard.goldPurity}</p>
                        </div>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                          <p className="text-[8px] text-gray-600 uppercase font-black mb-2">Shard Identity Hash</p>
                          <code className="text-[9px] text-amber-500/50 break-all">{activeShard.hash}</code>
                      </div>
                  </div>
              </div>

              {/* CỘT 2: CHECKPOINT THỰC THI */}
              <div className="ai-panel p-8 bg-black/40 border-white/10 space-y-8">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-white/5 pb-4">Checkpoints bắt buộc</h3>
                  <div className="space-y-4">
                      {[
                          { id: 'macroPhotoCaptured', label: 'Chụp ảnh Macro 4K (Trước khi đi)', icon: '📸' },
                          { id: 'laserCodeVerified', label: 'Soi mã cạnh GIA (Dưới kính)', icon: '🔍' },
                          { id: 'purityTested', label: 'Đo quang phổ (Xác thực tuổi)', icon: '⚗️' }
                      ].map(cp => (
                          <button 
                            key={cp.id}
                            disabled={activeShard.checkpoints[cp.id as keyof OutsourceRiskShard['checkpoints']]}
                            onClick={() => handleCheckpoint(cp.id as any)}
                            className={`w-full p-5 rounded-2xl border flex items-center justify-between group transition-all ${
                                activeShard.checkpoints[cp.id as keyof OutsourceRiskShard['checkpoints']] 
                                ? 'bg-green-500/10 border-green-500/30' 
                                : 'bg-white/5 border-white/10 hover:border-amber-500/50'
                            }`}
                          >
                             <div className="flex items-center gap-4">
                                <span>{cp.icon}</span>
                                <span className="text-[10px] font-bold uppercase">{cp.label}</span>
                             </div>
                             {activeShard.checkpoints[cp.id as keyof OutsourceRiskShard['checkpoints']] && <span className="text-green-500">✓</span>}
                          </button>
                      ))}
                  </div>

                  {activeShard.status === RiskNodeStatus.PRE_FLIGHT && (
                    <button onClick={() => setActiveShard({...activeShard, status: RiskNodeStatus.PROCESSING})} className="w-full py-5 bg-amber-600 text-black font-black text-[10px] uppercase rounded-2xl shadow-xl">
                        XÁC NHẬN GIAO ĐI ➔
                    </button>
                  )}

                  {activeShard.status === RiskNodeStatus.PROCESSING && (
                    <button onClick={triggerReturn} className="w-full py-5 bg-blue-600 text-white font-black text-[10px] uppercase rounded-2xl animate-pulse">
                        ĐANG GIA CÔNG... (MÔ PHỎNG NHẬN LẠI)
                    </button>
                  )}
              </div>

              {/* CỘT 3: PHÂN TÍCH RỦI RO & ESCALATION */}
              <div className="space-y-8">
                  <div className={`ai-panel p-8 border-2 transition-all ${
                      activeShard.threatLevel === 'CRITICAL' ? 'bg-red-950/40 border-red-500' : 'bg-green-950/40 border-green-500/30'
                  }`}>
                      <h3 className="text-xl font-bold uppercase italic mb-6">Risk Assessment</h3>
                      {activeShard.status === RiskNodeStatus.RETURNED ? (
                          <div className="space-y-6">
                              <div className="flex justify-between items-end">
                                  <p className="text-[10px] text-gray-400 font-black uppercase">Chênh lệch TL thực tế</p>
                                  <p className={`text-4xl font-mono font-black ${activeShard.threatLevel === 'CRITICAL' ? 'text-red-500' : 'text-green-500'}`}>
                                      -{(activeShard.initialWeight - (activeShard.currentWeight || 0)).toFixed(2)} Chỉ
                                  </p>
                              </div>
                              {activeShard.threatLevel === 'CRITICAL' && (
                                  <div className="p-4 bg-red-600 text-white rounded-xl animate-bounce text-center">
                                      <p className="text-[10px] font-black uppercase tracking-widest">⚠️ CẢNH BÁO: VƯỢT NGƯỠNG 2.3%</p>
                                  </div>
                              )}
                          </div>
                      ) : (
                          <p className="text-xs text-gray-500 italic">Đang trong quá trình giám sát hành trình...</p>
                      )}
                  </div>

                  <div className="ai-panel p-8 border-amber-500/30 bg-amber-500/5">
                      <div className="flex items-center gap-4 mb-6">
                          <AIAvatar personaId={PersonaID.THIEN} size="sm" isThinking={isSimulating} />
                          <h4 className="text-sm font-black text-amber-500 uppercase tracking-widest">Thiên Risk Advisor</h4>
                      </div>
                      <p className="text-[12px] text-gray-400 italic leading-relaxed font-light">
                          {activeShard.status === RiskNodeStatus.PRE_FLIGHT 
                            ? `"Thưa Anh Natt, Thiên khuyến nghị Anh chỉ đạo thợ soi kỹ mã cạnh GIA dưới kính hiển vi 40x trước khi niêm phong túi giao đi."`
                            : activeShard.threatLevel === 'CRITICAL'
                                ? `"PHÁT HIỆN DỊ THƯỜNG: Trọng lượng trả về hụt vượt mức cho phép. Thiên đề xuất phong tỏa Shard đơn vị ${activeShard.outsourcerId} và thực hiện lệnh TRUY VẾT bụi vàng ngay."`
                                : `"Hành trình sạch. Thiên đang chờ Anh niêm phong hoàn tất."`
                          }
                      </p>
                      {activeShard.threatLevel === 'CRITICAL' && (
                        <button className="w-full mt-6 py-4 bg-white text-red-600 font-black text-[10px] uppercase rounded-xl shadow-2xl">
                             ESCALATE TO MASTER CORE 🔱
                        </button>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default OutsourceRiskTerminal;
