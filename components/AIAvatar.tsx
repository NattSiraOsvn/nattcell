
import React from 'react';
import { PersonaID } from '../types';
import { PERSONAS } from '../constants';

interface AIAvatarProps {
  personaId: PersonaID;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isThinking?: boolean;
}

/**
 * 🤖 AI AVATAR COMPONENT
 * Hiển thị nhận diện các Persona trong hệ sinh thái.
 */
const AIAvatar: React.FC<AIAvatarProps> = ({ personaId, size = 'md', isThinking = false }) => {
  const persona = PERSONAS[personaId];
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  return (
    <div className={`relative ${sizeClasses[size]} shrink-0`}>
      {/* Neural Link Glow */}
      <div className={`absolute inset-0 rounded-full border-2 border-amber-500/30 ${isThinking ? 'animate-spin' : ''}`}></div>
      
      <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/10 p-1 bg-black">
        <img 
          src={persona?.avatar || 'https://lh3.googleusercontent.com/d/1nCMP1A3Ge8JMb2X7K6fQrcemZDTvF-ud'} 
          className={`w-full h-full rounded-full object-cover grayscale transition-all duration-500 ${isThinking ? 'blur-[1px] brightness-125 grayscale-0' : 'group-hover:grayscale-0'}`} 
          alt={persona?.name || 'Persona'} 
        />
      </div>

      {isThinking && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.8)] border-2 border-black flex items-center justify-center">
           <span className="text-[6px] text-black font-black">AI</span>
        </div>
      )}
    </div>
  );
};

export default AIAvatar;
