import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { Video } from "@/lib/models";
import { generateSlug } from "@/lib/utils";
import { applySEODefaults } from "@/lib/cms/crud-helpers";

export async function GET(request: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const tag = searchParams.get("tag");
  const category = searchParams.get("category");

  const filter: Record<string, unknown> = {};
  if (tag) filter.tags = tag;
  if (category) filter.category = category;

  const [videos, total] = await Promise.all([
    Video.find(filter)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Video.countDocuments(filter),
  ]);

  return NextResponse.json({
    videos,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}

export async function POST(request: NextRequest) {
  await connectDB();

  const body = await request.json();

  if (!body.slug) body.slug = generateSlug(body.title);

  if (!body.thumbnail && body.youtubeId) {
    body.thumbnail = `https://img.youtube.com/vi/${body.youtubeId}/maxresdefault.jpg`;
  }

  applySEODefaults(body, "description");

  const video = await Video.create(body);
  return NextResponse.json(video, { status: 201 });
}
