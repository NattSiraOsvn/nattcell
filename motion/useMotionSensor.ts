
import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * 📡 MOTION SENSOR HOOK
 * Theo dõi vận tốc và gia tốc thao tác của người dùng.
 */
export const useMotionSensor = () => {
  const [motion, setMotion] = useState({ 
    velocity: { x: 0, y: 0 }, 
    acceleration: 0,
    normalizedIntensity: 0 
  });
  
  const lastPos = useRef({ x: 0, y: 0 });
  const lastTime = useRef(Date.now());
  const lastVelocity = useRef({ x: 0, y: 0 });

  const update = useCallback((x: number, y: number) => {
    const now = Date.now();
    const dt = now - lastTime.current;
    
    if (dt > 0) {
      const dx = x - lastPos.current.x;
      const dy = y - lastPos.current.y;
      
      const vX = (dx / dt) * 100;
      const vY = (dy / dt) * 100;
      
      const dvX = vX - lastVelocity.current.x;
      const dvY = vY - lastVelocity.current.y;
      
      const acc = Math.sqrt(dvX * dvX + dvY * dvY) / dt;
      const totalV = Math.sqrt(vX * vX + vY * vY);
      
      setMotion({
        velocity: { x: vX, y: vY },
        acceleration: acc,
        normalizedIntensity: Math.min(1.0, (totalV / 500) + (acc * 10))
      });

      lastPos.current = { x, y };
      lastTime.current = now;
      lastVelocity.current = { x: vX, y: vY };
    }
  }, []);

  return { motion, update };
};
