// Shared scroll-reveal variants for the new marketing pages (home, work,
// services, contact, rate card). `MotionConfig reducedMotion="user"` in
// root.jsx makes every transform-based animation using these variants a
// no-op under prefers-reduced-motion automatically.
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

export const staggerChildren = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export const revealViewport = { once: true, margin: '-10% 0px' };
