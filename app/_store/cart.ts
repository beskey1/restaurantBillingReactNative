import { create } from 'zustand';

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

interface CartState {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  decreaseQty: (id: number) => void;
  removeItem: (id: number) => void;
  clear: () => void;
}

export const useCart = create<CartState>((set) => ({
  cart: [],
  addItem: (item) =>
    set((state) => {
      const exists = state.cart.find((i) => i.id === item.id);
      if (exists) {
        exists.qty += 1;
        return { cart: [...state.cart] };
      }
      return { cart: [...state.cart, { ...item, qty: 1 }] };
    }),
  decreaseQty: (id) =>
    set((state) => {
      const item = state.cart.find((i) => i.id === id);
      if (item) {
        if (item.qty > 1) item.qty -= 1;
        else return { cart: state.cart.filter((i) => i.id !== id) };
      }
      return { cart: [...state.cart] };
    }),
  removeItem: (id) => set((state) => ({ cart: state.cart.filter((i) => i.id !== id) })),
  clear: () => set({ cart: [] }),
}));
