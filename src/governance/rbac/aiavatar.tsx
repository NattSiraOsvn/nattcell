import React from 'react';
import { PersonaID } from '../../types';

interface AIAvatarProps {
  personaId?: PersonaID;
  size?: number;
}

const AIAvatar: React.FC<AIAvatarProps> = ({ personaId, size = 40 }) => {
  return (
    <div style={{ width: size, height: size }} className="rounded-full bg-cyan-900 flex items-center justify-center text-xs text-white">
      {personaId?.slice(0, 2) ?? 'AI'}
    </div>
  );
};

export default AIAvatar;
