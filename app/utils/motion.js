// Shared scroll-reveal variants for the new marketing pages (home, work,
// services, contact, rate card). `MotionConfig reducedMotion="user"` in
// root.jsx makes every transform-based animation using these variants a
// no-op under prefers-reduced-motion automatically.
export const fadeUp = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 220, damping: 24, mass: 0.6 },
  },
};

export const staggerChildren = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export const revealViewport = { once: true, margin: '-10% 0px' };

// Slightly bigger/slower variant reserved for the hero's first-load
// entrance, so the one animation every visitor sees immediately feels
// more deliberate than the standard scroll-reveal used everywhere else.
export const heroFadeUp = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 180, damping: 22, mass: 0.7 },
  },
};

export const heroStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};
