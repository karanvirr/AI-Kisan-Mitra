import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

// Allow running locally without valid Clerk keys by setting DISABLE_CLERK=true
// or when Clerk initialization fails. In that case the middleware becomes a
// no-op and requests continue as normal.
let clerkMw: ((req: NextRequest) => any) | null = null;
try {
  if (process.env.DISABLE_CLERK === "true") {
    clerkMw = null;
  } else {
    clerkMw = clerkMiddleware();
  }
} catch (err) {
  clerkMw = null;
}

export default function middleware(req: NextRequest) {
  if (clerkMw) {
    return clerkMw(req as any);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
