
import React, { useState } from 'react';
// 🛠️ Fixed: Import casing for PersonaID and ChatMessage to match standardized types.ts
import { PersonaID, ChatMessage } from '../types.ts';
import { generate_persona_response } from '../services/gemini-service.ts';
import AIAvatar from './ai-avatar.tsx';

const ChatConsultant: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', content: 'Chào Anh Natt, Thiên sẵn sàng hỗ trợ Anh rà soát Shard dữ liệu.', personaId: PersonaID.THIEN, persona_id: PersonaID.THIEN, timestamp: Date.now(), type: 'text' }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input, personaId: PersonaID.THIEN, persona_id: PersonaID.THIEN, timestamp: Date.now(), type: 'text' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      const res = await generate_persona_response(PersonaID.THIEN, input);
      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', content: res.text, personaId: PersonaID.THIEN, persona_id: PersonaID.THIEN, timestamp: Date.now(), type: 'text' };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-black/40 p-8">
      <header className="mb-8 border-b border-white/5 pb-6">
         <h2 className="text-3xl font-serif gold-gradient italic uppercase tracking-tighter">AI Copilot Terminal</h2>
      </header>

      <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar pb-10">
        {messages.map(m => (
          <div key={m.id} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
             <AIAvatar personaId={m.personaId} size="sm" />
             <div className={`p-6 rounded-3xl max-w-xl text-sm italic font-light leading-relaxed ${m.role === 'user' ? 'bg-amber-500 text-black' : 'bg-white/5 text-gray-300'}`}>
                {m.content}
             </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
         <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Nhập mật lệnh cho Thiên..."
            className="flex-1 bg-transparent border-none outline-none text-white text-sm"
         />
         <button onClick={handleSend} disabled={isThinking} className="px-6 py-2 bg-amber-500 text-black font-black rounded-xl uppercase text-[10px]">Gửi</button>
      </div>
    </div>
  );
};

export default ChatConsultant;
