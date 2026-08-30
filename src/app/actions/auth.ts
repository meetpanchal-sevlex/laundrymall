"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://backend-production-3a66.up.railway.app";
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

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
    const res = await fetch(MEDUSA_URL + "/store/customers/me?fields=*addresses", {
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
