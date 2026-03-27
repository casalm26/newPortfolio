import { cmsApiFetch } from "./api";

const PATH_MAP: Record<string, (slug?: string) => string[]> = {
  posts: (slug) => ["/blog", ...(slug ? [`/blog/${slug}`] : []), "/"],
  projects: (slug) => [
    "/projects",
    ...(slug ? [`/projects/${slug}`] : []),
    "/",
  ],
  videos: (slug) => ["/videos", ...(slug ? [`/videos/${slug}`] : []), "/"],
  timeline: () => ["/cv"],
};

export async function revalidateAfterMutation(
  apiKey: string,
  contentType: "posts" | "projects" | "videos" | "timeline",
  slug?: string,
): Promise<void> {
  const paths = PATH_MAP[contentType](slug);
  try {
    await cmsApiFetch("/revalidate", apiKey, {
      method: "POST",
      body: JSON.stringify({ paths }),
    });
  } catch {
    // Revalidation failure is non-critical — don't block the UI
    console.warn("Revalidation failed for paths:", paths);
  }
}
