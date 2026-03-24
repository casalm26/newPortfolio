#!/usr/bin/env node

/**
 * Seed MongoDB from existing MDX project files and CV timeline JSON.
 *
 * Usage:
 *   MONGODB_URI=mongodb+srv://... node scripts/seed-db.mjs
 *
 * Options:
 *   --clear   Drop existing collections before seeding
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ── MongoDB connection ──

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI environment variable is required");
  process.exit(1);
}

const shouldClear = process.argv.includes("--clear");

// ── Schemas (inline to avoid TS import issues) ──

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    content: { type: String, required: true },
    summary: { type: String, required: true },
    projectType: { type: String, required: true },
    category: { type: String, default: "" },
    skills: { type: [String], default: [] },
    tools: { type: [String], default: [] },
    links: { type: mongoose.Schema.Types.Mixed, default: {} },
    duration: { type: String },
    role: { type: String },
    coverImage: { type: String },
    draft: { type: Boolean, default: false },
    publishedAt: { type: Date, default: Date.now },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
  },
  { timestamps: true },
);

const TimelineEntrySchema = new mongoose.Schema(
  {
    entryId: { type: String, required: true, unique: true, index: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    company: { type: String, default: "" },
    location: { type: String, default: "" },
    startDate: { type: String, required: true },
    endDate: { type: String, default: null },
    current: { type: Boolean, default: false },
    description: { type: String, default: "" },
    skills: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// ── Parse MDX frontmatter ──

function parseMDX(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) {
    console.warn(`  Skipping ${path.basename(filePath)}: no frontmatter`);
    return null;
  }

  const frontmatter = {};
  const fmLines = fmMatch[1].split("\n");
  let currentKey = null;
  let arrayBuffer = [];
  let inArray = false;

  for (const line of fmLines) {
    // Array item inside brackets on multiple lines
    if (inArray) {
      const trimmed = line.trim();
      if (trimmed === "]") {
        frontmatter[currentKey] = arrayBuffer;
        inArray = false;
        arrayBuffer = [];
        continue;
      }
      const itemMatch = trimmed.match(/^"([^"]*)"[,]?$/);
      if (itemMatch) {
        arrayBuffer.push(itemMatch[1]);
      }
      continue;
    }

    // Key-value pair
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (!kvMatch) continue;

    const [, key, rawValue] = kvMatch;
    currentKey = key;

    // Inline array: ["a", "b"]
    const inlineArrayMatch = rawValue.match(/^\[(.*)\]$/);
    if (inlineArrayMatch) {
      const items = inlineArrayMatch[1]
        .split(",")
        .map((s) => s.trim().replace(/^"|"$/g, ""))
        .filter(Boolean);
      frontmatter[key] = items;
      continue;
    }

    // Start of multi-line array
    if (rawValue.trim() === "" || rawValue.trim() === "[") {
      // Check if next-ish lines are array items
      inArray = rawValue.trim() === "[";
      if (inArray) {
        arrayBuffer = [];
      }
      continue;
    }

    // Nested key-value (links)
    if (rawValue === "") continue;

    // String value
    let value = rawValue.trim().replace(/^"|"$/g, "");
    frontmatter[key] = value;
  }

  // Parse links block (simple YAML-like)
  const linksMatch = fmMatch[1].match(/links:\n((?:\s+\w+:.*\n?)*)/);
  if (linksMatch) {
    const links = {};
    const linkLines = linksMatch[1].split("\n").filter((l) => l.trim());
    for (const ll of linkLines) {
      const lm = ll.match(/^\s+(\w+):\s*"?([^"]*)"?$/);
      if (lm) links[lm[1]] = lm[2].trim();
    }
    frontmatter.links = links;
  }

  // Handle multi-line array that starts with [
  const multiArrayMatch = fmMatch[1].matchAll(
    /^(\w+):\s*\n\s+\[\n([\s\S]*?)\n\s+\]/gm,
  );
  for (const m of multiArrayMatch) {
    const key = m[1];
    const items = m[2]
      .split(",")
      .map((s) => s.trim().replace(/^"|"$/g, "").replace(/,$/, ""))
      .filter(Boolean);
    frontmatter[key] = items;
  }

  const content = fmMatch[2].trim();
  const slug = path.basename(filePath, ".mdx");

  return { frontmatter, content, slug };
}

// ── Main ──

async function main() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected.");

  const Project =
    mongoose.models.Project || mongoose.model("Project", ProjectSchema);
  const TimelineEntry =
    mongoose.models.TimelineEntry ||
    mongoose.model("TimelineEntry", TimelineEntrySchema);

  if (shouldClear) {
    console.log("Clearing existing data...");
    await Project.deleteMany({});
    await TimelineEntry.deleteMany({});
  }

  // ── Seed Projects ──
  const projectsDir = path.join(ROOT, "data/projects");
  const mdxFiles = fs
    .readdirSync(projectsDir)
    .filter((f) => f.endsWith(".mdx"));

  console.log(`\nSeeding ${mdxFiles.length} projects...`);

  let projectCount = 0;
  for (const file of mdxFiles) {
    const parsed = parseMDX(path.join(projectsDir, file));
    if (!parsed) continue;

    const { frontmatter: fm, content, slug } = parsed;

    const existing = await Project.findOne({ slug });
    if (existing) {
      console.log(`  [skip] ${slug} (already exists)`);
      continue;
    }

    await Project.create({
      title: fm.title || slug,
      slug,
      content,
      summary: fm.summary || "",
      projectType: fm.projectType || "Technical",
      category: fm.category || "",
      skills: fm.skills || [],
      tools: fm.tools || [],
      links: fm.links || {},
      duration: fm.duration || "",
      role: fm.role || "",
      draft: fm.draft === "true",
      publishedAt: fm.date ? new Date(fm.date) : new Date(),
      seoTitle: fm.title || "",
      seoDescription: fm.summary || "",
    });

    console.log(`  [ok] ${slug}`);
    projectCount++;
  }

  console.log(`Inserted ${projectCount} projects.`);

  // ── Seed Timeline ──
  const timelinePath = path.join(ROOT, "data/cv/timeline.json");
  if (fs.existsSync(timelinePath)) {
    const timelineData = JSON.parse(fs.readFileSync(timelinePath, "utf-8"));
    const entries = timelineData.timeline || [];

    console.log(`\nSeeding ${entries.length} timeline entries...`);

    let timelineCount = 0;
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];

      const existing = await TimelineEntry.findOne({ entryId: entry.id });
      if (existing) {
        console.log(`  [skip] ${entry.id} (already exists)`);
        continue;
      }

      await TimelineEntry.create({
        entryId: entry.id,
        type: entry.type,
        title: entry.title,
        company: entry.company || entry.institution || "",
        location: entry.location || "",
        startDate: entry.startDate,
        endDate: entry.endDate || null,
        current: entry.current || false,
        description: entry.description || "",
        skills: entry.skills || [],
        order: i,
      });

      console.log(`  [ok] ${entry.id}`);
      timelineCount++;
    }

    console.log(`Inserted ${timelineCount} timeline entries.`);
  }

  console.log("\nDone! Disconnecting...");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
