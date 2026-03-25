import { getAllPosts, serialize } from "@/lib/cms/queries";
import { BlogPageClient } from "./BlogPageClient";

export const metadata = {
  title: "Blog",
  description: "Articles on development, technology, and creative coding.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  return <BlogPageClient posts={serialize(posts)} />;
}
