import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { Video } from "@/lib/models";
import { authenticateCMS } from "@/lib/cms/auth";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const authError = authenticateCMS(request);
  if (authError) return authError;

  await connectDB();
  const { slug } = await params;

  const video = await Video.findOne({ slug }).lean();
  if (!video) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }

  return NextResponse.json(video);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const authError = authenticateCMS(request);
  if (authError) return authError;

  await connectDB();
  const { slug } = await params;
  const body = await request.json();

  const video = await Video.findOneAndUpdate({ slug }, body, {
    new: true,
    runValidators: true,
  }).lean();

  if (!video) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }

  return NextResponse.json(video);
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authError = authenticateCMS(request);
  if (authError) return authError;

  await connectDB();
  const { slug } = await params;

  const video = await Video.findOneAndDelete({ slug }).lean();
  if (!video) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Video deleted" });
}
