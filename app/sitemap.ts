import { MetadataRoute } from "next";
import { allBlogs } from "contentlayer/generated";
import { siteConfig } from "@/data/config/site.settings";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteConfig.siteUrl;
  const blogRoutes = allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/${post.path}`,
      lastModified: post.lastmod || post.date,
    }));

  const routes = [
    "",
    "about",
    "projects",
    "cv",
    "contact",
    "tags",
    "overview",
  ].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...blogRoutes];
}
