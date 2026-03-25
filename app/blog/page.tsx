import { getAllPosts, serialize } from "@/lib/cms/queries";
import type { BlogPostData } from "@/lib/cms/types";
import { BlogPageClient } from "./BlogPageClient";

export const metadata = {
  title: "Blog",
  description: "Articles on development, technology, and creative coding.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  return <BlogPageClient posts={serialize<typeof posts, BlogPostData[]>(posts)} />;
}
