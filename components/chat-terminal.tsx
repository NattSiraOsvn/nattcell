// 👑 sovereign: anh_nat
import React, { useState } from 'react';
import * as icons from 'lucide-react';
import AIAvatar from './ai-avatar.tsx';
import { persona_id } from '../types.ts';

const ChatTerminal = () => {
  const [input, setInput] = useState('');

  return (
    <div className="h-full flex flex-col bg-black/40 p-12">
      <header className="mb-12 border-b border-white/5 pb-8">
         <h2 className="text-4xl font-serif gold-gradient italic uppercase tracking-tighter">ai copilot hub</h2>
      </header>

      <div className="flex-1 overflow-y-auto space-y-8 no-scrollbar pr-4">
        <div className="flex gap-6">
           <AIAvatar personaId={persona_id.thien} size="md" />
           <div className="p-8 bg-white/[0.03] border border-white/5 rounded-[2.5rem] max-w-2xl text-stone-400 italic font-light leading-relaxed">
              "chào anh natt, thiên đã bóc tách xong 128 tệp tin hệ thống. cấu trúc lowercase đã được niêm phong vĩnh viễn. anh có mật lệnh nào cho thiên không?"
           </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4 p-4 bg-white/5 rounded-[2rem] border border-white/10 items-center">
         <icons.Terminal size={20} className="text-stone-600 ml-4" />
         <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder="nhập mật lệnh..."
            className="flex-1 bg-transparent border-none outline-none text-white text-sm italic font-light"
         />
         <button className="w-12 h-12 bg-amber-500 text-black rounded-2xl flex items-center justify-center shadow-lg hover:bg-amber-400 transition-all">
            <icons.Send size={20} />
         </button>
      </div>
    </div>
  );
};

export default ChatTerminal;