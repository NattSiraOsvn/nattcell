import { useEffect, useState } from 'react';
export function useMotionSensor() {
  const [motion, setMotion] = useState({ x: 0, y: 0, z: 0 });
  useEffect(() => {}, []);
  return motion;
}
