"use server";

import { cookies } from "next/headers";
import { unstable_noStore as noStore } from "next/cache";
import { medusaClient } from "@/lib/medusa";
import { getCachedRegions } from "@/lib/medusa-cache";

// IMPORTANT: Only return Authorization token here.
// The Medusa SDK automatically handles Content-Type and x-publishable-api-key
// via its initialization config. Passing them here causes the SDK to inject
// them into the request BODY instead of headers, which Medusa rejects.
const getHeaders = (token?: string): Record<string, string> | undefined => {
  if (token) return { Authorization: "Bearer " + token };
  return undefined;
};

export async function getOrCreateCart() {
  noStore();
  const cookieStore = await cookies();
  const cartId = cookieStore.get("_medusa_cart_id")?.value;
  const token = cookieStore.get("_medusa_jwt")?.value;
  const headers = getHeaders(token);

  if (cartId) {
    try {
      const { cart } = await medusaClient.store.cart.retrieve(cartId, {
        fields: "*items,*items.variant,*items.variant.product,*shipping_address,*billing_address,*payment_collection,*payment_collection.payment_sessions"
      }, headers);
      
      // CRITICAL FAILSAFE: If Medusa says this cart is already completed, throw it away!
      if (cart.completed_at) {
        throw new Error("Cart is already completed");
      }
      
      return cart;
    } catch (e) {
      // Cart not found or expired or completed
      cookieStore.set("_medusa_cart_id", "", { maxAge: 0, path: "/" });
    }
  }

  // Use cached regions
  const regions = await getCachedRegions();
  const indiaRegion = regions.find((r: any) => r.currency_code === "inr") || regions[0];

  // If user is logged in, grab their customer ID so the order links to their account
  let customerId = undefined;
  let customerEmail = undefined;
  if (token) {
    try {
      const custRes: any = await medusaClient.client.fetch("/store/customers/me", { method: "GET", headers });
      if (custRes.customer) {
        customerId = custRes.customer.id;
        customerEmail = custRes.customer.email;
      }
    } catch (e) {
      console.error("Failed to link customer to new cart:", e);
    }
  }

  const { cart } = await medusaClient.store.cart.create({
    region_id: indiaRegion.id,
    currency_code: "inr",
    customer_id: customerId,
    email: customerEmail
  }, {}, headers);

  cookieStore.set("_medusa_cart_id", cart.id, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/", 
  });

  return cart;
}

export async function addToCartAction(variantId: string, quantity: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get("_medusa_jwt")?.value;
  const headers = getHeaders(token);
  let cart = await getOrCreateCart();
  
  try {
    await medusaClient.store.cart.createLineItem(cart.id, {
      variant_id: variantId,
      quantity
    }, {}, headers);
  } catch (error: any) {
    console.error("First add attempt failed, cart might be locked. Auto-healing...", error.message);
    
    // Shred the stuck cookie
    cookieStore.set("_medusa_cart_id", "", { maxAge: 0, path: "/" });
    
    // Force generate a brand new cart
    // Use cached regions here too
    const regions = await getCachedRegions();
    const indiaRegion = regions.find((r: any) => r.currency_code === "inr") || regions[0];
    const { cart: newCart } = await medusaClient.store.cart.create({
      region_id: indiaRegion.id,
      currency_code: "inr"
    }, {}, headers);
    
    cookieStore.set("_medusa_cart_id", newCart.id, {
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    
    // Retry adding to the fresh cart
    await medusaClient.store.cart.createLineItem(newCart.id, {
      variant_id: variantId,
      quantity
    }, {}, headers);
    
    cart = newCart;
  }
  
  // Fetch fully populated cart to return to UI
  const { cart: finalCart } = await medusaClient.store.cart.retrieve(cart.id, {
    fields: "*items,*items.variant,*items.variant.product,*shipping_address,*billing_address,*payment_collection,*payment_collection.payment_sessions"
  }, headers);
  
  return finalCart;
}

export async function updateCartItemAction(lineId: string, quantity: number) {
  const token = (await cookies()).get("_medusa_jwt")?.value;
  const headers = getHeaders(token);
  const cart = await getOrCreateCart();
  
  await medusaClient.store.cart.updateLineItem(cart.id, lineId, { quantity }, {}, headers);
  
  return await getOrCreateCart();
}

export async function removeCartItemAction(lineId: string) {
  const token = (await cookies()).get("_medusa_jwt")?.value;
  const headers = getHeaders(token);
  const cart = await getOrCreateCart();
  
  await medusaClient.store.cart.deleteLineItem(cart.id, lineId, {}, headers);
  
  return await getOrCreateCart();
}

export async function clearCartAction() {
  const cookieStore = await cookies();
  cookieStore.delete("_medusa_cart_id");
}

// Nuclear reset: clears cookie AND forces a brand new cart on next load
export async function forceNewCartAction() {
  const cookieStore = await cookies();
  cookieStore.delete("_medusa_cart_id");
  // Immediately create a fresh cart so the next getOrCreateCart() call doesn't reuse old one
  return await getOrCreateCart();
}

export async function prepareCheckoutAction(shippingAddress: any, email: string) {
  noStore();
  try {
    const token = (await cookies()).get("_medusa_jwt")?.value;
    const headers = getHeaders(token);
    let cart = await getOrCreateCart();
    
    // 1. Update shipping address on the cart
    await medusaClient.store.cart.update(cart.id, {
      shipping_address: shippingAddress,
      email: email
    }, {}, headers);

    // 2. Add shipping method if one exists
    const optionsData = await medusaClient.client.fetch(`/store/shipping-options?cart_id=${cart.id}`, { headers }) as any;
    const method = optionsData.shipping_options?.[0];
    const hasShippingMethod = cart.shipping_methods && cart.shipping_methods.length > 0;
    
    if (method && !hasShippingMethod) {
      await medusaClient.store.cart.addShippingMethod(cart.id, { option_id: method.id }, {}, headers);
    }

    // 3. Refresh cart — check if it already has a locked payment collection
    cart = await getOrCreateCart();
    const existingSession = cart.payment_collection?.payment_sessions?.find(
      (s: any) => s.provider_id === "razorpay" || s.provider_id === "pp_razorpay_razorpay"
    );

    // Only create a new session if one doesn't already exist
    if (!existingSession) {
      // NOTE: Do NOT pass custom headers — SDK handles auth via publishableKey at init
      await medusaClient.store.payment.initiatePaymentSession(cart, {
        provider_id: "pp_razorpay_razorpay"
      }, {}, {});
    }

    const finalCart = await getOrCreateCart();
    const session = finalCart.payment_collection?.payment_sessions?.find(
      (s: any) => s.provider_id === "razorpay" || s.provider_id === "pp_razorpay_razorpay"
    );

    if (!session) {
      console.error("Payment session missing. Full payment_collection:", JSON.stringify(finalCart.payment_collection));
      throw new Error("Razorpay payment session was not created. Please check the Medusa payment provider configuration.");
    }

    const orderId = session?.data?.id || session?.data?.order_id || session?.id;
    const keyId = session?.data?.key_id || "";

    return { 
      success: true, 
      paymentCollection: finalCart.payment_collection,
      razorpayOrderId: orderId,
      keyId: keyId 
    };
  } catch (error: any) {
    console.error("Prepare checkout error:", error);
    return { error: error.message || "An unexpected error occurred" };
  }
}

export async function prepareCODCheckoutAction(shippingAddress: any, email: string) {
  noStore();
  try {
    const token = (await cookies()).get("_medusa_jwt")?.value;
    const headers = getHeaders(token);
    let cart = await getOrCreateCart();
    
    await medusaClient.store.cart.update(cart.id, {
      shipping_address: shippingAddress,
      email: email
    }, {}, headers);

    const optionsData = await medusaClient.client.fetch(`/store/shipping-options?cart_id=${cart.id}`, { headers }) as any;
    const method = optionsData.shipping_options?.[0];
    const hasShippingMethod = cart.shipping_methods && cart.shipping_methods.length > 0;
    
    if (method && !hasShippingMethod) {
      await medusaClient.store.cart.addShippingMethod(cart.id, { option_id: method.id }, {}, headers);
    }

    cart = await getOrCreateCart();

    await medusaClient.store.payment.initiatePaymentSession(cart, {
      provider_id: "manual"
    }, {}, {});

    return { success: true };
  } catch (error: any) {
    console.error("Prepare COD checkout error:", error);
    return { error: error.message || "An unexpected error occurred" };
  }
}

export async function completeCartAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("_medusa_jwt")?.value;
  const headers = getHeaders(token);
  const cart = await getOrCreateCart();

  try {
    const res = await medusaClient.store.cart.complete(cart.id, {}, headers);
    // Explicitly delete the completed cart cookie so the next shopping session starts fresh
    // CRITICAL FIX: Must specify path: "/" to match where it was created, or it won't delete!
    cookieStore.set("_medusa_cart_id", "", { maxAge: 0, path: "/" });
    
    // Only return plain serializable data to avoid React Error #441
    return { success: true, type: res.type };
  } catch (e: any) {
    console.error("Complete cart error:", e.response?.data || e.message);
    return { error: e.response?.data?.message || e.message || "Failed to complete checkout" };
  }
}


export async function getCustomerOrdersAction() {
  noStore();
  try {
    const token = (await cookies()).get("_medusa_jwt")?.value;
    if (!token) return { orders: [] };
    const headers = getHeaders(token);
    const res: any = await medusaClient.client.fetch(`/store/orders`, {
      method: "GET",
      query: { fields: "id,display_id,created_at,total,*items,*items.variant,*shipping_address,*summary,*payment_collections,*fulfillments,fulfillment_status,payment_status,status" },
      headers
    });
    return { orders: res.orders || [] };
  } catch (error: any) {
    console.error("Orders fetch failed:", error);
    return { orders: [] };
  }
}

export async function initiatePaymentSessionsAction() {
  try {
    const token = (await cookies()).get("_medusa_jwt")?.value;
    const headers = getHeaders(token);
    const cart = await getOrCreateCart();
    const res = await medusaClient.client.fetch(`/store/payment-collections`, {
      method: "POST",
      headers,
      body: { cart_id: cart.id }
    });
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function setShippingAddressAction(address: any, email: string) {
  try {
    const token = (await cookies()).get("_medusa_jwt")?.value;
    const headers = getHeaders(token);
    const cart = await getOrCreateCart();
    await medusaClient.store.cart.update(cart.id, {
      shipping_address: address,
      email: email
    }, {}, headers);
    return await getOrCreateCart();
  } catch (e: any) {
    return { error: e.message };
  }
}
