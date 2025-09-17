"use client";

import { usePathname } from "next/navigation";
import { slug } from "github-slugger";
import { formatDate } from "@shipixen/pliny/utils/formatDate";
import { CoreContent } from "@shipixen/pliny/utils/contentlayer";
import type { Blog } from "contentlayer/generated";
import Link from "@/components/shared/Link";
import { siteConfig } from "@/data/config/site.settings";
import tagData from "app/tag-data.json";
import SectionContainer from "@/components/shared/SectionContainer";
import {
  LandingBlogPost,
  BlogPost,
} from "@/components/landing/blog/LandingBlogPost";
import { LandingBlogList } from "@/components/landing/blog/LandingBlogList";

const BLOG_URL = siteConfig.blogPath ? `/${siteConfig.blogPath}` : "/";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

interface ListLayoutProps {
  posts: CoreContent<Blog>[];
  title: string;
  initialDisplayPosts?: CoreContent<Blog>[];
  pagination?: PaginationProps;
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname();
  const basePath = pathname.split("/")[1];
  const prevPage = currentPage - 1 > 0;
  const nextPage = currentPage + 1 <= totalPages;

  return (
    <div className="py-8 border-t border-terminal-400 mt-12">
      <div className="flex items-center justify-between">
        <div className="font-pixel text-xs text-terminal-400">
          page {currentPage} of {totalPages}
        </div>

        <div className="flex gap-4">
          {prevPage && (
            <Link
              href={
                currentPage - 1 === 1
                  ? `/${basePath}/`
                  : `/${basePath}/page/${currentPage - 1}`
              }
              rel="prev"
              className="font-pixel text-xs px-4 py-2 border border-terminal-400 text-terminal-300 hover:border-white hover:text-white transition-colors"
            >
              ← PREV
            </Link>
          )}

          {nextPage && (
            <Link
              href={`/${basePath}/page/${currentPage + 1}`}
              rel="next"
              className="font-pixel text-xs px-4 py-2 border border-terminal-400 text-terminal-300 hover:border-white hover:text-white transition-colors"
            >
              NEXT →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname();
  const tagCounts = tagData as Record<string, number>;
  const tagKeys = Object.keys(tagCounts);
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a]);

  const displayPosts =
    initialDisplayPosts.length > 0 ? initialDisplayPosts : posts;

  if (displayPosts.length === 0) {
    return (
      <div className="flex flex-col gap-1 p-6 mb-10">
        <h2 className="text-4xl">No posts found</h2>
        <p>Please check back later!</p>
      </div>
    );
  }

  const formattedPosts = displayPosts.map((post): BlogPost => {
    return {
      path: `/${post.path}`,
      slug: post.slug || "",
      date: formatDate(post.date, siteConfig.locale),
      title: post.title,
      summary: post.summary,
      tags: post.tags?.map((tag) => {
        return {
          url: `/tags/${slug(tag)}`,
          text: tag,
        };
      }),
      images: post.images || [],
      readingTime: post.readingTime?.text || "",
      author: {
        name: post.authors?.[0],
      },
    };
  });

  return (
    <div className="min-h-screen bg-black">
      <main className="container mx-auto px-4 pt-8 pb-12">
        {/* Terminal Header */}
        <div className="mb-12">
          <div className="font-pixel text-sm text-terminal-400 mb-2">
            caspian@localhost:~$ ls articles/
          </div>
          <h1 className="text-4xl md:text-6xl font-pixel font-bold text-white mb-4">
            {title.toUpperCase()}/
          </h1>
          <p className="text-terminal-300 max-w-2xl">
            Technical articles, insights, and thoughts on software development,
            architecture, and the evolving landscape of technology.
          </p>
        </div>

        <div className="flex gap-12">
          <div className="flex-1">
            <LandingBlogList display="list" variant="primary" className="!pt-0">
              {formattedPosts.map((post) => (
                <LandingBlogPost
                  key={post.slug}
                  post={post}
                  imagePosition="right"
                />
              ))}
            </LandingBlogList>

            {pagination && pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-80">
            <div className="sticky top-24">
              {/* Tags Section */}
              <div className="mb-8">
                <div className="font-pixel text-xs text-terminal-400 mb-4">
                  filter by tags:
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {sortedTags.map((t) => {
                    const isActive = pathname.split("/tags/")[1] === slug(t);
                    return (
                      <Link
                        key={t}
                        href={`/tags/${slug(t)}`}
                        className={`flex items-center justify-between p-3 border transition-all duration-75 group ${
                          isActive
                            ? "border-white bg-white text-black"
                            : "border-terminal-400 hover:border-white hover:bg-terminal-900"
                        }`}
                        aria-label={`View posts tagged ${t}`}
                      >
                        <span className={`font-pixel text-xs ${
                          isActive
                            ? "text-black"
                            : "text-terminal-300 group-hover:text-white"
                        }`}>
                          {t.toUpperCase()}
                        </span>
                        <span className={`font-pixel text-xs ${
                          isActive
                            ? "text-black"
                            : "text-terminal-500 group-hover:text-terminal-300"
                        }`}>
                          ({tagCounts[t]})
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Stats */}
              <div className="p-4 border border-terminal-400">
                <div className="font-pixel text-xs text-terminal-400 mb-3">
                  blog stats:
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-pixel text-xs text-terminal-300">Total Articles:</span>
                    <span className="font-pixel text-xs text-white">{posts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-pixel text-xs text-terminal-300">Total Tags:</span>
                    <span className="font-pixel text-xs text-white">{sortedTags.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-pixel text-xs text-terminal-300">Last Updated:</span>
                    <span className="font-pixel text-xs text-white">
                      {posts[0] ? formatDate(posts[0].date, siteConfig.locale) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terminal Footer */}
        <div className="mt-12 pt-8 border-t border-terminal-400">
          <div className="font-pixel text-xs text-terminal-400">
            found {posts.length} articles • last updated {formatDate(new Date(), siteConfig.locale)}
          </div>
        </div>
      </main>
    </div>
  );
}
