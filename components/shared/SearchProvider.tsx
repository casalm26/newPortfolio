"use client";

import { useEffect, useState } from "react";
import { KBarSearchProvider } from "@shipixen/pliny/search/KBar";
import { useRegisterActions, type Action } from "@shipixen/kbar";
import { useRouter } from "next/navigation";
import { CoreContent } from "@shipixen/pliny/utils/contentlayer";
import { Blog } from "contentlayer/generated";
import { formatDate } from "@shipixen/pliny/utils/formatDate";
import { searchLinks } from "@/data/config/searchLinks";

type ProjectSearchEntry = {
  slug: string;
  title: string;
  summary?: string | null;
  skills?: string[];
  tools?: string[];
  projectType?: string;
  role?: string | null;
  duration?: string | null;
};

function ProjectActionsRegistrar() {
  const router = useRouter();
  const [actions, setActions] = useState<Action[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadProjects = async () => {
      try {
        const response = await fetch("/projects-search.json");
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const projects: ProjectSearchEntry[] = await response.json();
        if (cancelled) return;

        const projectActions = projects.map((project) => {
          const keywords = [
            project.summary ?? "",
            ...(project.skills ?? []),
            ...(project.tools ?? []),
            project.projectType ?? "",
          ]
            .join(" ")
            .trim();

          const subtitleParts = [
            project.projectType,
            project.role ?? undefined,
            project.duration ?? undefined,
          ].filter((part): part is string => Boolean(part));

          return {
            id: `project-${project.slug}`,
            name: project.title,
            keywords,
            section: "Projects",
            subtitle: subtitleParts.join(" · "),
            perform: () => router.push(`/projects/${project.slug}`),
          };
        });

        setActions(projectActions);
      } catch (error) {
        console.error("Failed to load project search data", error);
      }
    };

    void loadProjects();

    return () => {
      cancelled = true;
    };
  }, [router]);

  useRegisterActions(actions, [actions]);

  return null;
}

export const SearchProvider = ({ children }) => {
  const router = useRouter();

  const makeRootPath = (path: string) => {
    if (!path.startsWith("/")) {
      return `/${path}`;
    }

    return path;
  };

  return (
    <KBarSearchProvider
      kbarConfig={{
        searchDocumentsPath: "search.json",
        onSearchDocumentsLoad(json) {
          return [
            ...json.map((post: CoreContent<Blog>) => ({
              id: post.path,
              name: post.title,
              keywords: post?.summary || "",
              section: "Blog",
              subtitle: `${
                post.date ? `${formatDate(post.date, "en-US")} · ` : ""
              }${post.tags.join(", ")}`,
              perform: () => router.push(makeRootPath(post.path)),
            })),

            ...searchLinks.map((link) => {
              return {
                id: link.id,
                name: link.name,
                keywords: link.keywords,
                section: link.section,
                subtitle: link.shortcut ? `⌘${link.shortcut.join(",")}` : "",
                perform: () => router.push(link.href),
              };
            }),
          ];
        },
      }}
    >
      <ProjectActionsRegistrar />
      {children}
    </KBarSearchProvider>
  );
};
