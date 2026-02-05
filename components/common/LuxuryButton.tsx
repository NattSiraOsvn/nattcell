
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Natt3DIcon, IconType } from './Natt3DIcon.tsx';

interface LuxuryButtonProps {
  icon?: IconType | string;
  label: string;
  onClick: () => Promise<void> | void;
  variant?: 'primary' | 'danger' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

/**
 * 🔱 LUXURY BUTTON - OMEGA DESIGN SYSTEM
 * Tích hợp hiệu ứng 3D, Gradient Gold và phản hồi haptic ảo.
 */
export const LuxuryButton: React.FC<LuxuryButtonProps> = ({
  icon,
  label,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  className = ''
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || loading || isProcessing) return;
    
    setIsProcessing(true);
    try {
      await onClick();
    } finally {
      setIsProcessing(false);
    }
  };

  const sizeMap = {
    small: { padding: '8px 20px', fontSize: '11px', iconSize: 16 },
    medium: { padding: '14px 32px', fontSize: '13px', iconSize: 20 },
    large: { padding: '18px 45px', fontSize: '16px', iconSize: 26 }
  };

  const variantMap = {
    primary: {
      gradient: 'linear-gradient(135deg, #D4AF37 0%, #F9F295 50%, #D4AF37 100%)',
      shadow: 'rgba(212, 175, 55, 0.4)',
      textColor: '#000'
    },
    danger: {
      gradient: 'linear-gradient(135deg, #ff4d4f 0%, #cf1322 100%)',
      shadow: 'rgba(255, 77, 79, 0.4)',
      textColor: '#fff'
    },
    success: {
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      shadow: 'rgba(16, 185, 129, 0.4)',
      textColor: '#fff'
    },
    warning: {
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      shadow: 'rgba(245, 158, 11, 0.4)',
      textColor: '#000'
    }
  };

  const config = sizeMap[size];
  const theme = variantMap[variant];

  return (
    <motion.button
      className={`relative group overflow-hidden transition-all duration-300 ${className}`}
      onClick={handleClick}
      disabled={disabled || loading || isProcessing}
      style={{
        padding: config.padding,
        fontSize: config.fontSize,
        fontWeight: 800,
        background: theme.gradient,
        color: theme.textColor,
        borderRadius: '16px',
        border: 'none',
        cursor: (disabled || loading || isProcessing) ? 'not-allowed' : 'pointer',
        boxShadow: `0 8px 32px -4px ${theme.shadow}`,
        opacity: disabled ? 0.4 : 1,
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px'
      }}
      whileHover={!disabled && !loading && !isProcessing ? {
        scale: 1.02,
        y: -2,
        boxShadow: `0 15px 45px -5px ${theme.shadow}`
      } : {}}
      whileTap={!disabled && !loading && !isProcessing ? { scale: 0.98, y: 0 } : {}}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      {(loading || isProcessing) && (
        <div className="absolute inset-0 z-10 overflow-hidden">
          <div className="w-full h-full bg-white/20 animate-scan absolute top-0"></div>
        </div>
      )}

      <div className="relative flex items-center gap-2 z-11">
        <AnimatePresence mode="wait">
          {(loading || isProcessing) ? (
            <motion.div
              key="loading"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Natt3DIcon type="radar" size={config.iconSize} pulse />
            </motion.div>
          ) : icon ? (
            <motion.div key="icon" initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <Natt3DIcon type={icon} size={config.iconSize} />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <span className="relative">{label}</span>
      </div>
    </motion.button>
  );
};
