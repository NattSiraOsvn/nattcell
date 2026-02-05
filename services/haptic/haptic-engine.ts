
import { TOKENS } from '../../core/UIRuntime.tsx';

/**
 * ⚡ NATT-OS HAPTIC ENGINE v8.1
 */
export const HapticEngine = {
  vibrate(type: 'click' | 'confirm' | 'error' = 'click', intensity = TOKENS.haptic.intensity.normal) {
    if (!navigator.vibrate) return;
    const base = TOKENS.haptic.pattern[type] || TOKENS.haptic.pattern.click;
    const scaled = base.map(v => Math.max(10, v * intensity));
    navigator.vibrate(scaled);
  }
};
