import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { BlogPost } from "@/lib/models";
import { authenticateCMS } from "@/lib/cms/auth";

export async function GET(request: NextRequest) {
  const authError = authenticateCMS(request);
  if (authError) return authError;

  await connectDB();

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const tag = searchParams.get("tag");
  const category = searchParams.get("category");
  const draft = searchParams.get("draft");

  const filter: Record<string, unknown> = {};
  if (tag) filter.tags = tag;
  if (category) filter.category = category;
  if (draft !== null) filter.draft = draft === "true";

  const [posts, total] = await Promise.all([
    BlogPost.find(filter)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    BlogPost.countDocuments(filter),
  ]);

  return NextResponse.json({
    posts,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}

export async function POST(request: NextRequest) {
  const authError = authenticateCMS(request);
  if (authError) return authError;

  await connectDB();

  const body = await request.json();

  if (!body.slug) {
    body.slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  if (!body.seoTitle) body.seoTitle = body.title;
  if (!body.seoDescription) body.seoDescription = body.summary;

  const post = await BlogPost.create(body);
  return NextResponse.json(post, { status: 201 });
}
