
/**
 * 🎨 NATT-OS DESIGN TOKENS v1.0.0 (GOLD ADMIN)
 * "DATA IS SACRED" - Single Source of Truth cho toàn bộ hệ thống UI.
 */

export const DESIGN_TOKENS = {
  colors: {
    midnight: {
      void: '#000000',
      base: '#0A0A0A',
      deep: '#121212',
      space: '#1A1A1A',
      nebula: '#0F0F1A'
    },
    gold: {
      primary: '#FFD700',
      warm: '#FFC107',
      cool: '#FFF8DC',
      dark: '#B8860B',
      spectrum: 'linear-gradient(135deg, #FFD700 0%, #FFC107 50%, #B8860B 100%)'
    },
    cyan: {
      primary: '#00FFFF',
      ice: '#4DFFFD',
      deep: '#00BFFF',
      flow: 'linear-gradient(90deg, #00BFFF 0%, #00FFFF 50%, #4DFFFD 100%)'
    },
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    }
  },
  spacing: {
    unit: 8,
    xs: 4, 
    sm: 8, 
    md: 16, 
    lg: 24, 
    xl: 32, 
    xxl: 48,
    layout: {
      containerPadding: 32,
      sectionGap: 48,
      componentGap: 24
    }
  },
  typography: {
    fontDisplay: "'Helvetica Now Display', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    weights: {
      regular: 400,
      medium: 500,
      bold: 700,
      black: 900
    }
  },
  effects: {
    blur: {
      sm: 'blur(4px)',
      md: 'blur(10px)',
      lg: 'blur(16px)',
      xl: 'blur(40px)'
    },
    glow: {
      subtle: '0 0 10px',
      medium: '0 0 20px',
      strong: '0 0 30px',
      critical: '0 0 40px'
    },
    shadows: {
      float: '0 10px 30px rgba(0,0,0,0.5)',
      depth: '0 20px 60px rgba(0,0,0,0.7)',
      inner: 'inset 0 0 20px rgba(255,215,0,0.1)'
    }
  },
  animation: {
    durations: {
      instant: 100,
      fast: 200,
      normal: 300,
      slow: 500,
      deliberate: 1000
    },
    easings: {
      standard: [0.4, 0, 0.2, 1],
      decelerate: [0, 0, 0.2, 1],
      accelerate: [0.4, 0, 1, 1],
      spring: [0.68, -0.55, 0.265, 1.55]
    }
  },
  geometry: {
    cubeSize: 200,
    sphereDiameter: 300,
    cardRatio: 1.618,
    radius: {
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      full: 9999
    }
  }
} as const;

export default DESIGN_TOKENS;
