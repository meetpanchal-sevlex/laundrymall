import Medusa from "@medusajs/js-sdk";

// Initialize the Medusa client
// We use the live Railway URL that you just deployed!
export const medusaClient = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://backend-production-a2f6.up.railway.app",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY, // Optional, depending on v2 config
});
