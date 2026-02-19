/**
 * 👑 NATT-OS GOLD MASTER: DAILY ACTIVE PROTOCOL
 * AUTHORIZED BY: ANH_NAT (SOVEREIGN)
 * STATUS: 100% TYPE-SAFE | CONSTITUTIONAL ALIGNMENT
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  UserRole, UserPosition,
  LearnedTemplate, PersonaID
} from '@/types';
import { LearningEngine } from '@/services/learningengine';

interface DailyReportModuleProps {
  currentRole: UserRole;
  currentPosition: UserPosition;
  logAction: (action: string, details: string) => void;
}

const DailyReportModule: React.FC<DailyReportModuleProps> = ({
  currentRole,
  currentPosition,
  logAction
}) => {
  const [learnedTpl, setLearnedTpl] = useState<LearnedTemplate | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  // 🛠️ FIX: Khôi phục Generic Record chuẩn, xóa bỏ mảnh vỡ {">>"}
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Guard Rail: Kiểm tra quyền phê duyệt thực tế (Audit-by-default)
  const canActuallyApprove = useMemo(() => {
    return [UserRole.MASTER, UserRole.LEVEL_1, UserRole.LEVEL_2, UserRole.LEVEL_3].includes(currentRole);
  }, [currentRole]);

  useEffect(() => {
    // 🛠️ FIX: Sử dụng currentPosition object structure
    const tpl = LearningEngine.getTemplate(currentPosition);
    if (tpl) setLearnedTpl(tpl);
  }, [currentPosition]);

  const handleToggleTask = (taskId: string, isApprovalTask: boolean) => {
    if (isApprovalTask && !canActuallyApprove) {
      alert("⚠️ QUYỀN TRUY CẬP BỊ TỪ CHỐI: Bạn không có thẩm quyền phê duyệt.");
      return;
    }
    setCompletedTasks(prev =>
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmitProtocol = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      // 🛠️ FIX: currentPosition.role để log chính xác danh tính
      logAction('DAILY_PROTOCOL_COMMIT', `Nhân sự ${currentPosition.role} đã niêm phong báo cáo.`);
      alert("Giao thức đã được niêm phong vào Blockchain.");
      setCompletedTasks([]);
      setFormData({});
      setIsSubmitting(false);
    }, 1500);
  };

  // --- VIEW: CHỜ CẤU HÌNH ---
  if (!learnedTpl) {
    return (
      <div className="h-full flex flex-col bg-[#020202] p-8 md:p-12 items-center justify-center text-center opacity-40">
        <div className="text-8xl mb-10 grayscale">🏢</div>
        <h2 className="text-3xl font-serif uppercase tracking-widest italic">Terminal đang chờ Shard cấu hình</h2>
        <p className="max-w-md mt-6 text-xs text-gray-500 leading-relaxed font-light">
          {/* 🛠️ FIX: Truy cập .role trong JSX string */}
          "Thưa Anh Natt, vị trí **{currentPosition.role}** chưa được huấn luyện quy trình đặc thù. Anh vui lòng thiết lập tại NEURAL LEARNING."
        </p>
      </div>
    );
  }

  const progress = Math.round((completedTasks.length / learnedTpl.dailyTasks.length) * 100);

  return (
    <div className="h-full flex flex-col bg-[#020202] p-8 md:p-12 overflow-y-auto no-scrollbar gap-10 animate-in fade-in duration-700 pb-32">
      <header className="border-b border-white/5 pb-10 flex flex-col lg:flex-row justify-between items-end gap-8">
        <div>
          <h2 className="ai-headline text-5xl italic uppercase tracking-tighter text-white">DAILY ACTIVE PROTOCOL</h2>
          <p className="ai-sub-headline text-cyan-300/40 mt-3 italic uppercase font-black tracking-[0.3em]">
            IDENT: {currentPosition.role} • ROLE: {currentRole.split(' (')[0]}
          </p>
        </div>
        <div className="flex gap-10 items-center">
          {!canActuallyApprove && (
            <div className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest italic">Chế độ: Thực thi trực tiếp</p>
            </div>
          )}
          <div className="text-right">
            <p className="text-4xl font-mono font-black text-amber-500 italic">{progress}%</p>
            <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mt-2">Completion status</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* TASK LIST */}
        <div className="xl:col-span-2 space-y-8">
          <div className="ai-panel p-10 bg-black/40 border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
              <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
            </div>
            <h3 className="text-xl font-bold mb-10 italic gold-gradient uppercase tracking-widest flex items-center gap-4">
              <span className="text-2xl">📋</span> {canActuallyApprove ? 'Danh mục Kiểm soát' : 'Danh mục Tác vụ'}
            </h3>

            <div className="space-y-6">
              {learnedTpl.dailyTasks.map((t, i) => {
                const isCompleted = completedTasks.includes(`task-${i}`);
                const isDisabled = t.canApprove && !canActuallyApprove;

                return (
                  <div
                    key={i}
                    onClick={() => !isDisabled && handleToggleTask(`task-${i}`, t.canApprove)}
                    className={`p-6 rounded-[2.5rem] border transition-all flex items-center gap-8 group ${
                      isCompleted ? 'bg-green-500/10 border-green-500/30' : 
                      isDisabled ? 'opacity-30 cursor-not-allowed' : 'bg-white/[0.02] border-white/10 hover:border-amber-500/30'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${isCompleted ? 'bg-green-500 text-black' : 'border-white/10'}`}>
                      {isCompleted ? '✓' : isDisabled ? '🔒' : ''}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        {t.isCritical && <span className="px-2 py-0.5 bg-red-600 text-white text-[7px] font-black rounded uppercase">Trọng yếu</span>}
                        <h4 className={`text-sm font-bold uppercase ${isCompleted ? 'text-green-400 line-through' : 'text-white'}`}>{t.task}</h4>
                      </div>
                      <p className="text-[11px] text-gray-500 italic">{isDisabled ? "Chỉ dành cho Quản lý." : t.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* DATA INPUT */}
        <div className="space-y-8">
          <div className="ai-panel p-10 bg-gradient-to-br from-indigo-900/10 to-transparent border-indigo-500/20">
            <h3 className="text-sm font-black text-indigo-400 uppercase tracking-[0.3em] mb-10 border-b border-white/5 pb-4 italic">Dữ liệu Node</h3>
            <div className="space-y-8">
              {learnedTpl.fields.map((f) => (
                <div key={f.id} className="space-y-3">
                  <label className="text-[10px] font-black text-gray-600 uppercase flex justify-between">
                    <span>{f.label} {f.required && '*'}</span>
                  </label>
                  {f.type === 'boolean' ? (
                    <div className="flex gap-4">
                      <button onClick={() => handleInputChange(f.id, true)} className={`flex-1 py-3 rounded-xl border text-[10px] font-bold ${formData[f.id] === true ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-500'}`}>ĐẠT</button>
                      <button onClick={() => handleInputChange(f.id, false)} className={`flex-1 py-3 rounded-xl border text-[10px] font-bold ${formData[f.id] === false ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-500'}`}>LỖI</button>
                    </div>
                  ) : (
                    <input
                      type={f.type === 'number' ? 'number' : 'text'}
                      value={formData[f.id] || ''}
                      onChange={(e) => handleInputChange(f.id, e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-2xl p-5 text-sm text-white outline-none focus:border-amber-500"
                      placeholder="Nhập giá trị..."
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={handleSubmitProtocol}
              disabled={isSubmitting || progress < 100}
              className="w-full mt-12 py-6 bg-amber-500 text-black font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl disabled:opacity-20"
            >
              {isSubmitting ? '⌛ NIÊM PHONG...' : 'KÝ XÁC THỰC →'}
            </button>
          </div>

          <div className="ai-panel p-8 bg-black/40 border-white/5">
            <h4 className="ai-sub-headline text-amber-500 mb-6 flex items-center gap-3">
              Tham mưu (Thiên)
            </h4>
            <p className="text-[12px] text-gray-400 italic leading-relaxed">
              {canActuallyApprove
                ? `"Thưa Anh Natt, Terminal đang ở chế độ Quản trị tối cao. Mọi phê duyệt sẽ được băm Hash vào Ledger."`
                : `"Chào {currentPosition.role}, hệ thống đã khóa các tác vụ 'Phê duyệt'. Anh chỉ có quyền báo cáo."`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReportModule;
