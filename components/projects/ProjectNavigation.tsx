'use client';

import Link from 'next/link';
import { allProjects } from 'contentlayer/generated';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectNavigationProps {
  currentSlug: string;
}

export function ProjectNavigation({ currentSlug }: ProjectNavigationProps) {
  // Sort projects by date (newest first) to maintain consistent order
  const sortedProjects = allProjects.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const currentIndex = sortedProjects.findIndex(project => project.slug === currentSlug);
  
  if (currentIndex === -1) return null;

  const previousProject = currentIndex > 0 ? sortedProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < sortedProjects.length - 1 ? sortedProjects[currentIndex + 1] : null;

  return (
    <div className="flex items-center space-x-4">
      {/* Previous Project */}
      {previousProject ? (
        <Link 
          href={`/projects/${previousProject.slug}`}
          className="group flex items-center font-pixel text-xs px-3 py-2 border border-terminal-400 text-terminal-300 hover:border-white hover:text-white transition-colors"
        >
          <ChevronLeft size={14} className="mr-1" />
          <div className="flex flex-col text-left">
            <span className="text-terminal-500 text-xs">PREV</span>
            <span className="max-w-32 truncate">{previousProject.title}</span>
          </div>
        </Link>
      ) : (
        <div className="flex items-center font-pixel text-xs px-3 py-2 border border-terminal-600 text-terminal-600">
          <ChevronLeft size={14} className="mr-1" />
          <div className="flex flex-col text-left">
            <span className="text-terminal-600 text-xs">PREV</span>
            <span>---</span>
          </div>
        </div>
      )}

      {/* Project Counter */}
      <div className="font-pixel text-xs text-terminal-500">
        {currentIndex + 1} of {sortedProjects.length}
      </div>

      {/* Next Project */}
      {nextProject ? (
        <Link 
          href={`/projects/${nextProject.slug}`}
          className="group flex items-center font-pixel text-xs px-3 py-2 border border-terminal-400 text-terminal-300 hover:border-white hover:text-white transition-colors"
        >
          <div className="flex flex-col text-right">
            <span className="text-terminal-500 text-xs">NEXT</span>
            <span className="max-w-32 truncate">{nextProject.title}</span>
          </div>
          <ChevronRight size={14} className="ml-1" />
        </Link>
      ) : (
        <div className="flex items-center font-pixel text-xs px-3 py-2 border border-terminal-600 text-terminal-600">
          <div className="flex flex-col text-right">
            <span className="text-terminal-600 text-xs">NEXT</span>
            <span>---</span>
          </div>
          <ChevronRight size={14} className="ml-1" />
        </div>
      )}
    </div>
  );
}

export default ProjectNavigation;