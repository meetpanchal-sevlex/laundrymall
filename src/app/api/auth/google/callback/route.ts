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

      // Medusa V2 strictly decouples Auth from Customers. 
      // We must ensure the Customer record exists for this token.
      const customerRes = await fetch(`${MEDUSA_URL}/store/customers/me`, {
        headers: { "Authorization": `Bearer ${data.token}` }
      });

      if (!customerRes.ok) {
        // Customer doesn't exist yet! Let's create it.
        let customerEmail = "google-user@laundrymall.in";
        try {
          const payload = JSON.parse(Buffer.from(data.token.split('.')[1], 'base64').toString());
          // Medusa auth identity payload usually has app_metadata or email
          if (payload.email) customerEmail = payload.email;
          else if (payload.actor_id) customerEmail = `google-${payload.actor_id}@laundrymall.in`;
        } catch (e) {
          console.error("Failed to parse JWT", e);
        }

        await fetch(`${MEDUSA_URL}/store/customers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${data.token}`
          },
          body: JSON.stringify({ 
            email: customerEmail,
            first_name: "Valued",
            last_name: "Customer"
          }),
        });
      }

      return NextResponse.redirect(new URL("/account", request.url));
    }
  } catch (err: any) {
    console.error("Google Callback Error:", err);
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(err.message || "Google Login Failed")}`, request.url));
  }

  return NextResponse.redirect(new URL("/login?error=Google Login Failed", request.url));
}
