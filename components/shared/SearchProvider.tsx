"use client";

import { KBarSearchProvider } from "@shipixen/pliny/search/KBar";
import { useRouter } from "next/navigation";
import { CoreContent } from "@shipixen/pliny/utils/contentlayer";
import { Blog, Project } from "contentlayer/generated";
import { formatDate } from "@shipixen/pliny/utils/formatDate";
import { searchLinks } from "@/data/config/searchLinks";

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
        additionalSearchDocuments: {
          path: "projects-search.json",
          onLoad(projectsJson: Project[]) {
            return projectsJson.map((project: Project) => ({
              id: project.slug,
              name: project.title,
              keywords: `${project.summary} ${project.skills?.join(" ")} ${project.tools?.join(" ")} ${project.projectType}`,
              section: "Projects",
              subtitle: `${project.projectType} · ${project.role} · ${project.duration}`,
              perform: () => router.push(`/projects/${project.slug}`),
            }));
          },
        },
      }}
    >
      {children}
    </KBarSearchProvider>
  );
};
