'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimationFrame } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface ScrollVelocityTextProps {
  children: ReactNode;
  baseVelocity: number;
  className?: string;
}

const ScrollVelocityText = ({ children, baseVelocity, className = '' }: ScrollVelocityTextProps) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  
  const scrollVelocity = useSpring(scrollY, {
    stiffness: 400,
    damping: 90
  });

  const velocityFactor = useTransform(scrollVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  // Simple wrap function
  const wrap = (min: number, max: number, v: number) => {
    const range = max - min;
    if (range === 0) return min;
    return ((v - min) % range + range) % range + min;
  };

  useAnimationFrame((t, delta) => {
    let moveBy = baseVelocity * (delta / 1000);
    
    // Add scroll velocity influence
    const currentVelocity = velocityFactor.get();
    moveBy += currentVelocity * (delta / 1000);
    
    baseX.set(baseX.get() + moveBy);
  });

  const x = useTransform(baseX, (v) => wrap(-20, -45, v));

  return (
    <motion.div 
      className={`whitespace-nowrap ${className}`}
      style={{ x }}
    >
      <span>{children}</span>
      <span className="ml-4">{children}</span>
      <span className="ml-4">{children}</span>
      <span className="ml-4">{children}</span>
    </motion.div>
  );
};

export default ScrollVelocityText;