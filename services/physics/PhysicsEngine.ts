
import { TOKENS } from '../../core/UIRuntime.tsx';

/**
 * ⚛️ NATT-OS PHYSICS ENGINE v8.1
 */
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
