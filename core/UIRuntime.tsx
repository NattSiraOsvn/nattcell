
import React, {
  useState, useEffect, useRef, useCallback, createContext, useContext, ReactNode, PropsWithChildren
} from 'react';
import DESIGN_TOKENS from './design-tokens';

/**
 * 💎 NATT-OS UI RUNTIME v8.2 (CONSTITUTIONAL COMPLIANCE)
 * Lõi vận hành UI tuân thủ tuyệt đối Design Tokens.
 */

/* ===================== TOKEN MAPPING ===================== */
export const TOKENS = {
  // Mapping trực tiếp từ Hiến chương
  spacing: DESIGN_TOKENS.spacing,
  radius: DESIGN_TOKENS.geometry.radius,
  duration: DESIGN_TOKENS.animation.durations,
  
  // Physics Configuration (Tuned for Industrial Luxury feel)
  motion: {
    inertia: 0.92,
    drag: 0.88,
    spring: {
      soft: { stiffness: 120, damping: 18 },
      normal: { stiffness: 180, damping: 22 },
      hard: { stiffness: 260, damping: 28 }
    }
  },

  haptic: {
    intensity: { light: 0.25, normal: 0.5, heavy: 0.9 },
    pattern: {
      click: [20],
      confirm: [40, 20, 40],
      error: [90, 40, 90]
    }
  },

  system: {
    uiDensity: { compact: 0.85, normal: 1, relaxed: 1.15 }
  }
};

/* ===================== HAPTIC ENGINE ===================== */
export const HapticEngine = {
  vibrate(type: 'click' | 'confirm' | 'error' = 'click', intensity = TOKENS.haptic.intensity.normal) {
    if (!navigator.vibrate) return;
    const base = TOKENS.haptic.pattern[type] || TOKENS.haptic.pattern.click;
    const scaled = base.map(v => Math.max(10, v * intensity));
    navigator.vibrate(scaled);
  }
};

/* ===================== PHYSICS ENGINE ===================== */
export const PhysicsEngine = {
  inertia({ position, velocity }: { position: number, velocity: number }) {
    const v = velocity * TOKENS.motion.inertia;
    return { position: position + v, velocity: v };
  },

  spring({ position, target, velocity, preset = 'normal' }: { position: number, target: number, velocity: number, preset?: 'soft' | 'normal' | 'hard' }) {
    const { stiffness, damping } = TOKENS.motion.spring[preset];
    const force = -stiffness * (position - target);
    const accel = force - damping * velocity;
    const v = velocity + accel * 0.016;
    return { position: position + v, velocity: v };
  }
};

/* ===================== MOTION SENSOR ===================== */
interface MotionState {
  velocity: { x: number, y: number };
  acceleration: { x: number, y: number };
  last: { x: number, y: number, t: number };
}

const MotionContext = createContext<{ state: MotionState, update: (x: number, y: number) => void } | null>(null);

export const MotionProvider = ({ children }: PropsWithChildren<{}>) => {
  const ref = useRef<MotionState>({
    velocity: { x: 0, y: 0 },
    acceleration: { x: 0, y: 0 },
    last: { x: 0, y: 0, t: Date.now() }
  });

  const update = useCallback((x: number, y: number) => {
    const now = Date.now();
    const dt = Math.max(16, now - ref.current.last.t);

    const vx = (x - ref.current.last.x) / dt * 100;
    const vy = (y - ref.current.last.y) / dt * 100;

    ref.current.acceleration = {
      x: vx - ref.current.velocity.x,
      y: vy - ref.current.velocity.y
    };

    ref.current.velocity = { x: vx, y: vy };
    ref.current.last = { x, y, t: now };
  }, []);

  return (
    <MotionContext.Provider value={{ state: ref.current, update }}>
      {children}
    </MotionContext.Provider>
  );
};

export const useMotion = () => {
    const context = useContext(MotionContext);
    if (!context) throw new Error("useMotion must be used within MotionProvider");
    return context;
};

/* ===================== CONTEXTUAL UI ENGINE ===================== */
export type UIMode = 'night' | 'morning' | 'work' | 'evening' | 'fast' | 'precise' | 'ai' | 'heavy' | 'command' | 'normal';

const ContextualUIContext = createContext<{ mode: UIMode } | null>(null);

export const ContextualUIProvider = ({ role = 'standard', children }: PropsWithChildren<{ role?: string }>) => {
  const { state } = useMotion();
  const [mode, setMode] = useState<UIMode>('normal');

  useEffect(() => {
    const hour = new Date().getHours();
    const speed = Math.abs(state?.velocity.x || 0) + Math.abs(state?.velocity.y || 0);

    if (role === 'command') setMode('command');
    else if (role === 'ai') setMode('ai');
    else if (speed > 120) setMode('fast');
    else if (hour >= 20 || hour < 6) setMode('night');
    else setMode('precise');
  }, [state, role]);

  return (
    <ContextualUIContext.Provider value={{ mode }}>
      {children}
    </ContextualUIContext.Provider>
  );
};

export const useContextualUI = () => {
    const context = useContext(ContextualUIContext);
    if (!context) throw new Error("useContextualUI must be used within ContextualUIProvider");
    return context;
};

/* ===================== UI RUNTIME PROVIDER (ROOT) ===================== */
export const UIRuntimeProvider = ({ role, children }: PropsWithChildren<{ role: string }>) => {
  return (
    <MotionProvider>
      <ContextualUIProvider role={role}>
          {children}
      </ContextualUIProvider>
    </MotionProvider>
  );
};
