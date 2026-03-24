import {
  defineDocumentType,
  ComputedFields,
  makeSource,
} from "contentlayer2/source-files";
import path from "path";
// Remark packages
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import {
  remarkExtractFrontmatter,
  remarkCodeTitles,
  remarkImgToJsx,
  extractTocHeadings,
} from "@shipixen/pliny/mdx-plugins/index.js";
// Rehype packages
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import rehypeCitation from "rehype-citation";
import rehypePrismPlus from "rehype-prism-plus";
import rehypePresetMinify from "rehype-preset-minify";
import { siteConfig } from "./data/config/site.settings";

const root = process.cwd();

const computedFields: ComputedFields = {
  slug: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.replace(/^.+?(\/)/, ""),
  },
  path: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath,
  },
  filePath: {
    type: "string",
    resolve: (doc) => doc._raw.sourceFilePath,
  },
  toc: { type: "json", resolve: (doc) => extractTocHeadings(doc.body.raw) },
};

export const Project = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: "projects/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    lastmod: { type: "date" },
    tags: { type: "list", of: { type: "string" }, default: [] },
    draft: { type: "boolean" },
    summary: { type: "string" },
    images: { type: "json" },
    projectType: { type: "string", required: true }, // Technical, Creative, Business, Learning
    category: { type: "string" },
    duration: { type: "string" },
    role: { type: "string" },
    skills: { type: "list", of: { type: "string" }, default: [] },
    tools: { type: "list", of: { type: "string" }, default: [] },
    links: { type: "json" },
  },
  computedFields: {
    ...computedFields,
    structuredData: {
      type: "json",
      resolve: (doc) => ({
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: doc.title,
        description: doc.summary,
        dateCreated: doc.date,
        dateModified: doc.lastmod || doc.date,
        author: {
          "@type": "Person",
          name: "Caspian Almerud",
        },
        keywords: doc.tags,
        url: `${siteConfig.siteUrl}/projects/${doc._raw.flattenedPath.replace(/^projects\//, "")}`,
      }),
    },
  },
}));

export const TimelineData = defineDocumentType(() => ({
  name: "TimelineData",
  filePathPattern: "cv/timeline.json",
  contentType: "data",
  fields: {
    categories: { type: "json", required: true },
    timeline: { type: "json", required: true },
  },
}));

export default makeSource({
  contentDirPath: "data",
  documentTypes: [Project, TimelineData],
  mdx: {
    cwd: process.cwd(),
    remarkPlugins: [
      remarkExtractFrontmatter,
      remarkGfm,
      remarkCodeTitles,
      remarkMath,
      remarkImgToJsx,
    ],
    rehypePlugins: [
      rehypeSlug,
      rehypeKatex,
      [rehypeCitation, { path: path.join(root, "data") }],
      [rehypePrismPlus, { defaultLanguage: "js", ignoreMissing: true }],
      rehypePresetMinify,
    ],
  },
  onMissingOrIncompatibleData: "skip-warn",
});
