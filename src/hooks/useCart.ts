"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrCreateCart, addToCartAction, updateCartItemAction, removeCartItemAction } from "@/app/actions/cart";
import { useCartStore } from "@/store/cartStore";
import { PRODUCTS, Product } from "@/data/products";

export interface UICartItem {
  id: string;
  variantId?: string;
  lineItemId: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  quantity: number;
}

export interface UICart {
  cartId: string | null;
  items: UICartItem[];
  medusaTotal: number;
  medusaSubtotal: number;
}

// Helper to map Medusa's Cart object to our UI CartItem structure
export function mapMedusaToUICart(cart: any): UICart {
  if (!cart) return { cartId: null, items: [], medusaTotal: 0, medusaSubtotal: 0 };

  const items: UICartItem[] = (cart.items || []).map((lineItem: any) => {
    // Find matching local static product for rich metadata (images, categories)
    const localProduct = PRODUCTS.find(p => p.variantId === lineItem.variant_id || p.id === lineItem.product_id);
    
    return {
      id: lineItem.product_id || lineItem.variant?.product_id || localProduct?.id || lineItem.id,
      variantId: lineItem.variant_id,
      lineItemId: lineItem.id,
      name: lineItem.title || lineItem.product_title || localProduct?.name || "Product",
      category: localProduct?.category || "General",
      price: lineItem.unit_price !== undefined ? Number(lineItem.unit_price) : (localProduct?.price || 0),
      originalPrice: localProduct?.originalPrice,
      image: lineItem.thumbnail || localProduct?.image || "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=600&auto=format&fit=crop",
      description: localProduct?.description || "",
      quantity: lineItem.quantity,
    };
  });

  return {
    cartId: cart.id,
    items,
    medusaTotal: cart.total !== undefined ? Number(cart.total) : items.reduce((t: number, i: any) => t + i.price * i.quantity, 0),
    medusaSubtotal: cart.subtotal !== undefined ? Number(cart.subtotal) : cart.total,
  };
}

let syncQueue = Promise.resolve<any>(null);
let activeMutations = 0;

export function useCart() {
  const queryClient = useQueryClient();
  const setIsOpen = useCartStore((state) => state.setIsOpen);

  // 1. Fetch Cart Query
  const cartQuery = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const cart = await getOrCreateCart();
      return mapMedusaToUICart(cart);
    },
    staleTime: 0, // Always treat cart data as stale — never serve a cached version after a mutation
    gcTime: 1000 * 60 * 5, // Keep in memory for 5 minutes but always re-fetch
  });

  // Helper to handle queue completion
  const onMutationSettled = () => {
    activeMutations--;
    if (activeMutations === 0) {
      // Only refetch from server when all rapid clicks have finished processing
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    }
  };

  // Helper to force resync on error
  const onMutationError = (err: any) => {
    console.error("Cart mutation failed:", err);
    // If something fails, force a hard resync from the server immediately
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  };

  // 2. Add To Cart Mutation
  const addToCartMutation = useMutation({
    mutationFn: ({ product, quantity }: { product: Product; quantity: number }) => {
      if (!product.variantId) return getOrCreateCart();
      return new Promise<UICart>((resolve, reject) => {
        syncQueue = syncQueue.then(async () => {
          try {
            const cart = await addToCartAction(product.variantId!, quantity);
            resolve(mapMedusaToUICart(cart));
          } catch (e) {
            reject(e);
          }
        }).catch(() => {});
      });
    },
    onMutate: async ({ product, quantity }) => {
      activeMutations++;
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      queryClient.setQueryData(["cart"], (old: any) => {
        const newItems = old?.items ? [...old.items] : [];
        const existing = newItems.find((i: any) => i.id === product.id || (product.variantId && i.variantId === product.variantId));
        if (existing) {
          existing.quantity += quantity;
        } else {
          newItems.push({ ...product, quantity, lineItemId: "temp-" + Date.now() });
        }
        return {
          ...old,
          items: newItems,
          medusaTotal: newItems.reduce((t: number, i: any) => t + i.price * i.quantity, 0)
        };
      });
      setIsOpen(true);
    },
    onError: onMutationError,
    onSettled: onMutationSettled,
  });

  // 3. Update Quantity Mutation
  const updateQuantityMutation = useMutation({
    mutationFn: ({ lineItemId, quantity }: { lineItemId: string; quantity: number }) => {
      if (lineItemId.startsWith("temp-")) throw new Error("Cannot update optimistic item");
      return new Promise<UICart>((resolve, reject) => {
        syncQueue = syncQueue.then(async () => {
          try {
            const cart = await updateCartItemAction(lineItemId, quantity);
            resolve(mapMedusaToUICart(cart));
          } catch (e) {
            reject(e);
          }
        }).catch(() => {});
      });
    },
    onMutate: async ({ lineItemId, quantity }) => {
      activeMutations++;
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      queryClient.setQueryData(["cart"], (old: any) => {
        if (!old?.items) return old;
        const newItems = old.items.map((i: any) => i.lineItemId === lineItemId ? { ...i, quantity } : i);
        return { ...old, items: newItems, medusaTotal: newItems.reduce((t: number, i: any) => t + i.price * i.quantity, 0) };
      });
    },
    onError: onMutationError,
    onSettled: onMutationSettled,
  });

  // 4. Remove Item Mutation
  const removeItemMutation = useMutation({
    mutationFn: (lineItemId: string) => {
      if (lineItemId.startsWith("temp-")) return Promise.resolve(null);
      return new Promise<UICart | null>((resolve, reject) => {
        syncQueue = syncQueue.then(async () => {
          try {
            const cart = await removeCartItemAction(lineItemId);
            resolve(mapMedusaToUICart(cart));
          } catch (e) {
            reject(e);
          }
        }).catch(() => {});
      });
    },
    onMutate: async (lineItemId) => {
      activeMutations++;
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      queryClient.setQueryData(["cart"], (old: any) => {
        if (!old?.items) return old;
        const newItems = old.items.filter((i: any) => i.lineItemId !== lineItemId);
        return { ...old, items: newItems, medusaTotal: newItems.reduce((t: number, i: any) => t + i.price * i.quantity, 0) };
      });
    },
    onError: onMutationError,
    onSettled: onMutationSettled,
  });

  return {
    cart: cartQuery.data || { cartId: null, items: [], medusaTotal: 0, medusaSubtotal: 0 },
    isLoading: cartQuery.isLoading,
    isSyncing: addToCartMutation.isPending || updateQuantityMutation.isPending || removeItemMutation.isPending,
    addItem: (product: Product, quantity: number = 1) => addToCartMutation.mutate({ product, quantity }),
    updateQuantity: (lineItemId: string, quantity: number) => updateQuantityMutation.mutate({ lineItemId, quantity }),
    removeItem: (lineItemId: string) => removeItemMutation.mutate(lineItemId),
    clearCart: () => queryClient.setQueryData(["cart"], { cartId: null, items: [], medusaTotal: 0, medusaSubtotal: 0 }),
  };
}
