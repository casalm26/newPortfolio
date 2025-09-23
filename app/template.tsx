"use client";

import { motion } from "framer-motion";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    filter: "blur(4px)",
  },
  in: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
  out: {
    opacity: 0,
    y: -20,
    filter: "blur(4px)",
  },
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3,
};

const pixelTransition = {
  initial: {
    clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
  },
  animate: {
    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
  },
  exit: {
    clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
  },
};

const pixelTransitionSettings = {
  type: "tween",
  ease: [0.87, 0, 0.13, 1],
  duration: 0.5,
};

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* TODO: Re-implement pixel art loading overlay with proper failsafe */}
      {/* Temporarily removed to fix black screen issue */}
      {/* <motion.div
        className="fixed inset-0 z-50 bg-black pointer-events-none"
        variants={pixelTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pixelTransitionSettings}
      /> */}

      {/* Main page content */}
      <motion.div
        key="page-content"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="w-full"
      >
        {children}
      </motion.div>
    </>
  );
}