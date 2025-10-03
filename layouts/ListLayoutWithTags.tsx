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
import { useState, useMemo } from "react";

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

function Breadcrumb({ pathname, title }: { pathname: string; title: string }) {
  const segments = pathname.split('/').filter(Boolean);

  return (
    <div className="font-pixel text-xs text-terminal-400 mb-4 flex items-center gap-2">
      <Link href="/" className="hover:text-white transition-colors">
        ~/
      </Link>
      {segments.map((segment, index) => {
        const path = '/' + segments.slice(0, index + 1).join('/');
        const isLast = index === segments.length - 1;
        const displayName = segment === 'all-articles' ? 'articles' :
                           segment === 'tags' ? 'tags' :
                           segment === 'page' ? '' :
                           decodeURIComponent(segment);

        if (!displayName) return null;

        return (
          <span key={path} className="flex items-center gap-2">
            <span>/</span>
            {isLast ? (
              <span className="text-white">{displayName}</span>
            ) : (
              <Link href={path} className="hover:text-white transition-colors">
                {displayName}
              </Link>
            )}
          </span>
        );
      })}
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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");

  const tagCounts = tagData as Record<string, number>;
  const tagKeys = Object.keys(tagCounts);
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a]);

  // Filter and sort posts based on search and sort options
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post => {
        const searchFields = [
          post.title,
          post.summary,
          ...(post.tags || [])
        ].join(' ').toLowerCase();
        return searchFields.includes(searchTerm.toLowerCase());
      });
    }

    // Sort posts
    const sorted = [...filtered];
    switch (sortBy) {
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      default: // newest
        sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return sorted;
  }, [posts, initialDisplayPosts, searchTerm, sortBy]);

  const displayPosts = filteredAndSortedPosts;

  if (displayPosts.length === 0 && !searchTerm) {
    return (
      <div className="min-h-screen bg-black">
        <main className="container mx-auto px-4 pt-8 pb-12">
          <Breadcrumb pathname={pathname} title={title} />
          <div className="flex flex-col gap-1 p-6 mb-10">
            <h2 className="text-4xl font-pixel text-white">No posts found</h2>
            <p className="text-terminal-300">Please check back later!</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <main className="container mx-auto px-4 pt-8 pb-12">
        {/* Breadcrumb Navigation */}
        <Breadcrumb pathname={pathname} title={title} />

        {/* Terminal Header */}
        <div className="mb-8">
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

        {/* Search and Sort Controls */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div>
            <div className="font-pixel text-xs text-terminal-400 mb-3">
              search articles:
            </div>
            <div className="relative max-w-lg">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search titles, content, tags..."
                className="w-full font-pixel text-sm bg-black border border-terminal-400 text-white px-4 py-3 focus:border-white focus:outline-none placeholder-terminal-500"
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
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-4">
            <div className="font-pixel text-xs text-terminal-400">
              sort by:
            </div>
            <div className="flex gap-2">
              {[
                { key: "date", label: "NEWEST" },
                { key: "oldest", label: "OLDEST" },
                { key: "title", label: "A-Z" },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setSortBy(option.key)}
                  className={`font-pixel text-xs px-3 py-2 border transition-colors ${
                    sortBy === option.key
                      ? "border-white bg-white text-black"
                      : "border-terminal-400 text-terminal-300 hover:border-white hover:text-white"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Results Info */}
          {searchTerm && (
            <div className="font-pixel text-xs text-terminal-400">
              {displayPosts.length === 0
                ? `No articles found for "${searchTerm}"`
                : `Found ${displayPosts.length} article${displayPosts.length === 1 ? '' : 's'} for "${searchTerm}"`
              }
            </div>
          )}
        </div>

        <div className="flex gap-12">
          <div className="flex-1">
            <div className="divide-y divide-terminal-500/40">
              {displayPosts.map((post) => (
                <article key={post.path} className="py-8">
                  <div className="grid gap-4 lg:grid-cols-[2fr,1fr] lg:items-start">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3 text-sm text-terminal-400">
                        <time dateTime={post.date}>
                          {formatDate(post.date, siteConfig.locale)}
                        </time>
                        {post.readingTime?.text ? (
                          <span aria-hidden="true">•</span>
                        ) : null}
                        {post.readingTime?.text ?? null}
                      </div>

                      <h2 className="text-2xl font-semibold text-white">
                        <Link href={`/${post.path}`} className="hover:text-terminal-200">
                          {post.title}
                        </Link>
                      </h2>

                      <p className="text-terminal-300 max-w-3xl">{post.summary}</p>

                      <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-terminal-500">
                        {post.tags?.map((tag) => (
                          <Link
                            key={tag}
                            href={`/tags/${slug(tag)}`}
                            className="border border-terminal-500/60 px-2 py-1 hover:border-white hover:text-white transition-colors"
                            aria-label={`View posts tagged ${tag}`}
                          >
                            {tag}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 text-terminal-400 text-sm lg:justify-end">
                      {post.authors?.length ? (
                        <div>
                          <span className="text-terminal-500">Author: </span>
                          {post.authors[0]}
                        </div>
                      ) : null}
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/${post.path}`}
                          className="font-pixel text-xs px-4 py-2 border border-terminal-400 text-terminal-300 hover:border-white hover:text-white transition-colors"
                        >
                          READ POST →
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

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
              {/* Quick Navigation */}
              <div className="mb-8">
                <div className="font-pixel text-xs text-terminal-400 mb-4">
                  quick navigation:
                </div>
                <div className="space-y-2">
                  <Link
                    href="/all-articles"
                    className={`flex items-center justify-between p-3 border transition-all duration-75 group ${
                      pathname === '/all-articles'
                        ? "border-white bg-white text-black"
                        : "border-terminal-400 hover:border-white hover:bg-terminal-900"
                    }`}
                  >
                    <span className={`font-pixel text-xs ${
                      pathname === '/all-articles'
                        ? "text-black"
                        : "text-terminal-300 group-hover:text-white"
                    }`}>
                      ALL ARTICLES
                    </span>
                    <span className={`font-pixel text-xs ${
                      pathname === '/all-articles'
                        ? "text-black"
                        : "text-terminal-500 group-hover:text-terminal-300"
                    }`}>
                      ({posts.length})
                    </span>
                  </Link>
                  <Link
                    href="/tags"
                    className={`flex items-center justify-between p-3 border transition-all duration-75 group ${
                      pathname === '/tags'
                        ? "border-white bg-white text-black"
                        : "border-terminal-400 hover:border-white hover:bg-terminal-900"
                    }`}
                  >
                    <span className={`font-pixel text-xs ${
                      pathname === '/tags'
                        ? "text-black"
                        : "text-terminal-300 group-hover:text-white"
                    }`}>
                      ALL TAGS
                    </span>
                    <span className={`font-pixel text-xs ${
                      pathname === '/tags'
                        ? "text-black"
                        : "text-terminal-500 group-hover:text-terminal-300"
                    }`}>
                      ({sortedTags.length})
                    </span>
                  </Link>
                </div>
              </div>

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

              {/* RSS & Subscribe */}
              <div className="mb-8">
                <div className="font-pixel text-xs text-terminal-400 mb-4">
                  subscribe:
                </div>
                <div className="space-y-2">
                  <a
                    href="/feed.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 border border-terminal-400 hover:border-white hover:bg-terminal-900 transition-all duration-75 group"
                  >
                    <span className="font-pixel text-xs text-terminal-300 group-hover:text-white">
                      RSS FEED
                    </span>
                    <span className="font-pixel text-xs text-terminal-500 group-hover:text-terminal-300">
                      XML
                    </span>
                  </a>
                  {pathname.includes('/tags/') && (
                    <a
                      href={`/tags/${pathname.split('/tags/')[1]}/feed.xml`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 border border-terminal-400 hover:border-white hover:bg-terminal-900 transition-all duration-75 group"
                    >
                      <span className="font-pixel text-xs text-terminal-300 group-hover:text-white">
                        TAG RSS
                      </span>
                      <span className="font-pixel text-xs text-terminal-500 group-hover:text-terminal-300">
                        XML
                      </span>
                    </a>
                  )}
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
                  <div className="flex justify-between">
                    <span className="font-pixel text-xs text-terminal-300">RSS Feeds:</span>
                    <span className="font-pixel text-xs text-white">{Object.keys(tagData as Record<string, number>).length + 1}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terminal Footer */}
        <div className="mt-12 pt-8 border-t border-terminal-400">
          <div className="font-pixel text-xs text-terminal-400">
            found {posts.length} articles • last updated {formatDate(new Date().toISOString(), siteConfig.locale)}
          </div>
        </div>
      </main>
    </div>
  );
}
