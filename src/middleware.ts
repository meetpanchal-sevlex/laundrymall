import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Only run the rate limiter if the environment variables are present
// This prevents the app from crashing locally if you forget to add them
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = redisUrl && redisToken ? new Redis({
  url: redisUrl,
  token: redisToken,
}) : null;

// Create a new ratelimiter, that allows 20 requests per 10 seconds per IP address
const ratelimit = redis ? new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(20, "10 s"),
  analytics: true,
}) : null;

export async function middleware(request: NextRequest) {
  // --- ROUTE PROTECTION (The Bouncer) ---
  const token = request.cookies.get("_medusa_jwt")?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/signup");
  const isAccountPage = request.nextUrl.pathname.startsWith("/account");

  if (isAccountPage && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  // --- RATE LIMITING ---
  // We only want to rate limit POST/PUT/DELETE requests (like Server Actions or Checkout).
  // Normal GET requests for page views should be fast and unrestricted since Vercel caches them.
  if (request.method === "GET") {
    return NextResponse.next();
  }

  // If Upstash isn't configured (like in local dev), just bypass
  if (!ratelimit) {
    return NextResponse.next();
  }

  // Get the IP address of the user making the request
  const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "127.0.0.1";

  try {
    const { success, pending, limit, reset, remaining } = await ratelimit.limit(ip);
    
    // If they exceeded 20 requests in 10 seconds, block them
    if (!success) {
      console.warn(`🚨 Rate Limit Exceeded for IP: ${ip}`);
      return new NextResponse("Too Many Requests. Please slow down.", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        }
      });
    }

    // Otherwise, let the request through
    const res = NextResponse.next();
    res.headers.set("X-RateLimit-Limit", limit.toString());
    res.headers.set("X-RateLimit-Remaining", remaining.toString());
    res.headers.set("X-RateLimit-Reset", reset.toString());
    
    return res;
  } catch (error) {
    // If Redis fails for some reason, fail open (let the user through so we don't block real customers)
    console.error("Redis Rate Limiter Error:", error);
    return NextResponse.next();
  }
}

// Run middleware on all paths, but we filter by HTTP method inside the function
export const config = {
  matcher: "/(.*)",
};
