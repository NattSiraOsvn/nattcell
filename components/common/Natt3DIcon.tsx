import React from 'react';
import { motion } from 'framer-motion';

export type IconType = 
  | 'audit' | 'shield' | 'lock' 
  | 'kill' | 'resume' | 'rollback'
  | 'success' | 'warning' | 'error'
  | 'server' | 'database' | 'network'
  | 'brain' | 'eye' | 'radar';

interface Natt3DIconProps {
  type: IconType | string;
  size?: number;
  status?: 'normal' | 'success' | 'warning' | 'error' | 'pending';
  pulse?: boolean;
  className?: string;
}

/**
 * 💎 NATT-OS 3D ICON SYSTEM
 * Icons mang phong cách Industrial Luxury (Gold & White).
 */
export const Natt3DIcon: React.FC<Natt3DIconProps> = ({
  type,
  size = 24,
  status = 'normal',
  pulse = false,
  className = ''
}) => {
  const statusColors = {
    normal: 'rgba(245, 158, 11, 0.4)',
    success: 'rgba(16, 185, 129, 0.4)',
    warning: 'rgba(245, 158, 11, 0.4)',
    error: 'rgba(239, 68, 68, 0.4)',
    pending: 'rgba(59, 130, 246, 0.4)'
  };

  const getEmojiFallback = (t: string) => {
    const map: Record<string, string> = {
      audit: '🎯', shield: '🛡️', lock: '🔒',
      kill: '⏹️', resume: '▶️', rollback: '↩️',
      success: '✅', warning: '⚠️', error: '❌',
      server: '🖥️', database: '💾', network: '🌐',
      brain: '🧠', eye: '👁️', radar: '📡'
    };
    return map[t] || '💠';
  };

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      animate={pulse ? {
        scale: [1, 1.1, 1],
        filter: [
          `drop-shadow(0 0 5px ${statusColors[status]})`,
          `drop-shadow(0 0 15px ${statusColors[status]})`,
          `drop-shadow(0 0 5px ${statusColors[status]})`
        ]
      } : {}}
      transition={pulse ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
      whileHover={{ scale: 1.1, rotateY: 15 }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#D4AF37', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#F9F295', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#D4AF37', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="3d-depth" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
            <feOffset in="blur" dx="2" dy="2" result="offsetBlur" />
            <feSpecularLighting in="blur" surfaceScale="5" specularConstant=".75" specularExponent="20" lightingColor="#ffffff" result="specOut">
              <fePointLight x="-5000" y="-10000" z="20000" />
            </feSpecularLighting>
            <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
            <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litGraphic" />
            <feMerge>
              <feMergeNode in="offsetBlur" />
              <feMergeNode in="litGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="50" cy="50" r="40" fill="url(#gold-grad)" filter="url(#3d-depth)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <text 
            x="50" y="60" 
            textAnchor="middle" 
            fill="black" 
            fontSize="36" 
            fontWeight="900" 
            fontFamily="serif"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {getEmojiFallback(type)}
        </text>
      </svg>
      
      {status !== 'normal' && (
        <motion.div
          className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white shadow-sm"
          style={{ backgroundColor: statusColors[status].replace('0.4', '1') }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};