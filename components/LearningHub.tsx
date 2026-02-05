
import React, { useState, useRef } from 'react';
import { UserPosition, UserRole, LearnedTemplate, PersonaID } from '../types';
import { LearningEngine } from '../services/learningEngine';
import AIAvatar from './AIAvatar';
import * as XLSX from 'xlsx';
// 🛠️ Fixed: Changed import casing to match superdictionary.ts
// Changed SUPER_DICTIONARY to superdictionary
import { superdictionary } from '../superdictionary';
import ThreatDetectionService from '../services/threatDetectionService';

interface LearningHubProps {
  currentPosition: UserPosition;
  currentRole: UserRole;
  logAction: (action: string, details: string) => void;
}

const LearningHub: React.FC<LearningHubProps> = ({ currentPosition, currentRole, logAction }) => {
  const [isLearning, setIsLearning] = useState(false);
  const [rawInput, setRawInput] = useState('');
  const [learnedResult, setLearnedResult] = useState<any | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<{name: string, data: string, mimeType: string}[]>([]);
  const [preDetectedType, setPreDetectedType] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const SUPPORTED_VISUAL_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif', 'application/pdf'];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Explicitly cast to File[] to avoid inference issues with Array.from on FileList
    const fileList = Array.from(files) as File[];

    for (const file of fileList) {
      // --- SECURITY SCAN ---
      const isSafe = await ThreatDetectionService.scanFile(file);
      if (!isSafe) {
        alert(`❌ File "${file.name}" đã bị chặn bởi hệ thống bảo mật Omega.`);
        continue;
      }
      // ---------------------

      const fileName = file.name.toLowerCase();
      
      if (SUPPORTED_VISUAL_TYPES.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setSelectedFiles(prev => [...prev, {
            name: file.name,
            data: ev.target?.result as string,
            mimeType: file.type
          }]);
        };
        reader.readAsDataURL(file);
      } 
      else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const data = new Uint8Array(ev.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            let fullText = `\n\n--- DỮ LIỆU BẢNG TÍNH EXCEL [${file.name}] ---`;
            workbook.SheetNames.slice(0, 3).forEach(sheetName => {
              const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName], { FS: ",", RS: "\n" });
              fullText += `\n[SHEET: ${sheetName}]\n${csv.split("\n").slice(0, 300).join("\n")}`;
            });
            setRawInput(prev => (prev + fullText).substring(0, 50000));
          } catch (err) { console.error(err); }
        };
        reader.readAsArrayBuffer(file);
      }
    }
  };

  const handleLearn = async () => {
    // --- SPAM CHECK ---
    ThreatDetectionService.checkInputContent(rawInput);
    // ------------------

    setIsLearning(true);
    setLearnedResult(null);
    setIsVerified(false);
    
    try {
      const visualFiles = selectedFiles.filter(f => SUPPORTED_VISUAL_TYPES.includes(f.mimeType));
      const template = await LearningEngine.learnFromMultimodal(currentPosition, currentRole, {
        text: rawInput,
        files: visualFiles.map(f => ({ data: f.data, mimeType: f.mimeType, name: f.name }))
      });
      setLearnedResult(template);
      // Wait for manual verification before saving
    } catch (e: any) {
      alert(`Neural Link Error: ${e.message}`);
    } finally {
      setIsLearning(false);
    }
  };

  const handleConfirmLearning = () => {
    if (!learnedResult) return;
    LearningEngine.saveTemplate(learnedResult);
    setIsVerified(true);
    /* Fix: use currentPosition.role string for logging */
    logAction('AI_NEURAL_LEARN_CONFIRMED', `Đã xác thực và niêm phong quy trình cho ${currentPosition.role}. Role: ${currentRole}`);
    alert("✅ Đã ghi nhớ kiến thức mới vào Neural Core!");
  };

  return (
    <div className="h-full flex flex-col bg-[#020202] p-8 md:p-12 overflow-y-auto no-scrollbar gap-10 animate-in fade-in duration-700 pb-32">
      <header className="border-b border-white/5 pb-10 flex justify-between items-end">
        <div>
          <h2 className="ai-headline text-5xl italic uppercase tracking-tighter">Cognitive Neural Learning</h2>
          <p className="ai-sub-headline text-cyan-300/40 mt-3 italic uppercase font-black">Xác lập quy trình đặc thù theo vai trò Identity</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 shrink-0">
           <div className="px-6 py-2">
              {/* Fix: currentPosition is an object, render role property */}
              <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">{currentPosition.role}</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         <div className="space-y-8">
            <div className="ai-panel p-10 bg-black/40 border-white/10 relative overflow-hidden group">
               <h3 className="text-xl font-bold mb-6 italic text-amber-500 uppercase tracking-widest">Cổng nạp tri thức Shard</h3>
               <textarea 
                 value={rawInput}
                 onChange={(e) => setRawInput(e.target.value)}
                 className="w-full bg-black/60 border border-white/10 rounded-2xl p-6 text-sm text-gray-300 h-48 focus:border-amber-500 outline-none transition-all font-light italic mb-6 shadow-inner"
                 placeholder="Dán dữ liệu báo cáo/Excel để Thiên bóc tách quy trình tác vụ..."
               />
               <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                     {selectedFiles.map((f, i) => (
                        <div key={i} className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3 text-[10px] text-gray-400">
                           <span>📄 {f.name}</span>
                        </div>
                     ))}
                  </div>
                  <button onClick={() => fileInputRef.current?.click()} className="w-full py-4 border border-dashed border-white/20 text-gray-500 font-black text-[10px] uppercase rounded-2xl hover:border-amber-500 transition-all">📎 Nạp tệp cấu trúc (Excel/PDF)</button>
                  <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileSelect} />
               </div>
               <button onClick={handleLearn} disabled={isLearning || (!rawInput.trim() && selectedFiles.length === 0)} className="w-full mt-8 py-6 bg-amber-500 text-black font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl shadow-xl hover:bg-amber-400 transition-all disabled:opacity-20 active:scale-95">
                 {isLearning ? 'THIÊN ĐANG PHÂN TÁCH ROLE...' : 'XÁC LẬP GIAO THỨC TÁC VỤ →'}
               </button>
            </div>

            <div className="ai-panel p-8 bg-blue-500/5 border-blue-500/20">
               <div className="flex items-center gap-4 mb-6">
                  <AIAvatar personaId={PersonaID.THIEN} size="sm" isThinking={isLearning} />
                  <h4 className="ai-sub-headline text-blue-400 italic">Thiên - Tham mưu Shard</h4>
               </div>
               <p className="text-[13px] text-gray-400 italic leading-relaxed font-light">"Thưa Anh Natt, Thiên đã cập nhật logic RBAC (Role-Based Access Control) vào bộ não bóc tách. Nếu Anh nạp file báo cáo tổng, Thiên sẽ chỉ đề xuất các bước Nhập liệu cho Nhân viên và đề xuất Duyệt lệnh cho Anh hoặc Quản đốc."</p>
            </div>
         </div>

         <div className="space-y-8">
            {learnedResult ? (
              <div className="animate-in slide-in-from-right-10 duration-700">
                 <div className={`ai-panel p-10 shadow-2xl transition-all ${isVerified ? 'bg-green-500/10 border-green-500/50' : 'bg-green-500/5 border-green-500/20'}`}>
                    {/* Fix: currentPosition is an object, render role property */}
                    <h3 className="text-xl font-bold text-green-400 uppercase italic mb-8">Quy trình đã thiết lập cho {currentPosition.role}</h3>
                    
                    <div className="space-y-10">
                       <section>
                          <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Tác vụ đặc thù:</p>
                          <div className="space-y-3">
                             {learnedResult.dailyTasks.map((t: any, i: number) => (
                               <div key={i} className={`p-4 rounded-2xl border flex items-center gap-4 ${t.canApprove ? 'bg-amber-500/5 border-amber-500/20' : 'bg-black/40 border-white/5'}`}>
                                  <span className={`w-2 h-2 rounded-full ${t.canApprove ? 'bg-amber-500 animate-pulse' : 'bg-blue-500'}`}></span>
                                  <span className="text-xs text-gray-300 font-bold uppercase italic">{t.task}</span>
                                  {t.canApprove && <span className="ml-auto text-[7px] px-2 py-0.5 bg-amber-500 text-black rounded font-black">MANAGER ROLE</span>}
                               </div>
                             ))}
                          </div>
                       </section>
                    </div>

                    {!isVerified ? (
                        <div className="mt-12 flex gap-4">
                            <button 
                                onClick={handleConfirmLearning}
                                className="flex-1 py-5 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-green-400 transition-all shadow-xl"
                            >
                                ✅ XÁC NHẬN CHÍNH XÁC
                            </button>
                            <button 
                                onClick={() => { setLearnedResult(null); setRawInput(''); }}
                                className="flex-1 py-5 border border-red-500/30 text-red-500 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-red-500/10 transition-all"
                            >
                                ❌ TỪ CHỐI / HỌC LẠI
                            </button>
                        </div>
                    ) : (
                        <div className="mt-12 p-4 bg-green-500/20 rounded-2xl text-center border border-green-500/30">
                            <p className="text-[10px] font-black uppercase text-green-400 tracking-widest">Đã niêm phong vào bộ nhớ Shard vĩnh cửu.</p>
                        </div>
                    )}
                 </div>
              </div>
            ) : (
              <div className="ai-panel p-20 flex flex-col items-center justify-center text-center opacity-20 italic h-full">
                 <div className="text-[120px] mb-10 grayscale">🧬</div>
                 <p className="text-2xl font-serif">Nạp tri thức để Thiên bóc tách...</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default LearningHub;
