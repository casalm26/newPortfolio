"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { formatDate } from "@shipixen/pliny/utils/formatDate";
import { CoreContent } from "@shipixen/pliny/utils/contentlayer";
import type { Blog } from "contentlayer/generated";
import Link from "@/components/shared/Link";
import { siteConfig } from "@/data/config/site.settings";

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
    <div className="space-y-2 pb-8 pt-6 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button
            className="cursor-auto disabled:opacity-50"
            disabled={!prevPage}
          >
            Previous
          </button>
        )}
        {prevPage && (
          <Link
            href={
              currentPage - 1 === 1
                ? `/${basePath}/`
                : `/${basePath}/page/${currentPage - 1}`
            }
            rel="prev"
          >
            Previous
          </Link>
        )}
        <span>
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button
            className="cursor-auto disabled:opacity-50"
            disabled={!nextPage}
          >
            Next
          </button>
        )}
        {nextPage && (
          <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next">
            Next
          </Link>
        )}
      </nav>
    </div>
  );
}

export default function ListLayout({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const [searchValue, setSearchValue] = useState("");
  const filteredBlogPosts = posts.filter((post) => {
    const searchContent = post.title + post.summary + post.tags?.join(" ");
    return searchContent.toLowerCase().includes(searchValue.toLowerCase());
  });

  // If initialDisplayPosts exist, display it if no searchValue is specified
  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue
      ? initialDisplayPosts
      : filteredBlogPosts;

  return (
    <>
      <div className="container-wide w-full">
        <div className="space-y-2 p-6 md:space-y-5">
          <h1 className="text-3xl font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {title}
          </h1>
          <div className="relative max-w-lg">
            <label>
              <span className="sr-only">Search articles</span>
              <input
                aria-label="Search articles"
                type="text"
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search articles"
                className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-100"
              />
            </label>
            <svg
              className="absolute right-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {!filteredBlogPosts.length ? (
          <p>No posts found.</p>
        ) : (
          <div className="divide-y divide-terminal-500/40">
            {displayPosts.map((post) => (
              <article key={post.path} className="py-8">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-terminal-400">
                    <time dateTime={post.date}>
                      {formatDate(post.date, siteConfig.locale)}
                    </time>
                    {post.readingTime?.text ? (
                      <span aria-hidden="true">•</span>
                    ) : null}
                    {post.readingTime?.text ? post.readingTime.text : null}
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
                        href={`/tags/${tag}`}
                        className="border border-terminal-500/60 px-2 py-1 hover:border-white hover:text-white transition-colors"
                        aria-label={`View posts tagged ${tag}`}
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && !searchValue && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
        />
      )}
    </>
  );
}
