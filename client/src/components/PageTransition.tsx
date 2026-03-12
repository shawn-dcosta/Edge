import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-grow flex flex-col"
      >
        {children}
      </motion.div>
      
      {/* Slide-in Curtain (plays on exit of current page) */}
      <motion.div
        className="fixed top-0 left-0 w-full h-screen bg-edge-red z-[100] origin-bottom"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      />
      
      {/* Slide-out Curtain (plays on entry of new page) */}
      <motion.div
        className="fixed top-0 left-0 w-full h-screen bg-edge-red z-[100] origin-top"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
      />
    </>
  );
};

export default PageTransition;
