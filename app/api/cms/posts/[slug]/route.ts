import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { BlogPost } from "@/lib/models";
import { authenticateCMS } from "@/lib/cms/auth";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const authError = authenticateCMS(request);
  if (authError) return authError;

  await connectDB();
  const { slug } = await params;

  const post = await BlogPost.findOne({ slug }).lean();
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const authError = authenticateCMS(request);
  if (authError) return authError;

  await connectDB();
  const { slug } = await params;
  const body = await request.json();

  const post = await BlogPost.findOneAndUpdate({ slug }, body, {
    new: true,
    runValidators: true,
  }).lean();

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authError = authenticateCMS(request);
  if (authError) return authError;

  await connectDB();
  const { slug } = await params;

  const post = await BlogPost.findOneAndDelete({ slug }).lean();
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Post deleted" });
}
