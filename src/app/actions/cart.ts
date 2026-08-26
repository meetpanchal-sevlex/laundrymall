"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

const MEDUSA_URL = (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://api.laundrymall.in").replace(/\/$/, "");
const PK = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

const getHeaders = (token?: string) => {
  const h: any = { "Content-Type": "application/json" };
  if (PK) h["x-publishable-api-key"] = PK;
  if (token) h["Authorization"] = "Bearer " + token;
  return h;
};

async function safeJson(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON. Response:", text);
    throw new Error(`Failed at ${res.url}: ${text.substring(0, 80)}...`);
  }
}

export async function getOrCreateCart() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("_medusa_cart_id")?.value;
  const token = cookieStore.get("_medusa_jwt")?.value;

  if (cartId) {
    const res = await fetch(`${MEDUSA_URL}/store/carts/${cartId}?fields=*items,*items.variant,*items.variant.product,*shipping_address,*billing_address,*payment_collection,*payment_collection.payment_sessions`, {
      headers: getHeaders(token)
    });
    if (res.ok) {
      const data = await safeJson(res);
      return data.cart;
    }
    cookieStore.delete("_medusa_cart_id");
  }

  // Get regions
  const regRes = await fetch(`${MEDUSA_URL}/store/regions`, { headers: getHeaders() });
  const regData = await safeJson(regRes);
  const indiaRegion = regData.regions.find((r: any) => r.currency_code === "inr") || regData.regions[0];

  let customerId = undefined;
  if (token) {
    const cRes = await fetch(`${MEDUSA_URL}/store/customers/me`, { headers: getHeaders(token) });
    if (cRes.ok) {
      const cData = await safeJson(cRes);
      customerId = cData.customer.id;
    }
  }


  const createRes = await fetch(`${MEDUSA_URL}/store/carts`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({
      region_id: indiaRegion.id,
      customer_id: customerId,
      currency_code: "inr"
    })
  });
  const createData = await safeJson(createRes);
  if (!createRes.ok) {
    throw new Error(createData.message || "Failed to create Medusa Cart");
  }
  const cart = createData.cart;

  cookieStore.set("_medusa_cart_id", cart.id, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return cart;
}

export async function addToCartAction(variantId: string, quantity: number) {
  const cart = await getOrCreateCart();
  const token = (await cookies()).get("_medusa_jwt")?.value;
  
  await fetch(`${MEDUSA_URL}/store/carts/${cart.id}/line-items`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({ variant_id: variantId, quantity })
  });
  
  return await getOrCreateCart();
}

export async function updateCartItemAction(lineId: string, quantity: number) {
  const cart = await getOrCreateCart();
  const token = (await cookies()).get("_medusa_jwt")?.value;
  
  await fetch(`${MEDUSA_URL}/store/carts/${cart.id}/line-items/${lineId}`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({ quantity })
  });
  
  return await getOrCreateCart();
}

export async function removeCartItemAction(lineId: string) {
  const cart = await getOrCreateCart();
  const token = (await cookies()).get("_medusa_jwt")?.value;
  
  await fetch(`${MEDUSA_URL}/store/carts/${cart.id}/line-items/${lineId}`, {
    method: "DELETE",
    headers: getHeaders(token)
  });
  
  return await getOrCreateCart();
}

export async function clearCartAction() {
  const cookieStore = await cookies();
  cookieStore.delete("_medusa_cart_id");
}

export async function setShippingAddressAction(address: any, email: string) { try {
  const cart = await getOrCreateCart();
  const token = (await cookies()).get("_medusa_jwt")?.value;
  
  const res = await fetch(`${MEDUSA_URL}/store/carts/${cart.id}`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({
      shipping_address: address,
      email: email
    })
  });
  const data = await safeJson(res);
  return data.cart;
} catch(e:any) { return { error: e.message }; }
}

export async function initiatePaymentSessionsAction() {
  try {
    const cart = await getOrCreateCart();
    const token = (await cookies()).get("_medusa_jwt")?.value;
    
    // Create Payment Collection (Medusa 2.0 flow)
    const pcRes = await fetch(`${MEDUSA_URL}/store/payment-collections`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify({ cart_id: cart.id })
    });
    const pcData = await safeJson(pcRes);
    
    if (!pcRes.ok) {
      return { error: pcData.message || "Failed to create payment collection" };
    }
    
    const paymentCollection = pcData.payment_collection;
    
    // Init session
    const sessRes = await fetch(`${MEDUSA_URL}/store/payment-collections/${paymentCollection.id}/payment-sessions`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify({ provider_id: "razorpay" })
    });
    
    if (!sessRes.ok) {
       const errorData = await safeJson(sessRes);
       return { error: errorData.message || "Failed to initialize Razorpay session" };
    }
    
    const sessData = await safeJson(sessRes);
    const session = sessData.payment_collection?.payment_sessions?.[0] || sessData.payment_session;
    return { cart: await getOrCreateCart(), payment_session: session };
  } catch (e: any) {
    return { error: e.message || "Unknown server error" };
  }
}

export async function completeCartAction() {
  const cart = await getOrCreateCart();
  const token = (await cookies()).get("_medusa_jwt")?.value;
  
  const res = await fetch(`${MEDUSA_URL}/store/carts/${cart.id}/complete`, {
    method: "POST",
    headers: getHeaders(token)
  });
  
  if (!res.ok) {
     const errorText = await res.text();
     throw new Error("Failed to complete cart: " + errorText);
  }
  
  const data = await safeJson(res);
  const cookieStore = await cookies();
  cookieStore.delete("_medusa_cart_id");
  
  return data;
}




