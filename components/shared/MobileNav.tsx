"use client";

import { useState } from "react";
import Link from "./Link";
import { headerNavLinks } from "@/data/config/headerNavLinks";
import { motion, AnimatePresence } from "framer-motion";
import { useVisualFeedback } from "@/lib/visual-feedback";

const MobileNav = () => {
  const [navShow, setNavShow] = useState(false);
  const feedback = useVisualFeedback();

  const onToggleNav = () => {
    feedback.click();
    setNavShow((status) => {
      if (status) {
        document.body.style.overflow = "auto";
      } else {
        // Prevent scrolling
        document.body.style.overflow = "hidden";
      }
      return !status;
    });
  };

  return (
    <>
      <motion.button
        aria-label="Toggle Menu"
        onClick={onToggleNav}
        onMouseEnter={() => feedback.hover()}
        className="sm:hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="text-gray-900 dark:text-gray-100 h-8 w-8"
          animate={navShow ? { rotate: 180 } : { rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </motion.svg>
      </motion.button>
      <AnimatePresence>
        {navShow && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 z-20 h-full w-full opacity-95 dark:opacity-[0.98] bg-white dark:bg-gray-950"
          >
            <div className="flex justify-end">
              <motion.button
                className="mr-8 mt-11 h-8 w-8"
                aria-label="Toggle Menu"
                onClick={onToggleNav}
                onMouseEnter={() => feedback.hover()}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="text-gray-900 dark:text-gray-100"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.button>
            </div>
            <motion.nav
              className="fixed mt-8 h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {headerNavLinks.map((link, index) => (
                <motion.div
                  key={link.title}
                  className="px-12 py-4"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                  whileHover={{ x: 10 }}
                >
                  <Link
                    href={link.href}
                    className="text-2xl font-bold tracking-widest text-gray-900 dark:text-gray-100 hover:text-blue-500 transition-colors"
                    onClick={() => {
                      feedback.click();
                      onToggleNav();
                    }}
                    onMouseEnter={() => feedback.hover()}
                  >
                    {link.title}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNav;
