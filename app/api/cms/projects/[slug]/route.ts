import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { Project } from "@/lib/models";
import { authenticateCMS } from "@/lib/cms/auth";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const authError = authenticateCMS(request);
  if (authError) return authError;

  await connectDB();
  const { slug } = await params;

  const project = await Project.findOne({ slug }).lean();
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const authError = authenticateCMS(request);
  if (authError) return authError;

  await connectDB();
  const { slug } = await params;
  const body = await request.json();

  const project = await Project.findOneAndUpdate({ slug }, body, {
    new: true,
    runValidators: true,
  }).lean();

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authError = authenticateCMS(request);
  if (authError) return authError;

  await connectDB();
  const { slug } = await params;

  const project = await Project.findOneAndDelete({ slug }).lean();
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Project deleted" });
}
