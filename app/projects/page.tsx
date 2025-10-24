"use client";

// @ts-ignore
import { allProjects, Project } from "contentlayer/generated";
import Header from "@/components/shared/Header";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { PageTransition } from "@/components/shared/PageTransition";
import { ScrollAnimated } from "@/components/shared/ScrollAnimated";
import { TypewriterText } from "@/components/shared/TypewriterText";

function HighlightText({
  text,
  searchTerm,
}: {
  text: string;
  searchTerm: string;
}) {
  if (!searchTerm) return <>{text}</>;

  const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <span
            key={index}
            className="bg-yellow-400 text-black px-1 font-semibold"
          >
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

function ProjectCard({
  project,
  searchTerm,
}: {
  project: Project;
  searchTerm: string;
}) {
  return (
    <ScrollAnimated animation="fade-in">
      <Link
        href={`/projects/${project.slug}`}
        className="block p-6 border border-terminal-400 hover:border-white hover:bg-terminal-900 hover:shadow-lg hover:shadow-white/10 transition-all duration-150 group card-pixel-interactive hover:transform hover:-translate-y-1"
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
            <HighlightText text={project.title} searchTerm={searchTerm} />
          </h2>

          <p className="text-terminal-300 text-sm leading-relaxed line-clamp-2">
            <HighlightText
              text={project.summary || ""}
              searchTerm={searchTerm}
            />
          </p>

          <div className="flex flex-wrap gap-2">
            {project.skills?.slice(0, 3).map((skill: string) => (
              <span
                key={skill}
                className={cn(
                  "font-pixel text-xs px-2 py-1 border border-terminal-500 text-terminal-300 transition-all duration-100 hover:border-white hover:text-white hover:bg-white/5",
                  searchTerm &&
                    skill.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    "border-yellow-400 bg-yellow-400/20 text-yellow-300",
                )}
              >
                <HighlightText text={skill} searchTerm={searchTerm} />
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
              <HighlightText
                text={project.role ?? ""}
                searchTerm={searchTerm}
              />
            </span>
            <span className="font-pixel text-xs text-terminal-500 group-hover:text-white transition-colors">
              ls -la →
            </span>
          </div>
        </div>
      </Link>
    </ScrollAnimated>
  );
}

export default function ProjectsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filterType = searchParams.get("filter");
  const techFilter = searchParams.get("tech");
  const sortBy = searchParams.get("sort") || "date";

  // Sort projects by date, newest first (default)
  const sortedProjects = useMemo(() => {
    let sorted = [...allProjects];

    switch (sortBy) {
      case "name":
        sorted = sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "type":
        sorted = sorted.sort((a, b) =>
          a.projectType.localeCompare(b.projectType),
        );
        break;
      case "relevance":
        // Sort by skills match if searching
        if (searchTerm) {
          sorted = sorted.sort((a, b) => {
            const aMatches = (a.skills?.join(" ") + " " + a.summary)
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
              ? 1
              : 0;
            const bMatches = (b.skills?.join(" ") + " " + b.summary)
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
              ? 1
              : 0;
            return bMatches - aMatches;
          });
        }
        break;
      default: // date
        sorted = sorted.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
    }

    return sorted;
  }, [sortBy, searchTerm]);

  // Filter projects based on URL params and search
  const filteredProjects = useMemo(() => {
    let filtered = sortedProjects;

    // Filter by type
    if (filterType && filterType !== "all") {
      filtered = filtered.filter(
        (project) => project.projectType === filterType,
      );
    }

    // Filter by technology
    if (techFilter) {
      filtered = filtered.filter(
        (project) =>
          project.skills?.some((skill) =>
            skill.toLowerCase().includes(techFilter.toLowerCase()),
          ) ||
          project.tools?.some((tool) =>
            tool.toLowerCase().includes(techFilter.toLowerCase()),
          ),
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((project) => {
        const searchFields = [
          project.title,
          project.summary ?? "",
          project.projectType,
          project.role ?? "",
          ...(project.skills || []),
          ...(project.tools || []),
        ]
          .join(" ")
          .toLowerCase();

        return searchFields.includes(searchTerm.toLowerCase());
      });
    }

    return filtered;
  }, [sortedProjects, filterType, techFilter, searchTerm]);

  const projectTypes = ["Technical", "Creative", "Business"];
  const allSkills = useMemo(() => {
    const skills = new Set();
    allProjects.forEach((project) => {
      project.skills?.forEach((skill) => skills.add(skill));
      project.tools?.forEach((tool) => skills.add(tool));
    });
    return Array.from(skills).sort();
  }, []);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/projects?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-black">
      <ScrollAnimated animation="fade-in">
        <Header />
      </ScrollAnimated>

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Terminal Header */}
        <ScrollAnimated animation="fade-in" delay={200}>
          <div className="mb-12">
            <div className="font-pixel text-sm text-terminal-400 mb-2">
              <TypewriterText
                text="caspian@localhost:~$ ls projects/"
                speed={40}
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-pixel font-bold text-white mb-4">
              PROJECTS/
            </h1>
            <p className="text-terminal-300 max-w-2xl">
              A collection of development projects, case studies, and technical
              implementations. Each project showcases different aspects of
              full-stack development and problem-solving.
            </p>
          </div>
        </ScrollAnimated>

        {/* Search and Filters */}
        <ScrollAnimated animation="slide-in-left" delay={400}>
          <div className="mb-8 space-y-6">
            {/* Search Bar */}
            <div>
              <div className="font-pixel text-xs text-terminal-400 mb-3">
                search projects:
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, skills, tools, or description..."
                  className="w-full font-pixel text-sm bg-black border border-terminal-400 text-white px-4 py-3 focus:border-white focus:outline-none placeholder-terminal-500 transition-all duration-150 focus:shadow-lg focus:shadow-white/10 hover:border-terminal-300"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 font-pixel text-xs text-terminal-400 hover:text-white transition-all duration-100 hover:scale-110 active:scale-95"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Project Type Filter */}
            <div>
              <div className="font-pixel text-xs text-terminal-400 mb-3">
                filter by type:
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateFilter("filter", null)}
                  className={cn(
                    "btn-pixel-3d font-pixel text-xs px-3 py-2",
                    !filterType || filterType === "all"
                      ? "border-white bg-white text-black"
                      : "border-terminal-400 text-terminal-300",
                  )}
                >
                  ALL ({allProjects.length})
                </button>
                {projectTypes.map((type) => {
                  const count = allProjects.filter(
                    (p) => p.projectType === type,
                  ).length;
                  const isActive = filterType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => updateFilter("filter", type)}
                      className={cn(
                        "btn-pixel-3d font-pixel text-xs px-3 py-2",
                        isActive
                          ? "border-white bg-white text-black"
                          : "border-terminal-400 text-terminal-300",
                      )}
                    >
                      {type.toUpperCase()} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Technology Filter */}
            <div>
              <div className="font-pixel text-xs text-terminal-400 mb-3">
                filter by technology:
              </div>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                <button
                  onClick={() => updateFilter("tech", null)}
                  className={cn(
                    "font-pixel text-xs px-3 py-2 border transition-colors",
                    !techFilter
                      ? "border-white bg-white text-black"
                      : "border-terminal-400 text-terminal-300 hover:border-white hover:text-white",
                  )}
                >
                  ALL TECH
                </button>
                {allSkills.slice(0, 10).map((skill) => {
                  const isActive = techFilter === skill;
                  return (
                    <button
                      key={skill}
                      onClick={() => updateFilter("tech", skill)}
                      className={cn(
                        "btn-pixel-3d font-pixel text-xs px-3 py-2",
                        isActive
                          ? "border-white bg-white text-black"
                          : "border-terminal-400 text-terminal-300",
                      )}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <div className="font-pixel text-xs text-terminal-400 mb-3">
                sort by:
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "date", label: "DATE" },
                  { key: "name", label: "NAME" },
                  { key: "type", label: "TYPE" },
                  { key: "relevance", label: "RELEVANCE" },
                ].map((option) => {
                  const isActive = sortBy === option.key;
                  return (
                    <button
                      key={option.key}
                      onClick={() => updateFilter("sort", option.key)}
                      className={cn(
                        "btn-pixel-3d font-pixel text-xs px-3 py-2",
                        isActive
                          ? "border-white bg-white text-black"
                          : "border-terminal-400 text-terminal-300",
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Filters Display */}
            {(filterType || techFilter || searchTerm) && (
              <div>
                <div className="font-pixel text-xs text-terminal-400 mb-3">
                  active filters:
                </div>
                <div className="flex flex-wrap gap-2">
                  {filterType && (
                    <div className="font-pixel text-xs px-3 py-2 bg-terminal-800 border border-terminal-400 text-white flex items-center gap-2">
                      Type: {filterType}
                      <button
                        onClick={() => updateFilter("filter", null)}
                        className="hover:text-terminal-300 transition-all duration-100 hover:scale-110 active:scale-95"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  {techFilter && (
                    <div className="font-pixel text-xs px-3 py-2 bg-terminal-800 border border-terminal-400 text-white flex items-center gap-2">
                      Tech: {techFilter}
                      <button
                        onClick={() => updateFilter("tech", null)}
                        className="hover:text-terminal-300 transition-all duration-100 hover:scale-110 active:scale-95"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  {searchTerm && (
                    <div className="font-pixel text-xs px-3 py-2 bg-terminal-800 border border-terminal-400 text-white flex items-center gap-2">
                      Search: "{searchTerm}"
                      <button
                        onClick={() => setSearchTerm("")}
                        className="hover:text-terminal-300 transition-all duration-100 hover:scale-110 active:scale-95"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollAnimated>

        {/* Results Counter */}
        <div className="mb-6">
          <div className="font-pixel text-xs text-terminal-400">
            {filteredProjects.length === 0 && searchTerm
              ? "No projects found for your search"
              : filteredProjects.length === 0
                ? "No projects match the selected filters"
                : `showing ${filteredProjects.length} of ${allProjects.length} projects`}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                searchTerm={searchTerm}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="font-pixel text-terminal-400 mb-4">
              {searchTerm
                ? "No projects match your search criteria"
                : "No projects found with selected filters"}
            </div>
            <button
              onClick={() => {
                setSearchTerm("");
                router.push("/projects");
              }}
              className="btn-pixel-3d font-pixel text-xs px-4 py-2 border-terminal-400 text-terminal-300"
            >
              CLEAR ALL FILTERS
            </button>
          </div>
        )}

        {/* Terminal Footer */}
        <ScrollAnimated animation="fade-in">
          <div className="mt-12 pt-8 border-t border-terminal-400">
            <div className="font-pixel text-xs text-terminal-400">
              found {filteredProjects.length} projects • last updated{" "}
              {formatDate(new Date())}
            </div>
          </div>
        </ScrollAnimated>
      </main>
    </div>
  );
}
