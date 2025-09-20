"use client";

import Link from "next/link";
import { allProjects } from "contentlayer/generated";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useVisualFeedback } from "@/lib/visual-feedback";

interface ProjectNavigationProps {
  currentSlug: string;
}

export function ProjectNavigation({ currentSlug }: ProjectNavigationProps) {
  const feedback = useVisualFeedback();

  // Sort projects by date (newest first) to maintain consistent order
  const sortedProjects = allProjects.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const currentIndex = sortedProjects.findIndex(
    (project) => project.slug === currentSlug,
  );

  if (currentIndex === -1) return null;

  const previousProject =
    currentIndex > 0 ? sortedProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < sortedProjects.length - 1
      ? sortedProjects[currentIndex + 1]
      : null;

  return (
    <motion.div
      className="flex items-center space-x-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Previous Project */}
      {previousProject ? (
        <motion.div
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href={`/projects/${previousProject.slug}`}
            onClick={() => feedback.click()}
            onMouseEnter={() => feedback.hover()}
            className="group flex items-center font-pixel text-xs px-3 py-2 border border-terminal-400 text-terminal-300 hover:border-white hover:text-white hover:shadow-[2px_2px_0px_#ffffff] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-150"
          >
            <motion.div
              animate={{ x: [-1, 0, -1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronLeft size={14} className="mr-1" />
            </motion.div>
            <div className="flex flex-col text-left">
              <span className="text-terminal-500 text-xs">PREV</span>
              <span className="max-w-32 truncate">{previousProject.title}</span>
            </div>
          </Link>
        </motion.div>
      ) : (
        <motion.div
          className="flex items-center font-pixel text-xs px-3 py-2 border border-terminal-600 text-terminal-600"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 0.6 }}
        >
          <ChevronLeft size={14} className="mr-1" />
          <div className="flex flex-col text-left">
            <span className="text-terminal-600 text-xs">PREV</span>
            <span>---</span>
          </div>
        </motion.div>
      )}

      {/* Project Counter */}
      <motion.div
        className="font-pixel text-xs text-terminal-500"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentIndex + 1}
        </motion.span>
        {" of "}
        {sortedProjects.length}
      </motion.div>

      {/* Next Project */}
      {nextProject ? (
        <motion.div
          whileHover={{ scale: 1.05, x: 2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href={`/projects/${nextProject.slug}`}
            onClick={() => feedback.click()}
            onMouseEnter={() => feedback.hover()}
            className="group flex items-center font-pixel text-xs px-3 py-2 border border-terminal-400 text-terminal-300 hover:border-white hover:text-white hover:shadow-[2px_2px_0px_#ffffff] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-150"
          >
            <div className="flex flex-col text-right">
              <span className="text-terminal-500 text-xs">NEXT</span>
              <span className="max-w-32 truncate">{nextProject.title}</span>
            </div>
            <motion.div
              animate={{ x: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronRight size={14} className="ml-1" />
            </motion.div>
          </Link>
        </motion.div>
      ) : (
        <motion.div
          className="flex items-center font-pixel text-xs px-3 py-2 border border-terminal-600 text-terminal-600"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 0.6 }}
        >
          <div className="flex flex-col text-right">
            <span className="text-terminal-600 text-xs">NEXT</span>
            <span>---</span>
          </div>
          <ChevronRight size={14} className="ml-1" />
        </motion.div>
      )}
    </motion.div>
  );
}

export default ProjectNavigation;
