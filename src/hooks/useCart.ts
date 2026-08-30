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
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // 2. Add To Cart Mutation
  const addToCartMutation = useMutation({
    mutationFn: async ({ product, quantity }: { product: Product; quantity: number }) => {
      if (!product.variantId) return getOrCreateCart(); // Fallback for dummy items without variants
      const cart = await addToCartAction(product.variantId, quantity);
      return mapMedusaToUICart(cart);
    },
    onMutate: async ({ product, quantity }) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      // Snapshot previous state
      const previousCart = queryClient.getQueryData(["cart"]);
      // Optimistically update
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
      // Open drawer for better UX
      setIsOpen(true);
      return { previousCart };
    },
    onError: (err, variables, context) => {
      // Rollback on failure
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
      console.error("Failed to add to cart:", err);
    },
    onSettled: () => {
      // Refetch securely in background
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // 3. Update Quantity Mutation
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ lineItemId, quantity }: { lineItemId: string; quantity: number }) => {
      if (lineItemId.startsWith("temp-")) throw new Error("Cannot update optimistic item");
      const cart = await updateCartItemAction(lineItemId, quantity);
      return mapMedusaToUICart(cart);
    },
    onMutate: async ({ lineItemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData(["cart"]);
      queryClient.setQueryData(["cart"], (old: any) => {
        if (!old?.items) return old;
        const newItems = old.items.map((i: any) => i.lineItemId === lineItemId ? { ...i, quantity } : i);
        return { ...old, items: newItems, medusaTotal: newItems.reduce((t: number, i: any) => t + i.price * i.quantity, 0) };
      });
      return { previousCart };
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) queryClient.setQueryData(["cart"], context.previousCart);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // 4. Remove Item Mutation
  const removeItemMutation = useMutation({
    mutationFn: async (lineItemId: string) => {
      if (lineItemId.startsWith("temp-")) return;
      const cart = await removeCartItemAction(lineItemId);
      return mapMedusaToUICart(cart);
    },
    onMutate: async (lineItemId) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData(["cart"]);
      queryClient.setQueryData(["cart"], (old: any) => {
        if (!old?.items) return old;
        const newItems = old.items.filter((i: any) => i.lineItemId !== lineItemId);
        return { ...old, items: newItems, medusaTotal: newItems.reduce((t: number, i: any) => t + i.price * i.quantity, 0) };
      });
      return { previousCart };
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) queryClient.setQueryData(["cart"], context.previousCart);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
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
