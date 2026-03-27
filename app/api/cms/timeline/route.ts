import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { TimelineEntry } from "@/lib/models";

export async function GET(request: NextRequest) {
  await connectDB();

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
  await connectDB();

  const body = await request.json();

  if (!body.entryId) {
    body.entryId = `${body.type}-${Date.now()}`;
  }

  const entry = await TimelineEntry.create(body);
  return NextResponse.json(entry, { status: 201 });
}
