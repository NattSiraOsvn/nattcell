
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HapticEngine } from '../haptic/HapticEngine';

interface Props {
  x: number;
  y: number;
  z: number;
  value: string;
  size?: number;
  color?: string;
}

/**
 * 💎 DATAPOINT 3D
 * Thực thể dữ liệu có trọng lượng và không gian.
 */
export const DataPoint3D: React.FC<Props> = ({ x, y, z, value, size = 6, color = 'cyan' }) => {
  const [hovered, setHovered] = useState(false);

  const handleInteraction = () => {
    HapticEngine.vibrate('light');
    HapticEngine.simulateForce(0.3);
  };

  return (
    <motion.div
      className="absolute rounded-full cursor-pointer transition-all duration-500"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        transform: `translateZ(${z}px)`,
        background: hovered ? `var(--${color}-400)` : `var(--${color}-600)`,
        boxShadow: hovered 
          ? `0 0 30px var(--${color}-500), inset 0 0 10px white` 
          : `0 0 15px var(--${color}-900)`,
        zIndex: Math.round(z),
      }}
      onMouseEnter={() => { setHovered(true); handleInteraction(); }}
      onMouseLeave={() => setHovered(false)}
      animate={hovered ? { scale: 1.5, translateZ: z + 20 } : { scale: 1, translateZ: z }}
    >
      {hovered && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 px-3 py-1 rounded-lg text-[10px] font-bold text-white whitespace-nowrap border border-white/10 backdrop-blur-md">
          {value}
        </div>
      )}
    </motion.div>
  );
};
