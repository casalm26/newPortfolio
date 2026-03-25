import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { TimelineEntry } from "@/lib/models";
import { authenticateCMS } from "@/lib/cms/auth";

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
  const type = searchParams.get("type");

  const filter: Record<string, unknown> = {};
  if (type) filter.type = type;

  const entries = await TimelineEntry.find(filter)
    .sort({ order: 1, startDate: -1 })
    .lean();

  return NextResponse.json({ entries });
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

  if (!body.entryId) {
    body.entryId = `${body.type}-${Date.now()}`;
  }

  const entry = await TimelineEntry.create(body);
  return NextResponse.json(entry, { status: 201 });
}
