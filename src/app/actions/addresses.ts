"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://backend-production-3a66.up.railway.app";
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

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

export async function addAddressAction(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("_medusa_jwt")?.value;
  if (!token) return { error: "Not authenticated" };

  const address = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string || ".", // required by medusa
    address_1: formData.get("address_1") as string,
    address_2: (formData.get("address_2") as string) || "",
    city: formData.get("city") as string,
    province: formData.get("province") as string,
    postal_code: formData.get("postal_code") as string,
    phone: formData.get("phone") as string,
    country_code: "in", // India
  };

  try {
    const res = await fetch(MEDUSA_URL + "/store/customers/me/addresses", {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(address),
    });

    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Failed to add address" };
    }

    revalidatePath("/account/addresses");
    revalidatePath("/checkout");
    return { success: true };
  } catch (error) {
    return { error: "An unexpected error occurred." };
  }
}