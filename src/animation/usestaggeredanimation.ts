import { useCallback } from 'react';
export function useStaggeredAnimation(count?: number, _delay?: number): number[] {
  // Returns array of indices for staggered animation
  return Array.from({ length: count || 0 }, (_, i) => i);
}
