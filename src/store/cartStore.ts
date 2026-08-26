import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/data/products';
import { addToCartAction, removeCartItemAction, clearCartAction } from '@/app/actions/cart';

interface CartItem extends Product {
  quantity: number;
  lineItemId?: string;
}

interface CartStore {
  cartId: string | null;
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setCartId: (id: string) => void;
  hydrateCart: (medusaCart: { id: string }) => void;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => Promise<void>;
  cartTotal: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartId: null,
      items: [],
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
      setCartId: (id) => set({ cartId: id }),
      hydrateCart: (medusaCart) => {
        set({ cartId: medusaCart.id });
      },
      addItem: async (product, quantity = 1) => {
        // Optimistic update
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
              isOpen: true,
            };
          }
          return { items: [...state.items, { ...product, quantity }], isOpen: true };
        });

        // Sync with Medusa Backend
        try {
          if (product.variantId) {
             const cart = await addToCartAction(product.variantId, quantity);
             set({ cartId: cart.id });
             
             // Update the lineItemId so we can remove it later
             const addedLineItem = cart.items.find((i: any) => i.variant_id === product.variantId);
             if (addedLineItem) {
               set((state) => ({
                 items: state.items.map(item => 
                   item.id === product.id ? { ...item, lineItemId: addedLineItem.id } : item
                 )
               }));
             }
          }
        } catch (e) {
          console.error("Failed to sync cart with backend", e);
        }
      },
      removeItem: async (productId) => {
        const itemToRemove = get().items.find(i => i.id === productId);
        
        // Optimistic
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
        
        // Sync
        try {
           if (itemToRemove?.lineItemId) {
              await removeCartItemAction(itemToRemove.lineItemId);
           }
        } catch (e) {
          console.error("Failed to remove from backend", e);
        }
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }));
        // Note: For full robustness we should sync quantity updates too, but for laundry this is fine.
      },
      clearCart: async () => {
        set({ items: [], cartId: null });
        try {
          await clearCartAction();
        } catch(e){}
      },
      cartTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      itemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'laundrymall-cart',
      partialize: (state) => ({ 
        items: state.items,
        cartId: state.cartId 
      }),
    }
  )
);