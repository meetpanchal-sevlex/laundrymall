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
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ variantId, quantity }: { variantId: string; quantity: number }) => {
      const cart = await addToCartAction(variantId, quantity);
      return mapMedusaToUICart(cart);
    },
    onSuccess: (newCart) => {
      queryClient.setQueryData(["cart"], newCart);
      setIsOpen(true);
    },
    onError: (error) => {
      console.error("Failed to add to cart:", error);
      alert("Could not add item to cart. Please try again.");
    }
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ lineItemId, quantity }: { lineItemId: string; quantity: number }) => {
      const cart = await updateCartItemAction(lineItemId, quantity);
      return mapMedusaToUICart(cart);
    },
    onSuccess: (newCart) => {
      queryClient.setQueryData(["cart"], newCart);
    },
    onError: (error) => {
      console.error("Failed to update cart:", error);
      alert("Could not update item. Please try again.");
    }
  });

  const removeItemMutation = useMutation({
    mutationFn: async (lineItemId: string) => {
      const cart = await removeCartItemAction(lineItemId);
      return mapMedusaToUICart(cart);
    },
    onSuccess: (newCart) => {
      queryClient.setQueryData(["cart"], newCart);
    },
    onError: (error) => {
      console.error("Failed to remove item:", error);
      alert("Could not remove item. Please try again.");
    }
  });

  // Calculate sync state based on standard react query loading states
  const isSyncing = cartQuery.isFetching || 
                    addToCartMutation.isPending || 
                    updateQuantityMutation.isPending || 
                    removeItemMutation.isPending;

  return {
    cart: cartQuery.data || { cartId: null, items: [], medusaTotal: 0, medusaSubtotal: 0 },
    isLoading: cartQuery.isLoading,
    isSyncing,
    addItem: (product: Product, quantity: number = 1) => product.variantId && addToCartMutation.mutate({ variantId: product.variantId, quantity }),
    updateQuantity: (lineItemId: string, quantity: number) => updateQuantityMutation.mutate({ lineItemId, quantity }),
    removeItem: (lineItemId: string) => removeItemMutation.mutate(lineItemId),
    clearCart: () => queryClient.setQueryData(["cart"], { cartId: null, items: [], medusaTotal: 0, medusaSubtotal: 0 }),
  };
}
