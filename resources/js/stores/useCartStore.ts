import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string; // Unique ID for cart item (product_id + variations string)
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    image_url?: string;
    type: 'physical' | 'digital' | 'service';
    variations?: Record<string, string>;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartCount: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            
            addItem: (item) => {
                set((state) => {
                    const existingItemIndex = state.items.findIndex(i => i.id === item.id);
                    if (existingItemIndex > -1) {
                        const newItems = [...state.items];
                        newItems[existingItemIndex].quantity += item.quantity;
                        return { items: newItems };
                    }
                    return { items: [...state.items, item] };
                });
            },
            
            removeItem: (id) => {
                set((state) => ({
                    items: state.items.filter(item => item.id !== id)
                }));
            },
            
            updateQuantity: (id, quantity) => {
                set((state) => ({
                    items: state.items.map(item => 
                        item.id === id ? { ...item, quantity } : item
                    )
                }));
            },
            
            clearCart: () => {
                set({ items: [] });
            },

            getCartTotal: () => {
                return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
            },

            getCartCount: () => {
                return get().items.reduce((count, item) => count + item.quantity, 0);
            }
        }),
        {
            name: 'eladora-cart-storage',
        }
    )
);
