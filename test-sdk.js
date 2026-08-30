import { medusaClient } from "./src/lib/medusa.js";

async function test() {
  console.log(Object.keys(medusaClient.store.cart));
}
test();
