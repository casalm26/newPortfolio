// @ts-ignore
import { allProjects, Project } from 'contentlayer/generated';
import Header from '@/components/shared/Header';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export const metadata = {
  title: 'Projects',
  description: 'A collection of my development projects and case studies',
};

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link 
      href={`/projects/${project.slug}`}
      className="block p-6 border border-terminal-400 hover:border-white hover:bg-terminal-900 transition-all duration-75 group"
    >
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-pixel text-xs text-terminal-400">
            {project.projectType.toUpperCase()}
          </span>
          <span className="font-pixel text-xs text-terminal-500">
            {project.duration}
          </span>
        </div>
        
        <h2 className="text-xl font-bold text-white group-hover:text-terminal-200 transition-colors">
          {project.title}
        </h2>
        
        <p className="text-terminal-300 text-sm leading-relaxed line-clamp-2">
          {project.summary}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {project.skills?.slice(0, 3).map((skill: string) => (
            <span 
              key={skill}
              className="font-pixel text-xs px-2 py-1 border border-terminal-500 text-terminal-300"
            >
              {skill}
            </span>
          ))}
          {project.skills?.length > 3 && (
            <span className="font-pixel text-xs text-terminal-500">
              +{project.skills.length - 3} more
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <span className="font-pixel text-xs text-terminal-400">
            {project.role}
          </span>
          <span className="font-pixel text-xs text-terminal-500 group-hover:text-white transition-colors">
            ls -la →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ProjectsPage() {
  // Sort projects by date, newest first
  const sortedProjects = allProjects.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const projectTypes = ['Technical', 'Creative', 'Business'];

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Terminal Header */}
        <div className="mb-12">
          <div className="font-pixel text-sm text-terminal-400 mb-2">
            caspian@localhost:~$ ls projects/
          </div>
          <h1 className="text-4xl md:text-6xl font-pixel font-bold text-white mb-4">
            PROJECTS/
          </h1>
          <p className="text-terminal-300 max-w-2xl">
            A collection of development projects, case studies, and technical implementations. 
            Each project showcases different aspects of full-stack development and problem-solving.
          </p>
        </div>

        {/* Project Type Filter */}
        <div className="mb-8">
          <div className="font-pixel text-xs text-terminal-400 mb-3">
            filter by type:
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="font-pixel text-xs px-3 py-2 border border-white bg-white text-black">
              ALL ({sortedProjects.length})
            </button>
            {projectTypes.map(type => {
              const count = sortedProjects.filter(p => p.projectType === type).length;
              return (
                <button 
                  key={type}
                  className="font-pixel text-xs px-3 py-2 border border-terminal-400 text-terminal-300 hover:border-white hover:text-white transition-colors"
                >
                  {type.toUpperCase()} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        {/* Terminal Footer */}
        <div className="mt-12 pt-8 border-t border-terminal-400">
          <div className="font-pixel text-xs text-terminal-400">
            found {sortedProjects.length} projects • last updated {formatDate(new Date())}
          </div>
        </div>
      </main>
    </div>
  );
}