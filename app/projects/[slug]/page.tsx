import { allProjects } from "contentlayer/generated";
import { notFound } from "next/navigation";
import Header from "@/components/shared/Header";
import Breadcrumb from "@/components/shared/Breadcrumb";
import ProjectNavigation from "@/components/projects/ProjectNavigation";
import Link from "next/link";
import { MDXContent } from "@/components/shared/MDXContent";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allProjects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = allProjects.find((project) => project.slug === slug);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = allProjects.find((project) => project.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <Breadcrumb
            customItems={[
              { label: "HOME", href: "/" },
              { label: "PROJECTS", href: "/projects" },
              {
                label: project.title.toUpperCase(),
                href: `/projects/${project.slug}`,
              },
            ]}
          />
          <div className="mt-4">
            <Link
              href="/projects"
              className="inline-flex items-center font-pixel text-sm text-terminal-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              cd ../projects
            </Link>
          </div>
        </div>

        {/* Project Header */}
        <header className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <span className="font-pixel text-xs px-2 py-1 border border-terminal-400 text-terminal-300">
              {project.projectType.toUpperCase()}
            </span>
            <span className="font-pixel text-xs text-terminal-500">
              {project.duration}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {project.title}
          </h1>

          <p className="text-xl text-terminal-300 leading-relaxed mb-6">
            {project.summary}
          </p>

          {/* Project Links */}
          {project.links && (
            <div className="flex flex-wrap gap-3 mb-6">
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center font-pixel text-xs px-4 py-2 border border-white bg-white text-black hover:bg-transparent hover:text-white transition-colors"
                >
                  <ExternalLink size={14} className="mr-2" />
                  LIVE DEMO
                </a>
              )}
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center font-pixel text-xs px-4 py-2 border border-terminal-400 text-terminal-300 hover:border-white hover:text-white transition-colors"
                >
                  <Github size={14} className="mr-2" />
                  SOURCE CODE
                </a>
              )}
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center font-pixel text-xs px-4 py-2 border border-terminal-400 text-terminal-300 hover:border-white hover:text-white transition-colors"
                >
                  VIDEO DEMO
                </a>
              )}
            </div>
          )}

          {/* Project Meta */}
          <div className="grid md:grid-cols-2 gap-6 p-6 border border-terminal-400">
            <div>
              <h3 className="font-pixel text-xs text-terminal-400 uppercase mb-3">
                Role
              </h3>
              <p className="text-white">{project.role}</p>
            </div>
            <div>
              <h3 className="font-pixel text-xs text-terminal-400 uppercase mb-3">
                Category
              </h3>
              <p className="text-white">{project.category}</p>
            </div>
            <div>
              <h3 className="font-pixel text-xs text-terminal-400 uppercase mb-3">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.skills?.map((skill: string) => (
                  <span
                    key={skill}
                    className="font-pixel text-xs px-2 py-1 border border-terminal-500 text-terminal-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-pixel text-xs text-terminal-400 uppercase mb-3">
                Tools
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tools?.map((tool: string) => (
                  <span
                    key={tool}
                    className="font-pixel text-xs px-2 py-1 border border-terminal-500 text-terminal-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Project Content */}
        <article className="prose prose-invert prose-lg max-w-none">
          <MDXContent source={project.body.code} />
        </article>

        {/* Navigation Footer */}
        <footer className="mt-16 pt-8 border-t border-terminal-400">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <Link
              href="/projects"
              className="inline-flex items-center font-pixel text-sm text-terminal-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to projects
            </Link>

            {/* Project Navigation */}
            <ProjectNavigation currentSlug={project.slug} />
          </div>
        </footer>
      </main>
    </div>
  );
}
