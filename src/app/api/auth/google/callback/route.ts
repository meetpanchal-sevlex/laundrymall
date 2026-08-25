import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return NextResponse.redirect(new URL("/login?error=Invalid Google Auth", request.url));
  }

  try {
    const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://backend-production-3a66.up.railway.app";
    const res = await fetch(`${MEDUSA_URL}/auth/customer/google/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, state }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Medusa Error: ${res.status} ${errText}`);
    }

    const data = await res.json();
    if (data.token) {
      const cookieStore = await cookies();
      cookieStore.set("_medusa_jwt", data.token, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";
      
      const storeHeaders: Record<string, string> = {
        "Authorization": `Bearer ${data.token}`,
        "Content-Type": "application/json"
      };
      
      if (PUBLISHABLE_KEY) {
        storeHeaders["x-publishable-api-key"] = PUBLISHABLE_KEY;
      }

      // Check if customer exists via standard /me endpoint
      const customerRes = await fetch(`${MEDUSA_URL}/store/customers/me`, {
        headers: storeHeaders
      });

      if (!customerRes.ok) {
        // Customer doesn't exist yet! Let's orchestrate the microservices.
        // Call our new custom backend endpoint that syncs the Auth Identity with the Customer Module!
        const syncRes = await fetch(`${MEDUSA_URL}/store/customers/sync`, {
          method: "POST",
          headers: storeHeaders,
        });
        
        if (!syncRes.ok) {
           const errText = await syncRes.text();
           console.error("Failed to sync Google profile:", errText);
           return NextResponse.redirect(new URL(`/login?error=Profile Sync Failed: ${syncRes.status}`, request.url));
        }
      }

      return NextResponse.redirect(new URL("/account", request.url));
    }
  } catch (err: any) {
    console.error("Google Callback Error:", err);
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(err.message || "Google Login Failed")}`, request.url));
  }

  return NextResponse.redirect(new URL("/login?error=Google Login Failed", request.url));
}
