import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { authenticateCMS } from "@/lib/cms/auth";

export async function POST(request: NextRequest) {
  const authError = authenticateCMS(request);
  if (authError) return authError;

  const body = await request.json();
  const paths: string[] = body.paths;

  if (!paths || !Array.isArray(paths) || paths.length === 0) {
    return NextResponse.json(
      { error: "paths array is required" },
      { status: 400 },
    );
  }

  const revalidated: string[] = [];
  for (const path of paths) {
    revalidatePath(path);
    revalidated.push(path);
  }

  return NextResponse.json({
    message: "Revalidation triggered",
    revalidated,
  });
}
