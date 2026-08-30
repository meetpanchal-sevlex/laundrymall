import Medusa from "@medusajs/js-sdk";

const m = new Medusa({
  baseUrl: "https://api.laundrymall.in",
  publishableKey: "pk_bc3432542b3168216839bbb59a558c5b4077cc11fda3ba1c285fd73c4a797c54"
});

async function run() {
  try {
    const { regions } = await m.store.region.list();
    const regionId = regions.find(r => r.currency_code === "inr")?.id || regions[0].id;
    const { cart } = await m.store.cart.create({ region_id: regionId, currency_code: "inr" });
    console.log("Cart created:", cart.id);
    
    const { products } = await m.store.product.list({ limit: 1 });
    const variantId = products[0].variants[0].id;
    await m.store.cart.createLineItem(cart.id, { variant_id: variantId, quantity: 1 });
    
    console.log("Updating address...");
    await m.store.cart.update(cart.id, {
      shipping_address: { first_name: "Test", last_name: "User", address_1: "123 Test St", city: "Testville", country_code: "in" },
      email: "test@example.com"
    });

    console.log("Getting options...");
    const optsRes = await fetch("https://api.laundrymall.in/store/shipping-options?cart_id=" + cart.id, {
      headers: { "x-publishable-api-key": "pk_bc3432542b3168216839bbb59a558c5b4077cc11fda3ba1c285fd73c4a797c54" }
    });
    const opts = await optsRes.json();
    console.log("Options:", opts);

    if (opts.shipping_options?.[0]) {
      console.log("Adding shipping method...");
      const shmRes = await fetch("https://api.laundrymall.in/store/carts/" + cart.id + "/shipping-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-publishable-api-key": "pk_bc3432542b3168216839bbb59a558c5b4077cc11fda3ba1c285fd73c4a797c54" },
        body: JSON.stringify({ option_id: opts.shipping_options[0].id })
      });
      console.log("Shipping Method Add:", shmRes.status, await shmRes.text());
    }

    console.log("Creating payment collection...");
    const pcRes = await fetch("https://api.laundrymall.in/store/payment-collections", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-publishable-api-key": "pk_bc3432542b3168216839bbb59a558c5b4077cc11fda3ba1c285fd73c4a797c54" },
        body: JSON.stringify({ cart_id: cart.id })
    });
    const pcData = await pcRes.json();
    console.log("Payment Collection Create:", pcRes.status, pcData);

    const pcId = pcData.payment_collection?.id;
    if (pcId) {
      console.log("Initializing razorpay session...");
      const sessionRes = await fetch("https://api.laundrymall.in/store/payment-collections/" + pcId + "/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-publishable-api-key": "pk_bc3432542b3168216839bbb59a558c5b4077cc11fda3ba1c285fd73c4a797c54" },
          body: JSON.stringify({ provider_id: "pp_razorpay_razorpay" })
      });
      console.log("Session init:", sessionRes.status, await sessionRes.text());
    }

    console.log("Fetching final cart...");
    const finalCart = await m.store.cart.retrieve(cart.id, { fields: "*payment_collection,*payment_collection.payment_sessions" });
    console.log(JSON.stringify(finalCart, null, 2));

  } catch (e) {
    console.error("Error:", e.message);
  }
}
run();
