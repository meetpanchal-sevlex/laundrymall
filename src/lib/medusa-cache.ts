import { medusaClient } from "./medusa";
import { unstable_cache } from "next/cache";
import { MedusaProduct, MedusaCollection, MedusaRegion } from "@/types/medusa";
import { Product } from "@/data/products";

// Adapter to convert Medusa API product to our frontend format
function adaptProduct(medusaProduct: MedusaProduct, collections: MedusaCollection[]): Product {
  const price = medusaProduct.variants?.[0]?.calculated_price?.calculated_amount || 0;
  const collection = collections.find(c => c.id === medusaProduct.collection_id);
  
  return {
    id: medusaProduct.id,
    variantId: medusaProduct.variants?.[0]?.id || "",
    name: medusaProduct.title,
    category: collection?.title || "Uncategorized",
    price: price, 
    image: medusaProduct.thumbnail || "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=600&auto=format&fit=crop",
    description: medusaProduct.description || "Laundry Mall Product",
  };
}

// Fetch and adapt products securely
export const getCachedFrontendProducts = unstable_cache(
  async (): Promise<Product[]> => {
    try {
      const { regions } = await medusaClient.store.region.list() as { regions: MedusaRegion[] };
      const indiaRegion = regions.find((r) => r.currency_code === "inr") || regions[0];

      if (!indiaRegion) return [];

      const { products } = await medusaClient.store.product.list({ 
        limit: 200,
        region_id: indiaRegion.id 
      }) as { products: MedusaProduct[] };
      
      const { collections } = await medusaClient.store.collection.list() as { collections: MedusaCollection[] };

      return products.map((p) => adaptProduct(p, collections));
    } catch (error) {
      console.error("Failed to fetch products from Medusa:", error);
      return []; // Return empty array instead of crashing Vercel build
    }
  },
  ['medusa-frontend-products-v2'],
  { revalidate: 60, tags: ['products'] }
);

export const getCachedFrontendProduct = unstable_cache(
  async (id: string): Promise<Product | null> => {
    try {
      const { regions } = await medusaClient.store.region.list() as { regions: MedusaRegion[] };
      const indiaRegion = regions.find((r) => r.currency_code === "inr") || regions[0];

      if (!indiaRegion) return null;

      const response = await medusaClient.store.product.retrieve(id, {
        region_id: indiaRegion.id 
      }) as { product: MedusaProduct };
      
      const { collections } = await medusaClient.store.collection.list() as { collections: MedusaCollection[] };

      return adaptProduct(response.product, collections);
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      return null;
    }
  },
  ['medusa-frontend-product-v2'],
  { revalidate: 60, tags: ['product'] }
);

// Cache Collections Fetch (Valid for 1 hour)
export const getCachedCollections = unstable_cache(
  async (): Promise<MedusaCollection[]> => {
    try {
      const { collections } = await medusaClient.store.collection.list() as { collections: MedusaCollection[] };
      return collections;
    } catch (error) {
      console.error("Failed to fetch collections:", error);
      return [];
    }
  },
  ['medusa-collections-v2'],
  { revalidate: 3600 }
);
