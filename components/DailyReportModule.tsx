import React, { useState, useEffect, useMemo } from 'react';
import { 
  UserRole, UserPosition, PersonaID, LearnedTemplate
} from '../types';
import { LearningEngine } from '../services/learningEngine';
import AIAvatar from './AIAvatar';

interface DailyReportModuleProps {
  currentRole: UserRole;
  currentPosition: UserPosition;
  logAction: (action: string, details: string) => void;
}

const DailyReportModule: React.FC<DailyReportModuleProps> = ({ currentRole, currentPosition, logAction }) => {
  const [learnedTpl, setLearnedTpl] = useState<LearnedTemplate | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const tpl = LearningEngine.getTemplate(currentPosition);
    if (tpl) setLearnedTpl(tpl);
  }, [currentPosition]);

  const handleToggleTask = (taskId: string) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const handleSubmitProtocol = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      logAction('DIRECT_EXECUTION_COMMIT', `Nhân sự ${currentPosition.role} đã thực thi báo cáo.`);
      alert("✅ Giao thức niêm phong thành công (EXECUTION DIRECT).");
      setCompletedTasks([]);
      setIsSubmitting(false);
    }, 1000);
  };

  if (!learnedTpl) {
    return (
      <div className="h-full flex flex-col bg-black p-12 items-center justify-center opacity-40">
         <h2 className="text-3xl font-serif uppercase tracking-widest italic">Node Standby</h2>
      </div>
    );
  }

  const progress = Math.round((completedTasks.length / (learnedTpl.dailyTasks.length || 1)) * 100);

  return (
    <div className="h-full flex flex-col bg-[#020202] p-10 overflow-y-auto no-scrollbar gap-10 animate-in fade-in duration-700">
      <header className="border-b border-white/5 pb-8 flex justify-between items-end">
        <div>
          <h2 className="ai-headline text-5xl italic uppercase tracking-tighter">EXECUTION DIRECT</h2>
          <p className="ai-sub-headline text-red-500 font-black tracking-[0.4em] mt-2 uppercase">Ident: {currentPosition.role} • Mode: Master Override</p>
        </div>
        <p className="text-4xl font-mono font-black text-amber-500 italic">{progress}%</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
         <div className="xl:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-white uppercase italic tracking-widest flex items-center gap-3">
               <span className="text-2xl">⚡</span> Danh mục Thực thi
            </h3>
            {learnedTpl.dailyTasks.map((t: any, i: number) => (
              <div 
                key={i} 
                onClick={() => handleToggleTask(`task-${i}`)}
                className={`p-6 rounded-[2.5rem] border transition-all flex items-center gap-6 cursor-pointer ${
                  completedTasks.includes(`task-${i}`) ? 'bg-green-500/10 border-green-500/30' : 'bg-white/[0.02] border-white/10 hover:border-red-500/30'
                }`}
              >
                 <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${completedTasks.includes(`task-${i}`) ? 'bg-green-500 border-green-500 text-black' : 'border-white/10 text-transparent'}`}>
                    {completedTasks.includes(`task-${i}`) ? '✓' : ''}
                 </div>
                 <div className="flex-1">
                    <h4 className="text-sm font-bold text-white uppercase">{t.task}</h4>
                    <p className="text-[10px] text-gray-500 italic mt-1">{t.description}</p>
                 </div>
                 {t.canApprove && (
                    <div className="px-4 py-2 bg-red-600 text-white text-[8px] font-black uppercase rounded-lg">DIRECT APPROVAL</div>
                 )}
              </div>
            ))}
         </div>

         <div className="space-y-8">
            <div className="ai-panel p-10 bg-gradient-to-br from-red-950/20 to-transparent border-red-500/20 shadow-2xl">
               <h3 className="text-sm font-black text-red-500 uppercase tracking-widest mb-10 border-b border-white/5 pb-4 italic">Xác thực Mật lệnh</h3>
               <button 
                 onClick={handleSubmitProtocol}
                 className="w-full py-6 bg-amber-500 text-black font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl shadow-xl hover:bg-amber-400 active:scale-95"
               >
                 {isSubmitting ? 'BĂM SHARD...' : 'XÁC THỰC & ĐẨY DỮ LIỆU →'}
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default DailyReportModule;