
import React, { useState, useEffect, useMemo } from 'react';
import { GmailIntelligence } from '../services/gmailService';
import { EmailMessage, PersonaID, BusinessMetrics } from '../types';
import { generatePersonaResponse } from '../services/geminiService';

interface KrisEmailHubProps {
  logAction?: (action: string, details: string, undoData?: any) => void;
  onBack?: () => void;
  metrics?: BusinessMetrics;
  updateFinance?: (data: Partial<BusinessMetrics>) => void;
}

const KrisEmailHub: React.FC<KrisEmailHubProps> = () => {
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState('');
  
  // Search & Filter State
  const [searchEmail, setSearchEmail] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    setLoading(true);
    const data = await GmailIntelligence.fetchEmails();
    setEmails(data);
    setLoading(false);
  };

  const filteredEmails = useMemo(() => {
    return emails.filter(e => {
      const matchSearch = e.from.toLowerCase().includes(searchEmail.toLowerCase()) || 
                          e.subject.toLowerCase().includes(searchEmail.toLowerCase());
      const matchCat = categoryFilter === 'ALL' || e.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [emails, searchEmail, categoryFilter]);

  const handleSelectEmail = async (email: EmailMessage) => {
    setSelectedEmail(email);
    setAiAnalysis('Kris đang đọc và bóc tách dữ liệu...');
    const prompt = `Phân tích email này cho Anh Natt. 
    Từ: ${email.from} 
    Tiêu đề: ${email.subject}
    Nội dung: ${email.snippet}
    Hãy đề xuất việc bóc tách chứng từ này vào hệ thống Blockchain.`;
    
    const res = await generatePersonaResponse(PersonaID.KRIS, prompt);
    setAiAnalysis(res.text);
  };

  return (
    <div className="flex h-full animate-in fade-in duration-700 bg-black">
      {/* Inbox List */}
      <div className="w-[450px] glass border-r border-white/10 flex flex-col shrink-0">
        <div className="p-8 border-b border-white/5 bg-white/[0.02]">
           <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-serif gold-gradient italic">Kris Email Hub</h2>
           </div>
           
           {/* Internal Filters */}
           <div className="space-y-4">
              <div className="relative">
                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
                 <input 
                   type="text"
                   value={searchEmail}
                   onChange={(e) => setSearchEmail(e.target.value)}
                   placeholder="Tìm người gửi, tiêu đề..."
                   className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[10px] text-white outline-none focus:border-amber-500 transition-all"
                 />
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                 {/* Fix: Use correct Vietnamese categories for filtering */}
                 {['TẤT CẢ', 'CHÍNH PHỦ', 'LOGISTICS', 'HÓA ĐƠN'].map(cat => (
                   <button
                     key={cat}
                     onClick={() => setCategoryFilter(cat === 'TẤT CẢ' ? 'ALL' : cat)}
                     className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase whitespace-nowrap border transition-all ${
                       (categoryFilter === 'ALL' ? 'TẤT CẢ' : categoryFilter) === cat ? 'bg-amber-500 text-black border-amber-500' : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/10'
                     }`}
                   >
                     {cat}
                   </button>
                 ))}
              </div>
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-30">
               <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            </div>
          ) : (
            filteredEmails.map(email => (
              <div 
                key={email.id} 
                onClick={() => handleSelectEmail(email)}
                className={`p-5 rounded-[2rem] border transition-all cursor-pointer relative group ${
                  selectedEmail?.id === email.id ? 'bg-amber-500/10 border-amber-500' : 'bg-white/5 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase ${
                    // Fix: Use correct Vietnamese strings for style matching
                    email.category === 'CHÍNH PHỦ' ? 'bg-red-500/20 text-red-400' :
                    email.category === 'LOGISTICS' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {email.category}
                  </span>
                  <span className="text-[9px] text-gray-600 font-mono">{email.date}</span>
                </div>
                <h4 className="text-xs font-bold text-white mb-1 group-hover:text-amber-500 transition-colors truncate">{email.subject}</h4>
                <p className="text-[10px] text-gray-500 line-clamp-2 italic">{email.snippet}</p>
              </div>
            ))
          )}
          {filteredEmails.length === 0 && !loading && (
            <p className="text-center py-10 text-gray-600 italic text-xs">Không có thư khớp bộ lọc</p>
          )}
        </div>
      </div>

      {/* Email Detail & AI Processor */}
      <div className="flex-1 flex flex-col p-10 overflow-y-auto no-scrollbar">
         {selectedEmail ? (
           <div className="space-y-8 max-w-4xl mx-auto w-full">
              <div className="glass p-10 rounded-[3.5rem] border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent shadow-2xl">
                 <h3 className="text-2xl font-bold text-white mb-2">{selectedEmail.subject}</h3>
                 <p className="text-xs text-amber-500 font-mono italic mb-10">Từ: {selectedEmail.from}</p>
                 <div className="prose prose-invert text-sm text-gray-400 italic leading-relaxed mb-10 border-l-2 border-white/10 pl-6">
                    {selectedEmail.snippet}
                 </div>
              </div>

              <div className="glass p-10 rounded-[3rem] border border-amber-500/20 bg-amber-500/5 shadow-2xl">
                 <div className="flex items-center gap-4 mb-6">
                    <h4 className="text-amber-500 font-black text-[10px] uppercase tracking-[0.2em]">Kris - AI Email Auditor</h4>
                 </div>
                 <div className="text-[11px] text-gray-400 italic leading-relaxed whitespace-pre-wrap font-light">
                    {aiAnalysis}
                 </div>
              </div>
           </div>
         ) : (
           <div className="flex-1 flex flex-col items-center justify-center opacity-20 italic">
              <div className="text-9xl mb-8 grayscale">📥</div>
              <p className="text-2xl font-serif">Chọn Email để Kris bắt đầu nghiệp vụ.</p>
           </div>
         )}
      </div>
    </div>
  );
};

export default KrisEmailHub;
