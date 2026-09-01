import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Upstash Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// Create a rate limiter: 5 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
});

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("_medusa_jwt")?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/signup");
  const isAccountPage = request.nextUrl.pathname.startsWith("/account");

  // --- RATE LIMITING (Brute Force Protection) ---
  // Only apply to POST requests on auth pages (when someone submits the login/signup form)
  if (request.method === "POST" && isAuthPage) {
    // Get IP address (fallback for local development)
    const ip = request.ip ?? request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    
    try {
      const { success } = await ratelimit.limit(`ratelimit_auth_${ip}`);
      if (!success) {
        // Block the request instantly at the Edge
        return NextResponse.json(
          { error: "Too many login attempts. Please try again in a minute." },
          { status: 429 }
        );
      }
    } catch (e) {
      // If Upstash fails for some reason, we allow the request so users aren't locked out
      console.error("Rate limiter error:", e);
    }
  }

  // --- ROUTE PROTECTION (The Bouncer) ---
  if (isAccountPage && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"
  ],
};
