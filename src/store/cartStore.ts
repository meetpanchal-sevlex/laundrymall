import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/data/products';
import { 
  getOrCreateCart, 
  addToCartAction, 
  updateCartItemAction, 
  removeCartItemAction, 
  clearCartAction 
} from '@/app/actions/cart';

export interface CartItem extends Product {
  quantity: number;
  lineItemId?: string;
}

interface CartStore {
  cartId: string | null;
  items: CartItem[];
  medusaTotal: number;
  medusaSubtotal: number;
  isLoading: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setCartId: (id: string) => void;
  syncCart: () => Promise<void>;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: () => number;
  itemCount: () => number;
}

function mapMedusaCart(cart: any, currentItems: CartItem[] = []): {
  cartId: string | null;
  items: CartItem[];
  medusaTotal: number;
  medusaSubtotal: number;
} {
  if (!cart) {
    return { cartId: null, items: [], medusaTotal: 0, medusaSubtotal: 0 };
  }

  const items: CartItem[] = (cart.items || []).map((lineItem: any) => {
    const matchedLocal = currentItems.find(
      (li) => li.variantId === lineItem.variant_id || li.lineItemId === lineItem.id || li.id === lineItem.product_id
    );
    const unitPrice = lineItem.unit_price !== undefined ? Number(lineItem.unit_price) : (matchedLocal?.price || 0);

    return {
      id: lineItem.product_id || lineItem.variant?.product_id || matchedLocal?.id || lineItem.id,
      variantId: lineItem.variant_id,
      lineItemId: lineItem.id,
      name: lineItem.title || lineItem.product_title || matchedLocal?.name || "Product",
      category: matchedLocal?.category || "General",
      price: unitPrice,
      originalPrice: matchedLocal?.originalPrice,
      image: lineItem.thumbnail || matchedLocal?.image || "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=600&auto=format&fit=crop",
      description: matchedLocal?.description || "",
      quantity: lineItem.quantity,
    };
  });

  const medusaTotal = cart.total !== undefined ? Number(cart.total) : items.reduce((t, i) => t + i.price * i.quantity, 0);
  const medusaSubtotal = cart.subtotal !== undefined ? Number(cart.subtotal) : medusaTotal;

  return {
    cartId: cart.id,
    items,
    medusaTotal,
    medusaSubtotal,
  };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartId: null,
      items: [],
      medusaTotal: 0,
      medusaSubtotal: 0,
      isLoading: false,
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
      setCartId: (id) => set({ cartId: id }),

      syncCart: async () => {
        try {
          const cart = await getOrCreateCart();
          const mapped = mapMedusaCart(cart, get().items);
          set({
            cartId: mapped.cartId,
            items: mapped.items,
            medusaTotal: mapped.medusaTotal,
            medusaSubtotal: mapped.medusaSubtotal,
          });
        } catch (error) {
          console.error("Failed to sync cart with Medusa backend:", error);
        }
      },

      addItem: async (product, quantity = 1) => {
        // Optimistic UI update
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id || (product.variantId && item.variantId === product.variantId));
          let nextItems: CartItem[];
          if (existingItem) {
            nextItems = state.items.map((item) =>
              item.id === existingItem.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            nextItems = [...state.items, { ...product, quantity }];
          }
          const calcTotal = nextItems.reduce((t, i) => t + i.price * i.quantity, 0);
          return { items: nextItems, medusaTotal: calcTotal, isOpen: true, isLoading: true };
        });

        // Authoritative sync with Medusa Backend
        try {
          if (product.variantId) {
            const cart = await addToCartAction(product.variantId, quantity);
            const mapped = mapMedusaCart(cart, get().items);
            set({
              cartId: mapped.cartId,
              items: mapped.items,
              medusaTotal: mapped.medusaTotal,
              medusaSubtotal: mapped.medusaSubtotal,
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
          }
        } catch (e) {
          console.error("Failed to add item to Medusa cart:", e);
          set({ isLoading: false });
        }
      },

      removeItem: async (productId) => {
        const currentItems = get().items;
        const itemToRemove = currentItems.find((i) => i.id === productId || i.lineItemId === productId);
        
        // Optimistic update
        set((state) => {
          const nextItems = state.items.filter((item) => item.id !== productId && item.lineItemId !== productId);
          const calcTotal = nextItems.reduce((t, i) => t + i.price * i.quantity, 0);
          return { items: nextItems, medusaTotal: calcTotal, isLoading: true };
        });

        // Authoritative sync with Medusa Backend
        try {
          if (itemToRemove?.lineItemId) {
            const cart = await removeCartItemAction(itemToRemove.lineItemId);
            const mapped = mapMedusaCart(cart, get().items);
            set({
              cartId: mapped.cartId,
              items: mapped.items,
              medusaTotal: mapped.medusaTotal,
              medusaSubtotal: mapped.medusaSubtotal,
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
          }
        } catch (e: any) {
          console.error("Failed to remove item from Medusa cart:", e);
          alert("Could not remove item. " + (e.message || "Please refresh the page."));
          get().syncCart(); // Rollback UI
          set({ isLoading: false });
        }
      },

      updateQuantity: async (productId, quantity) => {
        if (quantity <= 0) {
          await get().removeItem(productId);
          return;
        }

        const currentItems = get().items;
        const itemToUpdate = currentItems.find((i) => i.id === productId || i.lineItemId === productId);

        // Optimistic update (INSTANT feedback)
        set((state) => {
          const nextItems = state.items.map((item) =>
            item.id === productId || item.lineItemId === productId
              ? { ...item, quantity }
              : item
          );
          const calcTotal = nextItems.reduce((t, i) => t + i.price * i.quantity, 0);
          // Set isLoading so we can show a small spinner, but don't lock the UI
          return { items: nextItems, medusaTotal: calcTotal, isLoading: true };
        });

        if (itemToUpdate?.lineItemId) {
          const lineId = itemToUpdate.lineItemId;
          
          // Clear any pending network request for this exact line item
          if ((window as any)._cartDebounceTimers && (window as any)._cartDebounceTimers[lineId]) {
            clearTimeout((window as any)._cartDebounceTimers[lineId]);
          }
          
          if (!(window as any)._cartDebounceTimers) {
            (window as any)._cartDebounceTimers = {};
          }

          // Debounce the network call by 400ms to allow rapid clicking
          (window as any)._cartDebounceTimers[lineId] = setTimeout(async () => {
            try {
              const cart = await updateCartItemAction(lineId, quantity);
              const mapped = mapMedusaCart(cart, get().items);
              set({
                cartId: mapped.cartId,
                items: mapped.items,
                medusaTotal: mapped.medusaTotal,
                medusaSubtotal: mapped.medusaSubtotal,
                isLoading: false,
              });
            } catch (e: any) {
              console.error("Failed to update item quantity in Medusa cart:", e);
              alert("Could not update quantity. " + (e.message || "Please refresh the page."));
              get().syncCart(); // Rollback UI
              set({ isLoading: false });
            }
          }, 400);
        } else {
          set({ isLoading: false });
        }
      },

      clearCart: async () => {
        set({ items: [], cartId: null, medusaTotal: 0, medusaSubtotal: 0, isLoading: false });
        try {
          await clearCartAction();
        } catch (e) {
          console.error("Failed to clear cart:", e);
        }
      },

      cartTotal: () => {
        const { medusaTotal, items } = get();
        if (medusaTotal > 0) return medusaTotal;
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      itemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'laundrymall-cart-v2',
      partialize: (state) => ({ 
        items: state.items,
        cartId: state.cartId,
        medusaTotal: state.medusaTotal,
        medusaSubtotal: state.medusaSubtotal,
      }),
    }
  )
);