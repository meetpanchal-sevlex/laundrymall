"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { medusaClient } from "@/lib/medusa";
import crypto from "crypto";

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://api.laundrymall.in";
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";
const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY || "566554AFhqTDveEa6aa123eaP1";

// Phase 0: Enterprise Hardening - Zod Schemas
const LoginSchema = z.object({
  email: z.string().email("Please provide a valid email address").toLowerCase().trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const SignupSchema = z.object({
  first_name: z.string().min(1, "First name is required").trim(),
  last_name: z.string().min(1, "Last name is required").trim(),
  email: z.string().email("Please provide a valid email address").toLowerCase().trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (PUBLISHABLE_KEY) {
    headers["x-publishable-api-key"] = PUBLISHABLE_KEY;
  }
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }
  return headers;
};

export async function loginAction(formData: FormData) {
  // 1. Zod Validation
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { email, password } = parsed.data;

  try {
    const res = await fetch(MEDUSA_URL + "/auth/customer/emailpass", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Invalid email or password" };
    }

    const data = await res.json();
    if (data.token) {
      const cookieStore = await cookies();
      cookieStore.set("_medusa_jwt", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      // MAGIC LINK: Attach any existing guest cart to this newly logged-in customer
      try {
        const cartId = cookieStore.get("_medusa_cart_id")?.value;
        if (cartId) {
          const headers = getHeaders(data.token);
          const custRes = await fetch(MEDUSA_URL + "/store/customers/me", {
            method: "GET",
            headers,
          });
          if (custRes.ok) {
            const custData = await custRes.json();
            const customer = custData.customer;
            if (customer && customer.id) {
              await medusaClient.store.cart.update(cartId, { customer_id: customer.id }, headers);
            }
          }
        }
      } catch (linkError) {
        console.error("Failed to link cart to customer during login:", linkError);
      }

      return { success: true };
    } else {
      return { error: "Authentication failed. No token received." };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { error: "An unexpected error occurred during login." };
  }
}

export async function signupAction(formData: FormData) {
  // 1. Zod Validation
  const parsed = SignupSchema.safeParse({
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { email, password, first_name, last_name } = parsed.data;

  try {
    const authRes = await fetch(MEDUSA_URL + "/auth/customer/emailpass/register", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    if (!authRes.ok) {
      const error = await authRes.json();
      return { error: error.message || "Failed to register authentication identity" };
    }

    const authData = await authRes.json();
    const token = authData.token;

    if (!token) {
      return { error: "Failed to obtain authentication token during signup." };
    }

    const cookieStore = await cookies();
    cookieStore.set("_medusa_jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    const customerRes = await fetch(MEDUSA_URL + "/store/customers", {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify({ email, first_name, last_name }),
    });

    if (!customerRes.ok) {
      const error = await customerRes.json();
      console.error("Customer creation error:", error);
      return { success: true, message: "Account created but profile setup incomplete." };
    }

    // MAGIC LINK: Attach any existing guest cart to this newly created customer account
    try {
      const cartId = cookieStore.get("_medusa_cart_id")?.value;
      if (cartId) {
        const headers = getHeaders(token);
        const custRes = await fetch(MEDUSA_URL + "/store/customers/me", {
          method: "GET",
          headers,
        });
        if (custRes.ok) {
          const custData = await custRes.json();
          const customer = custData.customer;
          if (customer && customer.id) {
            await medusaClient.store.cart.update(cartId, { customer_id: customer.id }, headers);
          }
        }
      }
    } catch (linkError) {
      console.error("Failed to link cart to customer during signup:", linkError);
    }

    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "An unexpected error occurred during signup." };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("_medusa_jwt");
  redirect("/");
}

export async function getCustomer() {
  const cookieStore = await cookies();
  const token = cookieStore.get("_medusa_jwt")?.value;
  if (!token) return null;

  try {
    const res = await fetch(MEDUSA_URL + "/store/customers/me", {
      method: "GET",
      headers: getHeaders(token),
      next: { revalidate: 0 }
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.customer;
  } catch (error) {
    return null;
  }
}

export async function getGoogleAuthUrl() {
  try {
    const res = await fetch(MEDUSA_URL + "/auth/customer/google", {
      method: "GET",
      headers: {
        "Accept": "application/json"
      },
      cache: "no-store"
    });
    if (res.ok) {
      const data = await res.json();
      return { location: data.location };
    }
    return { error: "Failed to fetch auth URL" };
  } catch (error) {
    return { error: "Network error" };
  }
}

export async function verifyMsg91PhoneLoginAction(accessToken: string, clientPhone?: string) {
  if (!accessToken) {
    return { error: "Verification token is required." };
  }

  try {
    // 1. Dual-Verification against MSG91 Gateway
    const msg91Res = await fetch("https://control.msg91.com/api/v5/widget/verifyAccessToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authkey": MSG91_AUTH_KEY,
      },
      body: JSON.stringify({
        "authkey": MSG91_AUTH_KEY,
        "access-token": accessToken,
      }),
    });

    const msg91Data = await msg91Res.json();
    if (!msg91Res.ok || msg91Data.type === "error") {
      console.error("MSG91 token verification rejected:", msg91Data);
      return { error: msg91Data.message || "Invalid or expired OTP token. Please try again." };
    }

    // 2. Extract verified identifier
    const verifiedIdentifier =
      msg91Data?.data?.mobile ||
      msg91Data?.mobile ||
      msg91Data?.identifier ||
      clientPhone ||
      "";

    let cleanPhone = String(verifiedIdentifier).replace(/\D/g, "");
    if (cleanPhone.length === 12 && cleanPhone.startsWith("91")) {
      cleanPhone = cleanPhone.slice(2);
    }

    if (!cleanPhone || cleanPhone.length < 10) {
      return { error: "Could not retrieve verified phone number from authentication service." };
    }

    // 3. Deterministic Medusa 2.0 Identity Mapping
    const syntheticEmail = `${cleanPhone}@phone.laundrymall.in`;
    const secretSalt = process.env.MEDUSA_ADMIN_API_KEY || MSG91_AUTH_KEY || "laundrymall-secret-2026";
    const deterministicPassword =
      crypto.createHmac("sha256", secretSalt).update(cleanPhone).digest("hex").slice(0, 24) + "Aa1!";

    let token: string | null = null;
    let isNewCustomer = false;

    // 4. Attempt login with phone credentials
    const loginRes = await fetch(MEDUSA_URL + "/auth/customer/emailpass", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email: syntheticEmail, password: deterministicPassword }),
    });

    if (loginRes.ok) {
      const loginData = await loginRes.json();
      token = loginData.token;
    } else {
      // If customer doesn't exist yet, register new auth identity
      const registerRes = await fetch(MEDUSA_URL + "/auth/customer/emailpass/register", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email: syntheticEmail, password: deterministicPassword }),
      });

      if (!registerRes.ok) {
        const regErr = await registerRes.json().catch(() => ({}));
        return { error: regErr.message || "Failed to create account for this phone number." };
      }

      const registerData = await registerRes.json();
      token = registerData.token;
      isNewCustomer = true;

      // Create store customer profile
      if (token) {
        try {
          await fetch(MEDUSA_URL + "/store/customers", {
            method: "POST",
            headers: getHeaders(token),
            body: JSON.stringify({
              email: syntheticEmail,
              phone: cleanPhone,
              first_name: "Customer",
              last_name: cleanPhone.slice(-4),
            }),
          });
        } catch (profileError) {
          console.error("Non-fatal: failed to set customer profile details:", profileError);
        }
      }
    }

    if (!token) {
      return { error: "Authentication failed. No session token generated." };
    }

    // 5. Establish session cookie
    const cookieStore = await cookies();
    cookieStore.set("_medusa_jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    // 6. Magic Link: Attach existing guest cart to authenticated user
    try {
      const cartId = cookieStore.get("_medusa_cart_id")?.value;
      if (cartId) {
        const headers = getHeaders(token);
        const custRes = await fetch(MEDUSA_URL + "/store/customers/me", {
          method: "GET",
          headers,
        });
        if (custRes.ok) {
          const custData = await custRes.json();
          const customer = custData.customer;
          if (customer && customer.id) {
            await medusaClient.store.cart.update(cartId, { customer_id: customer.id }, headers);
          }
        }
      }
    } catch (linkError) {
      console.error("Non-fatal: failed to link cart to customer during phone login:", linkError);
    }

    return {
      success: true,
      phone: cleanPhone,
      email: syntheticEmail,
      isNewCustomer,
    };
  } catch (error) {
    console.error("verifyMsg91PhoneLoginAction error:", error);
    return { error: "An unexpected error occurred during phone OTP verification." };
  }
}

