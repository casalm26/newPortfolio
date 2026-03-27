import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");
  const expectedKey = process.env.CMS_API_KEY;

  if (!expectedKey) {
    return NextResponse.json(
      { error: "CMS API key not configured" },
      { status: 500 },
    );
  }

  if (!apiKey || apiKey !== expectedKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/cms/:path*",
};
