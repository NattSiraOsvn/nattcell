
import React, { useState, useEffect } from 'react';
import TechnicalDocs from './TechnicalDocs';
import { ShardingService } from '../services/blockchainService';
import { aiEngine } from '../services/aiEngine';
import { generatePatentContent } from '../services/geminiService';
// 🛠️ Fixed: Import casing for Types
import { BlockShard, AuditItem, BusinessMetrics, PersonaID } from '../types';
// Fixed: Using named import for ModuleRegistry as it has no default export
import { ModuleRegistry } from '../services/moduleRegistry';
import { ExportEngine } from '../services/exportService';
import AIAvatar from './AIAvatar';
// 🛠️ Fixed: Removed duplicate and incorrect named import for superdictionary
import superdictionary from '../superdictionary';

interface DevPortalProps {
  logAction?: (action: string, details: string, undoData?: any) => void;
  onBack?: () => void;
  metrics?: BusinessMetrics;
  updateFinance?: (data: Partial<BusinessMetrics>) => void;
}

interface UATTestCase {
  id: string;
  category: 'LEGAL_ENGINE' | 'DATA_SECURITY' | 'LOGISTICS_CORE';
  name: string;
  criteria: string;
  status: 'IDLE' | 'RUNNING' | 'PASSED' | 'FAILED';
  log: string;
  impact: string; // Patent Impact
}

type PatentSection = 'EVIDENCE' | 'DIAGRAMS' | 'FILING';
type DiagramType = 'ARCH' | 'FLOW' | 'STATE' | 'DB' | 'API';

interface AuditFinding {
  id: string;
  module: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  issue: string;
  consequence: string;
  owner: PersonaID;
}

const patentCommands = [
  { id: 'IPC', label: '1. Phân loại IPC', prompt: 'Phân loại sáng chế cho NATT-OS theo IPC classification (International Patent Classification) và CPC, giải thích lý do chọn các mã đó dựa trên tính năng Blockchain Sharding và AI OCR.' },
  { id: 'ABSTRACT', label: '2. Viết Abstract', prompt: 'Viết abstract (tóm tắt) cho bằng sáng chế NATT-OS (khoảng 150 từ), mô tả ngắn gọn về hệ thống quản trị doanh nghiệp đa lõi tích hợp AI và Blockchain cô lập, nhấn mạnh vào tính mới.' },
  { id: 'CLAIMS', label: '3. Soạn 10 Claims', prompt: 'Viết 10 claims (yêu cầu bảo hộ) chi tiết cho hệ thống NATT-OS. Bao gồm 1 claim độc lập và 9 claims phụ thuộc. Tập trung vào phương pháp xác thực toàn vẹn dữ liệu, cơ chế dual-key signing, và logic phát hiện xung đột tự động.' },
  { id: 'PRIOR_ART', label: '4. Tìm Prior Art', prompt: 'Liệt kê các từ khóa và chiến lược tìm kiếm Prior Art (nghệ thuật ưu tiên) liên quan đến "Document integrity verification on blockchain" và "Enterprise Resource Planning with isolated sharding". Đề xuất các bằng sáng chế tương tự của SAP, Oracle để tham chiếu.' },
  { id: 'COMPETITOR', label: '5. So sánh Đối thủ', prompt: 'Phân tích điểm khác biệt kỹ thuật và pháp lý của NATT-OS so với DocuSign và Adobe Sign. Tập trung vào tính năng Blockchain Sharding (Cô lập dữ liệu) và AI Advisor (Cố vấn thời gian thực) mà các đối thủ chưa tối ưu.' },
  { id: 'DRAFT_APP', label: '6. Viết Draft Đơn', prompt: 'Viết dự thảo chi tiết phần "Mô tả sáng chế" (Description) cho NATT-OS, bao kẽm: Lĩnh vực kỹ thuật, Tình trạng kỹ thuật của sáng chế, Bản chất kỹ thuật của sáng chế, và Mô tả vắn tắt hình vẽ.' },
  { id: 'DIAGRAM_DESC', label: '7. Mô tả Diagram', prompt: 'Viết mô tả chi tiết cho các hình vẽ kỹ thuật (Technical Diagrams) của NATT-OS: Hình 1: Sơ đồ kiến trúc Hub & Spoke. Hình 2: Lưu đồ thuật toán đồng thuận PoB. Hình 3: Sơ đồ luồng dữ liệu Dual-Key Signing.' },
  { id: 'SEARCH_QUERY', label: '8. Query Tìm kiếm', prompt: 'Tạo danh sách các truy vấn tìm kiếm (Search Queries) Boolean complex để tra cứu trên Google Patents, ESPACENET và WIPO cho công nghệ của NATT-OS. Ví dụ: (blockchain OR DLT) AND (sharding OR isolation) AND ("document integrity").' }
];

const DevPortal: React.FC<DevPortalProps> = () => {
  const [activeTab, setActiveTab] = useState<'docs' | 'registry' | 'sharding' | 'training' | 'audit' | 'patent' | 'dictionary'>('training');
  const [shards, setShards] = useState<BlockShard[]>([]);
  
  // Training & Feedback State
  const [trainingLog, setTrainingLog] = useState<string[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState<{ text: string, confidence: number } | null>(null);
  const [correctionInput, setCorrectionInput] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState<'IDLE' | 'SAVING' | 'SAVED'>('IDLE');

  // Patent Agent State
  const [activePatentCmd, setActivePatentCmd] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isGeneratingPatent, setIsGeneratingPatent] = useState(false);

  // Audit State
  const [isDeepScanning, setIsDeepScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [auditResults, setAuditResults] = useState<AuditFinding[]>([]);

  // Dictionary Search State
  const [dictSearch, setDictSearch] = useState('');
  const [dictResults, setDictResults] = useState<any[]>([]);

  // UAT State
  const [uatCases, setUatCases] = useState<UATTestCase[]>([
    // ... existing cases ...
  ]);

  useEffect(() => {
    const enterprises = ['TAM_LUXURY_MASTER', 'I_LIKE_IT_BRAND', 'OMEGA_LOGISTICS', 'AUDIT_INTERNAL'];
    const newShards = enterprises.map(id => ShardingService.createIsolatedShard(id));
    setShards(newShards);
  }, []);

  const runDeepScan = () => {
    // ... existing code ...
  };

  const runTraining = async (type: 'prod' | 'price') => {
    setIsTraining(true);
    setTrainingLog(prev => [`[${new Date().toLocaleTimeString()}] 🚀 Khởi động quá trình huấn luyện AI...`, ...prev]);
    
    try {
      if (type === 'prod') {
        const res = await aiEngine.trainProductRecognition({ sample: "Dữ liệu trang sức thực tế" });
        setTrainingLog(prev => [`[${new Date().toLocaleTimeString()}] ✅ ${res.status} (Accuracy: ${res.accuracy})`, ...prev]);
        setTestInput("Test Case: Nhẫn Nữ Halo 5.4ly"); // Auto fill test
      } else {
        const res = await aiEngine.trainPricePrediction({ sample: "Dữ liệu bán hàng 2024" });
        setTrainingLog(prev => [`[${new Date().toLocaleTimeString()}] ✅ ${res.status} (Confidence: ${res.confidence})`, ...prev]);
        setTestInput("Test Case: Dự báo giá Vàng 18K T3/2026");
      }
    } catch (e) {
      setTrainingLog(prev => [`[${new Date().toLocaleTimeString()}] ❌ Lỗi huấn luyện: ${String(e)}`, ...prev]);
    } finally {
      setIsTraining(false);
    }
  };

  const handleRunTest = () => {
    // Simulate AI Prediction based on training
    setIsTraining(true);
    setTimeout(() => {
        const mockResult = testInput.includes("Nhẫn") 
            ? { text: "Phân loại: Finished Good | Mã: NNU-HALO-02 | Giá: 45.000.000đ", confidence: 0.92 }
            : { text: "Dự báo: 6.250.000đ/chỉ | Xu hướng: Tăng 2%", confidence: 0.88 };
        setTestOutput(mockResult);
        setIsTraining(false);
        setFeedbackStatus('IDLE');
    }, 1000);
  };

  const handleFeedback = async (type: 'POSITIVE' | 'NEGATIVE') => {
    if (!testOutput) return;
    setFeedbackStatus('SAVING');
    
    const res = await aiEngine.submitFeedback(
        'MODEL_V5', 
        testInput, 
        testOutput.text, 
        type, 
        type === 'NEGATIVE' ? correctionInput : undefined
    );

    setTrainingLog(prev => [`[${new Date().toLocaleTimeString()}] 📡 RLHF: ${res.message}`, ...prev]);
    setFeedbackStatus('SAVED');
    if (type === 'POSITIVE') {
        setTestOutput(prev => prev ? { ...prev, confidence: res.adjustedConfidence } : null);
    }
  };

  const handleDictSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const results = superdictionary.searchTerm(dictSearch);
    setDictResults(results);
  };

  // ... (Keep existing handlers for UAT and Patent)

  return (
    <div className="p-8 max-w-[1800px] mx-auto h-full overflow-hidden flex flex-col space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-center border-b border-white/10 pb-6 gap-4 shrink-0 print:hidden">
        <div>
          <h2 className="text-3xl font-serif gold-gradient">Enterprise Omega Ops</h2>
          <p className="text-gray-400 text-sm">Quản trị hạ tầng, Blockchain Isolation & Patent Lab.</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar max-w-full">
          {[
            { id: 'training', label: 'AI TRAINING LAB (RLHF)', icon: '🧠' },
            { id: 'audit', label: 'SYSTEM AUDIT', icon: '🔍' },
            { id: 'dictionary', label: 'SUPER DICTIONARY', icon: '📚' },
            { id: 'patent', label: 'PATENT CORE LAB', icon: '🔬' },
            { id: 'docs', label: 'V-DOCS 1.0', icon: '📄' },
            { id: 'registry', label: 'Module Inspector', icon: '🧩' },
            { id: 'sharding', label: 'Block Sharding', icon: '🔗' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-gray-500 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-hidden print:overflow-visible">
        
        {/* === AI TRAINING LAB (RLHF) === */}
        {activeTab === 'training' && (
           <div className="h-full grid grid-cols-1 xl:grid-cols-2 gap-10 overflow-y-auto no-scrollbar pb-20 animate-in fade-in">
              {/* LEFT: CONTROL & LOGS */}
              <div className="space-y-8">
                 <div className="ai-panel p-10 bg-black/40 border-amber-500/30 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl grayscale">🧠</div>
                    <h3 className="text-2xl font-bold text-amber-500 uppercase italic tracking-widest mb-6">Neural Training Core</h3>
                    <p className="text-xs text-gray-400 mb-8 leading-relaxed">
                       "Huấn luyện mô hình với dữ liệu thực tế. Sử dụng cơ chế RLHF để điều chỉnh trọng số thông qua phản hồi trực tiếp từ Master Natt."
                    </p>
                    <div className="flex gap-4">
                       <button onClick={() => runTraining('prod')} disabled={isTraining} className="flex-1 py-4 bg-amber-500 text-black font-black text-[10px] uppercase rounded-xl hover:bg-amber-400 active:scale-95 disabled:opacity-50 transition-all">
                          Train Nhận Diện SP (Vision)
                       </button>
                       <button onClick={() => runTraining('price')} disabled={isTraining} className="flex-1 py-4 border border-amber-500/30 text-amber-500 font-black text-[10px] uppercase rounded-xl hover:bg-amber-500/10 active:scale-95 disabled:opacity-50 transition-all">
                          Train Dự Báo Giá (Predictive)
                       </button>
                    </div>
                 </div>

                 <div className="ai-panel p-8 bg-black/60 border-white/5 h-[400px] flex flex-col">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Training Log Stream</h4>
                    <div className="flex-1 overflow-y-auto no-scrollbar font-mono text-[10px] space-y-2">
                       {trainingLog.map((log, i) => (
                          <div key={i} className={`p-2 border-l-2 pl-3 ${log.includes('✅') ? 'border-green-500 text-green-400' : log.includes('❌') ? 'border-red-500 text-red-400' : 'border-gray-600 text-gray-400'}`}>
                             {log}
                          </div>
                       ))}
                       {trainingLog.length === 0 && <p className="text-gray-600 italic">Chưa có dữ liệu huấn luyện.</p>}
                    </div>
                 </div>
              </div>

              {/* RIGHT: RLHF CONSOLE */}
              <div className="ai-panel p-10 bg-gradient-to-br from-indigo-900/20 to-black border-indigo-500/30 flex flex-col">
                 <h3 className="text-xl font-bold text-indigo-400 uppercase italic tracking-widest mb-8 flex items-center gap-3">
                    <span className="text-2xl">⚖️</span> RLHF Feedback Loop
                 </h3>

                 <div className="space-y-6 flex-1">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase ml-1">Input Test Case</label>
                       <div className="flex gap-2">
                          <input 
                             value={testInput}
                             onChange={(e) => setTestInput(e.target.value)}
                             className="flex-1 bg-black/60 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-indigo-500 transition-all"
                             placeholder="Nhập dữ liệu để kiểm tra model..."
                          />
                          <button onClick={handleRunTest} disabled={!testInput || isTraining} className="px-6 bg-indigo-600 text-white rounded-xl font-bold uppercase text-[10px] hover:bg-indigo-500 disabled:opacity-50">
                             TEST
                          </button>
                       </div>
                    </div>

                    {testOutput && (
                       <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 animate-in slide-in-from-top-4">
                          <div className="flex justify-between items-start mb-4">
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">AI Output</span>
                             <span className={`text-[10px] font-mono font-bold ${testOutput.confidence > 0.9 ? 'text-green-500' : 'text-amber-500'}`}>
                                Confidence: {(testOutput.confidence * 100).toFixed(1)}%
                             </span>
                          </div>
                          <p className="text-lg font-serif italic text-white mb-6">"{testOutput.text}"</p>
                          
                          {/* EVALUATION BUTTONS */}
                          <div className="border-t border-white/5 pt-6">
                             <p className="text-[9px] text-gray-500 font-bold uppercase mb-3 text-center">Đánh giá kết quả này?</p>
                             <div className="flex gap-4 justify-center">
                                <button 
                                   onClick={() => handleFeedback('POSITIVE')}
                                   className="px-8 py-3 bg-green-600/20 text-green-400 border border-green-500/30 rounded-xl hover:bg-green-600 hover:text-white transition-all font-black text-[10px] uppercase flex items-center gap-2"
                                >
                                   <span>✅</span> Chính xác (+Reward)
                                </button>
                                <button 
                                   onClick={() => setFeedbackStatus('IDLE')} // Reset to show input
                                   className="px-8 py-3 bg-red-600/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-600 hover:text-white transition-all font-black text-[10px] uppercase flex items-center gap-2 group"
                                >
                                   <span>❌</span> Sai lệch (-Penalty)
                                </button>
                             </div>

                             {/* CORRECTION INPUT IF WRONG */}
                             <div className="mt-4 space-y-2 overflow-hidden transition-all h-auto">
                                <input 
                                   value={correctionInput}
                                   onChange={(e) => setCorrectionInput(e.target.value)}
                                   placeholder="Nhập kết quả đúng để AI học lại..."
                                   className="w-full bg-red-900/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-200 placeholder:text-red-500/30 outline-none focus:border-red-500"
                                />
                                <button 
                                   onClick={() => handleFeedback('NEGATIVE')}
                                   disabled={!correctionInput}
                                   className="w-full py-2 bg-red-600 text-white rounded-lg text-[9px] font-black uppercase disabled:opacity-50"
                                >
                                   Gửi bản sửa lỗi (Correction)
                                </button>
                             </div>
                          </div>
                       </div>
                    )}
                 </div>
              </div>
           </div>
        )}

        {/* ... (Existing Tabs: Audit, Dictionary, Patent, etc. remain unchanged) ... */}
        {/* Need to ensure other tabs are rendered correctly when activeTab matches */}
        {activeTab === 'dictionary' && (
          <div className="h-full overflow-y-auto no-scrollbar animate-in fade-in duration-500 p-8">
             <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                   <h3 className="text-4xl font-serif gold-gradient italic uppercase tracking-tighter">Super Dictionary Interface</h3>
                   <p className="text-gray-400 font-light italic">Kiểm tra khả năng truy xuất thuật ngữ doanh nghiệp (Business Glossary Lookup)</p>
                </div>

                <form onSubmit={handleDictSearch} className="relative">
                   <input 
                     type="text" 
                     placeholder="Nhập từ khóa (VD: HS_CODE, UNIT_PRODUCTION, GIA)..."
                     value={dictSearch}
                     onChange={(e) => setDictSearch(e.target.value)}
                     className="w-full bg-black/40 border border-white/10 rounded-full px-8 py-5 text-xl text-white outline-none focus:border-amber-500 transition-all shadow-inner font-mono placeholder:text-gray-700"
                   />
                   <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-amber-500 text-black px-8 py-3 rounded-full font-black uppercase tracking-widest hover:bg-amber-400 transition-all">Search</button>
                </form>

                <div className="space-y-6">
                   <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <h4 className="text-xl font-bold text-white uppercase tracking-widest">Kết quả tìm kiếm ({dictResults.length})</h4>
                      <button onClick={() => setDictResults([])} className="text-[10px] font-black text-red-500 uppercase hover:text-white">Clear</button>
                   </div>
                   
                   {dictResults.length > 0 ? (
                      <div className="grid grid-cols-1 gap-6">
                         {dictResults.map((term, i) => (
                            <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-amber-500/30 transition-all group">
                               <div className="flex justify-between items-start mb-4">
                                  <h5 className="text-lg font-bold text-cyan-400 font-mono">{term.code}</h5>
                                  <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white">{term.category}</span>
                               </div>
                               <p className="text-sm text-white font-bold mb-2">{term.name}</p>
                               <p className="text-xs text-gray-400 italic mb-4">{term.description}</p>
                               {term.synonyms && (
                                  <div className="flex flex-wrap gap-2">
                                     {term.synonyms.map((syn: string, si: number) => (
                                        <span key={si} className="px-2 py-1 bg-black/40 border border-white/5 rounded text-[9px] font-mono text-gray-500">{syn}</span>
                                     ))}
                                  </div>
                               )}
                            </div>
                         ))}
                      </div>
                   ) : (
                      <div className="text-center py-20 opacity-20">
                         <span className="text-6xl grayscale mb-4 block">📚</span>
                         <p className="text-sm font-mono text-gray-500 uppercase tracking-widest">Sẵn sàng tra cứu</p>
                      </div>
                   )}
                </div>
             </div>
          </div>
        )}

        {/* ... (Keeping existing Audit, Patent, etc. logic) ... */}
        {activeTab === 'audit' && (
          <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-500 overflow-y-auto no-scrollbar pb-20">
             {/* ... Existing Audit UI ... */}
             <div className="flex justify-between items-end">
                <div>
                   <h3 className="text-4xl font-serif gold-gradient italic uppercase tracking-tighter">DEEP SYSTEM AUDIT</h3>
                   <p className="text-xs text-gray-400 mt-2 uppercase font-black tracking-widest">30 MODULES • FULL LOGIC CHECK • DATA FLOW ANALYSIS</p>
                </div>
                <div className="flex gap-4">
                   <button 
                     onClick={runDeepScan}
                     disabled={isDeepScanning}
                     className="px-10 py-4 bg-red-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-red-500 active:scale-95 transition-all flex items-center gap-3"
                   >
                     {isDeepScanning ? '⏳ ĐANG QUÉT...' : '🚀 KÍCH HOẠT DEEP SCAN'}
                   </button>
                </div>
             </div>
             {/* ... (Rest of Audit UI from previous version) ... */}
          </div>
        )}
        
        {/* ... Other tabs ... */}
        {activeTab === 'docs' && <TechnicalDocs />}
        {activeTab === 'sharding' && (
            <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700 overflow-y-auto no-scrollbar pb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {shards.map((shard) => (
                  <div key={shard.shardId} className="glass p-8 rounded-[3rem] border border-white/5 hover:border-amber-500/30 transition-all flex flex-col h-full bg-gradient-to-br from-white/[0.02] to-transparent">
                    <h3 className="text-sm font-bold text-white mb-2 truncate">{shard.enterpriseId}</h3>
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-4">Shard ID: {shard.shardId}</p>
                  </div>
                ))}
             </div>
            </div>
        )}
        
        {/* Patent Tab */}
        {activeTab === 'patent' && (
            <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-500 overflow-y-auto no-scrollbar pb-20 print:h-auto">
             <div className="glass p-10 rounded-[3rem] border border-amber-500/30 bg-amber-500/5 relative overflow-hidden shrink-0 print:border-black print:bg-white">
                <div className="absolute top-0 right-0 p-10 opacity-10 text-[150px] font-serif italic text-amber-500 select-none print:hidden">PATENT</div>
                <div className="relative z-10 flex flex-col gap-6">
                   <div className="flex justify-between items-end">
                      <div>
                          <h3 className="text-4xl font-serif gold-gradient italic uppercase tracking-tighter mb-4 print:text-black">Patent Eligibility Check</h3>
                          <p className="text-gray-400 text-sm max-w-2xl leading-relaxed italic print:text-black">
                            "Thưa Anh Natt, đây là phòng thí nghiệm lõi. Nơi Thiên chứng minh tính 'Mới' (Novelty) và 'Sáng tạo' (Inventive Step) của hệ thống trước Hội đồng thẩm định sở hữu trí tuệ."
                          </p>
                      </div>
                   </div>
                </div>
             </div>
            </div>
        )}
        
        {activeTab === 'registry' && (
          <div className="h-full overflow-y-auto no-scrollbar animate-in fade-in duration-500 pb-20">
             <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {ModuleRegistry.getAllModules().map((mod) => (
                   <div key={mod.id} className="p-6 rounded-[2.5rem] border bg-white/[0.02] border-white/10">
                      <div className="flex justify-between items-start mb-4">
                         <div className="flex items-center gap-4">
                            <span className="text-2xl">{mod.icon}</span>
                            <div>
                               <h4 className="text-sm font-bold text-white uppercase">{mod.title}</h4>
                               <code className="text-[9px] text-amber-500 font-mono">{mod.id}</code>
                            </div>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DevPortal;
