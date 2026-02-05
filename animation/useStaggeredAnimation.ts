
import { useState, useEffect } from 'react';

/**
 * 🌊 STAGGERED ANIMATION SYSTEM
 * Điều phối nhịp độ entry cho các danh sách và khối dữ liệu.
 */
export const useStaggeredAnimation = (count: number, delayMs: number = 80) => {
  const [visibleIndices, setVisibleIndices] = useState<number[]>([]);

  useEffect(() => {
    setVisibleIndices([]);
    const timers = Array.from({ length: count }).map((_, i) => 
      setTimeout(() => {
        setVisibleIndices(prev => [...prev, i]);
      }, i * delayMs)
    );

    return () => timers.forEach(clearTimeout);
  }, [count, delayMs]);

  return visibleIndices;
};
