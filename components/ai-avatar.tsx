// 👑 sovereign: anh_nat
import React from 'react';
import { persona_id } from '../types.ts';

const avatars: Record<string, string> = {
  thien: 'https://lh3.googleusercontent.com/d/1nCMP1A3Ge8JMb2X7K6fQrcemZDTvF-ud',
  can: 'https://lh3.googleusercontent.com/d/1DevqOFX3Kc4pJGHgXysWmdU8tMYTigw3',
  kris: 'https://lh3.googleusercontent.com/d/1DevqOFX3Kc4pJGHgXysWmdU8tMYTigw3'
};

const AIAvatar: React.FC<{ personaId: persona_id; size?: 'sm' | 'md' | 'lg' }> = ({ personaId, size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'w-10 h-10' : size === 'md' ? 'w-16 h-16' : 'w-24 h-24';
  
  return (
    <div className={`${sizeClass} rounded-2xl overflow-hidden border-2 border-amber-500/30 p-1 bg-black shrink-0 shadow-2xl`}>
      <img 
        src={avatars[personaId] || avatars.thien} 
        className="w-full h-full object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-700" 
        alt="avatar" 
      />
    </div>
  );
};

export default AIAvatar;