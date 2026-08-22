import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

// Wraps a button/link so it gently pulls toward the cursor on hover,
// like a magnet, and springs back on release. Pointer-only: touch
// devices never fire mousemove, so mobile is unaffected. Disabled
// entirely for prefers-reduced-motion.
export const MagneticWrap = ({ children, strength = 0.3, className }) => {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.5 });

  const handleMouseMove = event => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * strength);
    y.set((event.clientY - rect.top - rect.height / 2) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={className}
      style={{ display: 'inline-flex', x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
};
