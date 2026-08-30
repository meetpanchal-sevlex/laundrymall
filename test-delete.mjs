import Medusa from "@medusajs/js-sdk";

const m = new Medusa({publishableKey:'pk_bc3432542b3168216839bbb59a558c5b4077cc11fda3ba1c285fd73c4a797c54', baseUrl: "https://api.laundrymall.in"});

async function run() {
  try {
    const { cart } = await m.store.cart.create({ region_id: "reg_01M0DPY0E8TCM4TDFXXB4V3N1J", currency_code: "inr" });
    console.log("Cart created:", cart.id);
    
    console.log("Adding item...");
    const added = await m.store.cart.createLineItem(cart.id, { variant_id: "variant_01M0DPY8N95Z26JFFHNKHZYWKT", quantity: 1 });
    console.log("Added item. Line items:", added.cart.items.length);
    const lineId = added.cart.items[0].id;
    console.log("Line ID:", lineId);

    console.log("Deleting item...");
    const deleted = await m.store.cart.deleteLineItem(cart.id, lineId, {}, {});
    console.log("Delete response:", deleted);
  } catch (e) {
    console.error("Error:", e.message);
    if (e.response) console.error(e.response.status, e.response.statusText);
  }
}
run();
