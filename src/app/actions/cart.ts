"use server";

import { cookies } from "next/headers";
import { unstable_noStore as noStore } from "next/cache";
import { medusaClient } from "@/lib/medusa";

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
      return cart;
    } catch (e) {
      // Cart not found or expired
      cookieStore.delete("_medusa_cart_id");
    }
  }

  // Get regions
  const { regions } = await medusaClient.store.region.list({}, headers) as any;
  const indiaRegion = regions.find((r: any) => r.currency_code === "inr") || regions[0];

  const { cart } = await medusaClient.store.cart.create({
    region_id: indiaRegion.id,
    currency_code: "inr"
  }, headers);

  cookieStore.set("_medusa_cart_id", cart.id, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return cart;
}

// Self-healing: If a cart is locked (e.g. by a payment collection), we duplicate it into a fresh unlocked cart.
async function duplicateCart(oldCartId: string, token?: string, excludeLineId?: string) {
  const headers = getHeaders(token);
  
  let oldCart;
  try {
    const res = await medusaClient.store.cart.retrieve(oldCartId, { fields: "*items,*items.variant" }, headers);
    oldCart = res.cart;
  } catch (e) {
    return await getOrCreateCart();
  }

  const cookieStore = await cookies();
  cookieStore.delete("_medusa_cart_id");
  const newCart = await getOrCreateCart(); // Creates a fresh cart

  // Copy items over, excluding the one they tried to delete
  if (oldCart.items && oldCart.items.length > 0) {
    for (const item of oldCart.items) {
      if (excludeLineId && item.id === excludeLineId) continue;
      await medusaClient.store.cart.createLineItem(newCart.id, {
        variant_id: item.variant_id,
        quantity: item.quantity
      }, {}, headers);
    }
  }

  // Preserve email and shipping address so the user doesn't lose progress
  if (oldCart.email || oldCart.shipping_address) {
    const updateBody: any = {};
    if (oldCart.email) updateBody.email = oldCart.email;
    if (oldCart.shipping_address) {
      updateBody.shipping_address = {
        first_name: oldCart.shipping_address.first_name,
        last_name: oldCart.shipping_address.last_name,
        address_1: oldCart.shipping_address.address_1,
        address_2: oldCart.shipping_address.address_2,
        city: oldCart.shipping_address.city,
        province: oldCart.shipping_address.province,
        postal_code: oldCart.shipping_address.postal_code,
        country_code: oldCart.shipping_address.country_code,
        phone: oldCart.shipping_address.phone
      };
    }
    await medusaClient.store.cart.update(newCart.id, updateBody, {}, headers);
  }

  return await getOrCreateCart(); // Fetch final state
}

export async function addToCartAction(variantId: string, quantity: number) {
  let cart = await getOrCreateCart();
  const token = (await cookies()).get("_medusa_jwt")?.value;
  const headers = getHeaders(token);
  
  try {
    await medusaClient.store.cart.createLineItem(cart.id, {
      variant_id: variantId,
      quantity
    }, {}, headers);
  } catch (e: any) {
    if (e.response?.status === 400) {
      cart = await duplicateCart(cart.id, token);
      await medusaClient.store.cart.createLineItem(cart.id, {
        variant_id: variantId,
        quantity
      }, {}, headers);
      return await getOrCreateCart();
    }
    throw e;
  }
  
  return await getOrCreateCart();
}

export async function updateCartItemAction(lineId: string, quantity: number) {
  let cart = await getOrCreateCart();
  const token = (await cookies()).get("_medusa_jwt")?.value;
  const headers = getHeaders(token);
  
  try {
    await medusaClient.store.cart.updateLineItem(cart.id, lineId, { quantity }, {}, headers);
  } catch (e: any) {
    if (e.response?.status === 400) {
      // Find the variantId for this lineId so we can update it during duplication
      const itemToUpdate = cart.items?.find((i: any) => i.id === lineId);
      if (!itemToUpdate) throw e;
      
      // Duplicate cart, EXCLUDING the old item to avoid copying the old quantity
      const newCart = await duplicateCart(cart.id, token, lineId);
      
      // Re-add the item to the new cart with the NEW quantity
      await medusaClient.store.cart.createLineItem(newCart.id, {
        variant_id: itemToUpdate.variant_id,
        quantity: quantity
      }, {}, headers);
      
      return await getOrCreateCart();
    }
    throw e;
  }
  
  return await getOrCreateCart();
}

export async function removeCartItemAction(lineId: string) {
  let cart = await getOrCreateCart();
  const token = (await cookies()).get("_medusa_jwt")?.value;
  const headers = getHeaders(token);
  
  try {
    await medusaClient.store.cart.deleteLineItem(cart.id, lineId, {}, headers);
  } catch (e: any) {
    console.error("SDK Delete Line Item Error:", e.response?.status, e.message);
    if (e.response?.status === 400) {
      return await duplicateCart(cart.id, token, lineId);
    }
    throw e;
  }
  
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
    if (method) {
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
    if (method) {
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
  const token = (await cookies()).get("_medusa_jwt")?.value;
  const headers = getHeaders(token);
  const cart = await getOrCreateCart();

  try {
    const res = await medusaClient.store.cart.complete(cart.id, {}, headers);
    return res;
  } catch (e: any) {
    console.error("Complete cart error:", e);
    throw new Error(e.message || "Failed to complete checkout");
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
      query: { fields: "*items,*items.variant,*shipping_address,*summary,*payment_collections" },
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
