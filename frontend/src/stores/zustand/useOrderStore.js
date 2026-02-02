import { create } from "zustand";

export const useOrderStore = create((set, get) => ({
  order: null,
  orders: [],
  loading: false,
setOrder:(order)=>{
set({order})
},
setOrders:(orders)=>{
set({ orders });
}
}));
