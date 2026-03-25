import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { authenticateCMS } from "@/lib/cms/auth";
import type { Model } from "mongoose";

interface SlugRouteParams {
  params: Promise<{ slug: string }>;
}

interface IdRouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Creates GET/PUT/DELETE handlers for a resource identified by slug.
 */
export function createSlugRouteHandlers(
  model: Model<unknown>,
  resourceName: string,
) {
  async function GET(request: NextRequest, { params }: SlugRouteParams) {
    const authError = authenticateCMS(request);
    if (authError) return authError;

    const db = await connectDB();
    if (!db)
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 },
      );
    const { slug } = await params;

    const doc = await model.findOne({ slug }).lean();
    if (!doc) {
      return NextResponse.json(
        { error: `${resourceName} not found` },
        { status: 404 },
      );
    }

    return NextResponse.json(doc);
  }

  async function PUT(request: NextRequest, { params }: SlugRouteParams) {
    const authError = authenticateCMS(request);
    if (authError) return authError;

    const db = await connectDB();
    if (!db)
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 },
      );
    const { slug } = await params;
    const body = await request.json();

    const doc = await model
      .findOneAndUpdate({ slug }, body, {
        new: true,
        runValidators: true,
      })
      .lean();

    if (!doc) {
      return NextResponse.json(
        { error: `${resourceName} not found` },
        { status: 404 },
      );
    }

    return NextResponse.json(doc);
  }

  async function DELETE(request: NextRequest, { params }: SlugRouteParams) {
    const authError = authenticateCMS(request);
    if (authError) return authError;

    const db = await connectDB();
    if (!db)
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 },
      );
    const { slug } = await params;

    const doc = await model.findOneAndDelete({ slug }).lean();
    if (!doc) {
      return NextResponse.json(
        { error: `${resourceName} not found` },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: `${resourceName} deleted` });
  }

  return { GET, PUT, DELETE };
}

/**
 * Creates GET/PUT/DELETE handlers for a resource identified by entryId.
 */
export function createIdRouteHandlers(
  model: Model<unknown>,
  resourceName: string,
) {
  async function GET(request: NextRequest, { params }: IdRouteParams) {
    const authError = authenticateCMS(request);
    if (authError) return authError;

    const db = await connectDB();
    if (!db)
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 },
      );
    const { id } = await params;

    const doc = await model.findOne({ entryId: id }).lean();
    if (!doc) {
      return NextResponse.json(
        { error: `${resourceName} not found` },
        { status: 404 },
      );
    }

    return NextResponse.json(doc);
  }

  async function PUT(request: NextRequest, { params }: IdRouteParams) {
    const authError = authenticateCMS(request);
    if (authError) return authError;

    const db = await connectDB();
    if (!db)
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 },
      );
    const { id } = await params;
    const body = await request.json();

    const doc = await model
      .findOneAndUpdate({ entryId: id }, body, {
        new: true,
        runValidators: true,
      })
      .lean();

    if (!doc) {
      return NextResponse.json(
        { error: `${resourceName} not found` },
        { status: 404 },
      );
    }

    return NextResponse.json(doc);
  }

  async function DELETE(request: NextRequest, { params }: IdRouteParams) {
    const authError = authenticateCMS(request);
    if (authError) return authError;

    const db = await connectDB();
    if (!db)
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 },
      );
    const { id } = await params;

    const doc = await model.findOneAndDelete({ entryId: id }).lean();
    if (!doc) {
      return NextResponse.json(
        { error: `${resourceName} not found` },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: `${resourceName} deleted` });
  }

  return { GET, PUT, DELETE };
}

/**
 * Sets default SEO fields if not provided.
 */
export function applySEODefaults(
  body: Record<string, unknown>,
  summaryField = "summary",
) {
  if (!body.seoTitle) body.seoTitle = body.title;
  if (!body.seoDescription) body.seoDescription = body[summaryField];
}
