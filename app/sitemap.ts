import { MetadataRoute } from "next";
import { getAllProjects, getAllPosts, getAllVideos } from "@/lib/cms/queries";
import { siteConfig } from "@/data/config/site.settings";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = siteConfig.siteUrl;

  const [projects, posts, videos] = await Promise.all([
    getAllProjects(),
    getAllPosts(),
    getAllVideos(),
  ]);

  const projectRoutes = projects.map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    lastModified: project.updatedAt || project.publishedAt,
  }));

  const postRoutes = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt || post.publishedAt,
  }));

  const videoRoutes = videos.map((video) => ({
    url: `${siteUrl}/videos/${video.slug}`,
    lastModified: video.updatedAt || video.publishedAt,
  }));

  const routes = ["", "projects", "cv", "contact", "blog", "videos"].map(
    (route) => ({
      url: `${siteUrl}/${route}`,
      lastModified: new Date().toISOString().split("T")[0],
    }),
  );

  return [...routes, ...projectRoutes, ...postRoutes, ...videoRoutes];
}
