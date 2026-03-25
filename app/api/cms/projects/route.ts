import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { Project } from "@/lib/models";
import { authenticateCMS } from "@/lib/cms/auth";
import { generateSlug } from "@/lib/utils";
import { applySEODefaults } from "@/lib/cms/crud-helpers";

export async function GET(request: NextRequest) {
  const authError = authenticateCMS(request);
  if (authError) return authError;

  const db = await connectDB();
  if (!db)
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 },
    );

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const projectType = searchParams.get("projectType");
  const draft = searchParams.get("draft");

  const filter: Record<string, unknown> = {};
  if (projectType) filter.projectType = projectType;
  if (draft !== null) filter.draft = draft === "true";

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Project.countDocuments(filter),
  ]);

  return NextResponse.json({
    projects,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}

export async function POST(request: NextRequest) {
  const authError = authenticateCMS(request);
  if (authError) return authError;

  const db = await connectDB();
  if (!db)
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 },
    );

  const body = await request.json();

  if (!body.slug) body.slug = generateSlug(body.title);
  applySEODefaults(body);

  const project = await Project.create(body);
  return NextResponse.json(project, { status: 201 });
}
