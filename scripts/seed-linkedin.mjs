#!/usr/bin/env node

/**
 * Seed MongoDB with blog-worthy LinkedIn posts.
 * Reads from ~/Downloads/LinkedIn Posts from Caspian Almerud.json
 */

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import os from 'os';

const MONGODB_URI = process.env.MONGODB_URI;
const dryRun = process.argv.includes('--dry-run');
if (!MONGODB_URI && !dryRun) {
  console.error('MONGODB_URI required');
  process.exit(1);
}

const BlogPostSchema = new mongoose.Schema(
  {
    title: String, slug: String, content: String, summary: String,
    tags: [String], category: String, coverImage: String, author: String,
    featured: Boolean, featuredOrder: Number, draft: Boolean,
    publishedAt: Date, seoTitle: String, seoDescription: String, seoKeywords: [String],
  },
  { timestamps: true },
);

function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function truncate(text, max = 200) {
  if (!text || text.length <= max) return text || '';
  const t = text.slice(0, max);
  const sp = t.lastIndexOf(' ');
  return (sp > 0 ? t.slice(0, sp) : t) + '...';
}

function textToMarkdown(text) {
  // Split into paragraphs on double newlines, trim each
  return text
    .replace(/… mer$/, '')
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .join('\n\n');
}

// Manual title overrides for posts where first line is too long
const TITLE_OVERRIDES = {
  'The single best thing I\'ve done for my career is to post consistently.': 'Posting consistently changed my career',
  'In order for personal structure to work, you have to trust your systems.': 'Trust your systems',
  'One of the most important parts to my self development has been my willingness to experiment on myself.': 'Experimenting on myself',
  'Running has been therapeutic for me, as it has for a lot of other people.': 'Running as therapy',
  'Sometimes going gear-first makes sense.': 'Going gear-first',
  'I\'ve been a fanatic in a bunch of different ways.': 'On being a fanatic',
  'Forskning visar på att de ledarskapsprogram som många går idag har väldigt lite inverkan på faktiska beteenden.': 'Ledarskapsprogram som förändrar beteenden',
};

function extractTitle(text) {
  // Use just the first sentence of the first line
  const firstLine = text.split('\n')[0].trim().replace(/… mer$/, '').trim();

  // Check for manual override
  for (const [key, override] of Object.entries(TITLE_OVERRIDES)) {
    if (firstLine.startsWith(key.slice(0, 40))) return override;
  }

  // If first line is short enough, use it
  if (firstLine.length <= 80) {
    return firstLine.replace(/\.$/, '').trim();
  }

  // Otherwise take first sentence
  const sentenceEnd = firstLine.search(/[.!?]\s/);
  if (sentenceEnd > 0 && sentenceEnd < 80) {
    return firstLine.slice(0, sentenceEnd).trim();
  }

  // Truncate at word boundary
  const truncated = firstLine.slice(0, 70);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated).trim();
}

// Blog-worthy LinkedIn posts (personal essays, not promos/podcast/recruitment)
const MIN_LENGTH = 800;
const SKIP_PATTERNS = [
  'Är du ansvarig för',
  'Finns det rekryterare',
  'Vill du bli bättre på att be om hjälp',
  'Happy Friday LinkedIn',
  'I\'m starting my podcast up again',
  'This weeks\' riff',
  'Hey friends! \nPopping in to share an update',
  'I vintras så gjordes',
  '6 saker du kan skriva om',
  'Show notes found here',
  'Popping in to share an update',
];

async function main() {
  const jsonPath = path.join(
    os.homedir(),
    'Downloads',
    'LinkedIn Posts from Caspian Almerud.json',
  );

  if (!fs.existsSync(jsonPath)) {
    console.error('LinkedIn posts file not found at', jsonPath);
    process.exit(1);
  }

  const rawPosts = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`Loaded ${rawPosts.length} LinkedIn posts.\n`);

  // Filter to blog-worthy posts
  const blogWorthy = rawPosts.filter((p) => {
    const text = p.text || '';
    if (text.length < MIN_LENGTH) return false;
    return !SKIP_PATTERNS.some((pattern) => text.includes(pattern));
  });

  console.log(`Found ${blogWorthy.length} blog-worthy posts (>= ${MIN_LENGTH} chars, filtered).\n`);

  const posts = blogWorthy.map((p) => {
    const text = p.text || '';
    const title = extractTitle(text);
    const content = textToMarkdown(text);
    // Summary from first paragraph after title
    const paragraphs = content.split('\n\n');
    const summaryPara = paragraphs.length > 1 ? paragraphs[1] : paragraphs[0];
    const summary = truncate(summaryPara);
    const publishedAt = p.timestamp
      ? new Date(p.timestamp)
      : new Date(p.scraped_at || Date.now());

    return {
      title,
      slug: generateSlug(title),
      content,
      summary,
      tags: ['linkedin'],
      category: '',
      author: 'Caspian Almerud',
      draft: false,
      publishedAt,
      seoTitle: title,
      seoDescription: summary,
      seoKeywords: [],
    };
  });

  if (dryRun) {
    console.log('DRY RUN:\n');
    posts.forEach((p) => {
      console.log(`  ${p.slug} — "${p.title}"`);
      console.log(`    content: ${p.content.length} chars, summary: ${p.summary.slice(0, 60)}...`);
      console.log();
    });
    console.log(`Total: ${posts.length}`);
    return;
  }

  await mongoose.connect(MONGODB_URI);
  const BlogPost =
    mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

  let inserted = 0;
  let skipped = 0;

  for (const post of posts) {
    if (!post.content.trim()) {
      console.log(`  [skip] ${post.slug} (empty)`);
      skipped++;
      continue;
    }
    const existing = await BlogPost.findOne({ slug: post.slug });
    if (existing) {
      console.log(`  [skip] ${post.slug} (exists)`);
      skipped++;
      continue;
    }
    await BlogPost.create(post);
    console.log(`  [ok] ${post.slug}`);
    inserted++;
  }

  console.log(`\nDone! Inserted ${inserted}, skipped ${skipped}.`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
