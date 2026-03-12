import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface SectionRevealProps {
  children: ReactNode;
  delay?: number;
  width?: "fit-content" | "100%";
}

const SectionReveal = ({ children, delay = 0, width = "100%" }: SectionRevealProps) => {
  return (
    <div style={{ position: "relative", width, overflow: "hidden" }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true }}
      >
        {children}
      </motion.div>
      <motion.div
        variants={{
          hidden: { left: 0 },
          visible: { left: "100%" },
        }}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.5, ease: "easeIn", delay }}
        viewport={{ once: true }}
        style={{
          position: "absolute",
          top: 4,
          bottom: 4,
          left: 0,
          right: 0,
          background: "#D31212", // edge-red
          zIndex: 20,
        }}
      />
    </div>
  );
};

export default SectionReveal;
