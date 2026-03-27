#!/usr/bin/env node

/**
 * Seed MongoDB with blog posts from Medium.
 *
 * Usage:
 *   MONGODB_URI=mongodb+srv://... node scripts/seed-medium.mjs
 *
 * Options:
 *   --clear     Drop existing blog posts before seeding
 *   --dry-run   Preview what would be inserted without touching the database
 *
 * Reads scraped post data from scripts/medium-posts.json (exported from browser).
 */

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Args ──

const MONGODB_URI = process.env.MONGODB_URI;
const shouldClear = process.argv.includes('--clear');
const dryRun = process.argv.includes('--dry-run');

if (!MONGODB_URI && !dryRun) {
  console.error('Error: MONGODB_URI environment variable is required');
  process.exit(1);
}

// ── Inline BlogPost schema ──

const BlogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    content: { type: String, required: true },
    summary: { type: String, required: true },
    tags: { type: [String], default: [] },
    category: { type: String, default: '' },
    coverImage: { type: String },
    author: { type: String, default: 'Caspian Almerud' },
    draft: { type: Boolean, default: false },
    publishedAt: { type: Date, default: Date.now },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
    seoKeywords: { type: [String], default: [] },
  },
  { timestamps: true },
);

// ── Utilities ──

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function truncateSummary(text, maxLength = 200) {
  if (!text || text.length <= maxLength) return text || '';
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + '...';
}

// ── Convert Medium paragraphs to markdown ──

function applyMarkups(text, markups) {
  if (!markups?.length || !text) return text;

  // Sort by start descending so insertions don't shift later positions
  const sorted = [...markups].sort((a, b) => b.start - a.start);

  let result = text;
  for (const m of sorted) {
    const before = result.slice(0, m.start);
    const inner = result.slice(m.start, m.end);
    const after = result.slice(m.end);

    switch (m.type) {
      case 'A':
        result = `${before}[${inner}](${m.href})${after}`;
        break;
      case 'STRONG':
        result = `${before}**${inner}**${after}`;
        break;
      case 'EM':
        result = `${before}_${inner}_${after}`;
        break;
      case 'CODE':
        result = `${before}\`${inner}\`${after}`;
        break;
      default:
        break;
    }
  }

  return result;
}

function paragraphsToMarkdown(paragraphs) {
  const lines = [];

  for (const p of paragraphs) {
    const text = applyMarkups(p.text, p.markups);

    switch (p.type) {
      case 'H2':
        lines.push(`## ${text}`);
        break;
      case 'H3':
        lines.push(`### ${text}`);
        break;
      case 'H4':
        lines.push(`#### ${text}`);
        break;
      case 'P':
        lines.push(text);
        break;
      case 'BQ':
      case 'PQ':
        lines.push(`> ${text}`);
        break;
      case 'ULI':
        lines.push(`- ${text}`);
        break;
      case 'OLI':
        lines.push(`1. ${text}`);
        break;
      case 'PRE':
        lines.push('```\n' + p.text + '\n```');
        break;
      default:
        if (text) lines.push(text);
        break;
    }
  }

  return lines.join('\n\n');
}

// ── Main ──

async function main() {
  // Load scraped data
  const jsonPath = path.join(__dirname, 'medium-posts.json');
  if (!fs.existsSync(jsonPath)) {
    console.error(
      'Error: scripts/medium-posts.json not found. Run the browser scraper first.',
    );
    process.exit(1);
  }

  const rawPosts = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`Loaded ${rawPosts.length} posts from medium-posts.json\n`);

  // Transform to BlogPost documents
  const posts = [];
  const slugCounts = {};

  for (const raw of rawPosts) {
    // Skip title paragraph if it matches the post title
    const paragraphs =
      raw.paragraphs?.length > 0 &&
      raw.paragraphs[0].type === 'H3' &&
      raw.paragraphs[0].text === raw.title
        ? raw.paragraphs.slice(1)
        : raw.paragraphs || [];

    const content = paragraphsToMarkdown(paragraphs);
    const summary = truncateSummary(raw.subtitle) ||
      truncateSummary(paragraphs.find((p) => p.type === 'P')?.text) ||
      raw.title;

    let slug = generateSlug(raw.title);

    // Handle duplicate slugs by appending date
    slugCounts[slug] = (slugCounts[slug] || 0) + 1;
    if (slugCounts[slug] > 1) {
      const date = new Date(raw.firstPublishedAt).toISOString().split('T')[0];
      slug = `${slug}-${date}`;
    }

    posts.push({
      title: raw.title,
      slug,
      content,
      summary,
      tags: [],
      category: '',
      author: 'Caspian Almerud',
      draft: false,
      publishedAt: new Date(raw.firstPublishedAt),
      seoTitle: raw.title,
      seoDescription: summary,
      seoKeywords: [],
    });
  }

  if (dryRun) {
    console.log('DRY RUN — would insert these posts:\n');
    for (const post of posts.slice(0, 20)) {
      console.log(
        `  ${post.slug} — "${post.title}" (${post.publishedAt.toISOString().split('T')[0]})`,
      );
      console.log(`    content: ${post.content.length} chars markdown`);
    }
    if (posts.length > 20)
      console.log(`  ... and ${posts.length - 20} more\n`);
    console.log(`Total: ${posts.length} posts`);
    return;
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected.\n');

  const BlogPost =
    mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

  if (shouldClear) {
    const deleted = await BlogPost.deleteMany({});
    console.log(`Cleared ${deleted.deletedCount} existing blog posts.\n`);
  }

  console.log(`Seeding ${posts.length} blog posts...`);

  let inserted = 0;
  let skipped = 0;

  for (const post of posts) {
    if (!post.content.trim()) {
      console.log(`  [skip] ${post.slug} (empty content)`);
      skipped++;
      continue;
    }

    const existing = await BlogPost.findOne({ slug: post.slug });
    if (existing) {
      console.log(`  [skip] ${post.slug} (already exists)`);
      skipped++;
      continue;
    }

    await BlogPost.create(post);
    process.stdout.write(`  [ok] ${post.slug}\n`);
    inserted++;
  }

  console.log(
    `\nDone! Inserted ${inserted}, skipped ${skipped} (of ${posts.length} total).`,
  );
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
