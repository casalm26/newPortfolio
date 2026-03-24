import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { TimelineEntry } from "@/lib/models";
import { authenticateCMS } from "@/lib/cms/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const authError = authenticateCMS(request);
  if (authError) return authError;

  await connectDB();
  const { id } = await params;

  const entry = await TimelineEntry.findOne({ entryId: id }).lean();
  if (!entry) {
    return NextResponse.json(
      { error: "Timeline entry not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(entry);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const authError = authenticateCMS(request);
  if (authError) return authError;

  await connectDB();
  const { id } = await params;
  const body = await request.json();

  const entry = await TimelineEntry.findOneAndUpdate({ entryId: id }, body, {
    new: true,
    runValidators: true,
  }).lean();

  if (!entry) {
    return NextResponse.json(
      { error: "Timeline entry not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(entry);
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authError = authenticateCMS(request);
  if (authError) return authError;

  await connectDB();
  const { id } = await params;

  const entry = await TimelineEntry.findOneAndDelete({ entryId: id }).lean();
  if (!entry) {
    return NextResponse.json(
      { error: "Timeline entry not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ message: "Timeline entry deleted" });
}
