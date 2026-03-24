import { MetadataRoute } from "next";
import { allProjects } from "contentlayer/generated";
import { siteConfig } from "@/data/config/site.settings";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteConfig.siteUrl;

  const projectRoutes = allProjects
    .filter((project) => !project.draft)
    .map((project) => ({
      url: `${siteUrl}/projects/${project.slug}`,
      lastModified: project.lastmod || project.date,
    }));

  const routes = ["", "projects", "cv", "contact"].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...projectRoutes];
}
