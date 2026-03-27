"use client";

import type { BlogPostData } from "@/lib/cms/types";
import Header from "@/components/shared/Header";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollAnimated } from "@/components/shared/ScrollAnimated";
import { TypewriterText } from "@/components/shared/TypewriterText";

interface BlogPageClientProps {
  posts: BlogPostData[];
  featuredPosts: BlogPostData[];
}

export function BlogPageClient({ posts, featuredPosts }: BlogPageClientProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-terminal-400 flex items-center justify-center font-pixel text-sm">
          Loading posts...
        </div>
      }
    >
      <BlogPageContent posts={posts} featuredPosts={featuredPosts} />
    </Suspense>
  );
}

function BlogPageContent({
  posts,
  featuredPosts,
}: {
  posts: BlogPostData[];
  featuredPosts: BlogPostData[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const tagFilter = searchParams.get("tag");
  const categoryFilter = searchParams.get("category");

  const filteredPosts = useMemo(() => {
    let filtered = [...posts];

    if (tagFilter) {
      filtered = filtered.filter((post) =>
        post.tags.some((t) => t.toLowerCase() === tagFilter.toLowerCase()),
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(
        (post) => post.category.toLowerCase() === categoryFilter.toLowerCase(),
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((post) => {
        const searchFields = [
          post.title,
          post.summary,
          post.category,
          ...post.tags,
        ]
          .join(" ")
          .toLowerCase();
        return searchFields.includes(searchTerm.toLowerCase());
      });
    }

    return filtered;
  }, [posts, tagFilter, categoryFilter, searchTerm]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((post) => post.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [posts]);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-black">
      <ScrollAnimated animation="fade-in">
        <Header />
      </ScrollAnimated>

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <ScrollAnimated animation="fade-in" delay={200}>
          <div className="mb-12">
            <div className="font-pixel text-sm text-terminal-400 mb-2">
              <TypewriterText
                text="caspian@localhost:~$ cat blog/"
                speed={40}
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-pixel font-bold text-white mb-4">
              BLOG/
            </h1>
            <p className="text-terminal-300 max-w-2xl">
              Thoughts on development, technology, and creative coding.
            </p>
          </div>
        </ScrollAnimated>

        {featuredPosts.length > 0 && (
          <ScrollAnimated animation="slide-in-left" delay={300}>
            <div className="mb-12">
              <div className="font-pixel text-xs text-terminal-400 mb-4">
                {">"} HIGHLIGHTS
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {featuredPosts.map((post, i) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className={cn(
                      "block p-6 border-2 border-terminal-300 hover:border-white hover:bg-terminal-900 transition-all duration-150 group",
                      i === 0 && featuredPosts.length > 1 && "md:col-span-2",
                    )}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-pixel text-xs text-terminal-500">
                        {formatDate(new Date(post.publishedAt))}
                      </span>
                      {post.category && (
                        <span className="font-pixel text-xs px-2 py-1 border border-terminal-500 text-terminal-400">
                          {post.category}
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-white group-hover:text-terminal-200 transition-colors mb-2">
                      {post.title}
                    </h2>
                    <p className="text-terminal-300 text-sm leading-relaxed line-clamp-2">
                      {post.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </ScrollAnimated>
        )}

        <ScrollAnimated animation="slide-in-left" delay={400}>
          <div className="mb-8 space-y-6">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search posts..."
                className="w-full font-pixel text-sm bg-black border border-terminal-400 text-white px-4 py-3 focus:border-white focus:outline-none placeholder-terminal-500 transition-all duration-150"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 font-pixel text-xs text-terminal-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateFilter("tag", null)}
                  className={cn(
                    "font-pixel text-xs px-3 py-2 border transition-colors",
                    !tagFilter
                      ? "border-white bg-white text-black font-bold"
                      : "border-terminal-400 text-terminal-300 hover:border-white hover:text-white",
                  )}
                >
                  ALL
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => updateFilter("tag", tag)}
                    className={cn(
                      "font-pixel text-xs px-3 py-2 border transition-colors",
                      tagFilter === tag
                        ? "border-white bg-white text-black font-bold"
                        : "border-terminal-400 text-terminal-300 hover:border-white hover:text-white",
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </ScrollAnimated>

        <div className="mb-6">
          <div className="font-pixel text-xs text-terminal-400">
            {filteredPosts.length === 0
              ? "No posts found"
              : `showing ${filteredPosts.length} of ${posts.length} posts`}
          </div>
        </div>

        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <ScrollAnimated key={post.slug} animation="fade-in">
              <Link
                href={`/blog/${post.slug}`}
                className="block p-6 border border-terminal-400 hover:border-white hover:bg-terminal-900 transition-all duration-150 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-pixel text-xs text-terminal-500">
                    {formatDate(new Date(post.publishedAt))}
                  </span>
                  {post.category && (
                    <span className="font-pixel text-xs px-2 py-1 border border-terminal-500 text-terminal-400">
                      {post.category}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white group-hover:text-terminal-200 transition-colors mb-2">
                  {post.title}
                </h2>
                <p className="text-terminal-300 text-sm leading-relaxed line-clamp-2 mb-3">
                  {post.summary}
                </p>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="font-pixel text-xs px-2 py-1 border border-terminal-600 text-terminal-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </ScrollAnimated>
          ))}
        </div>

        <ScrollAnimated animation="fade-in">
          <div className="mt-12 pt-8 border-t border-terminal-400">
            <div className="font-pixel text-xs text-terminal-400">
              {filteredPosts.length} posts
            </div>
          </div>
        </ScrollAnimated>
      </main>
    </div>
  );
}
