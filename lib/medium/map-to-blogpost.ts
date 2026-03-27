import { generateSlug } from "@/lib/utils";
import type { IBlogPostFields } from "@/lib/models/BlogPost";
import type { ParsedMediumPost } from "./types";
import {
  htmlToMarkdown,
  extractSummary,
  extractCoverImage,
} from "./html-to-markdown";

type BlogPostInput = Omit<IBlogPostFields, "_id" | "updatedAt">;

/**
 * Map a parsed Medium post to the BlogPost model shape.
 */
export function mapToBlogPost(post: ParsedMediumPost): BlogPostInput {
  const content = htmlToMarkdown(post.htmlContent);
  const summary = extractSummary(post.htmlContent);
  const coverImage = extractCoverImage(post.htmlContent);

  return {
    title: post.title,
    slug: generateSlug(post.title),
    content,
    summary,
    tags: post.categories,
    category: "",
    ...(coverImage ? { coverImage } : {}),
    author: post.author,
    draft: false,
    publishedAt: post.publishedAt,
    seoTitle: post.title,
    seoDescription: summary,
    seoKeywords: [],
  };
}
