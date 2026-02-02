import { create } from "zustand";




export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,
  setCart: (cart) => {
    set({ cart });
    get().calcTotals();
  },
  setCoupon: (coupon) => {
    set({ coupon, isCouponApplied: !!coupon });
    get().calcTotals();
  },
  removeCoupon: () => {
    set({ coupon: null, isCouponApplied: false });
    get().calcTotals();
  },
  clearCart: async () => {
    set({ cart: [], coupon: null, total: 0, subtotal: 0 });
  },

  calcTotals: () => {
    const { cart, coupon, isCouponApplied } = get();
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    let total = subtotal;

    if (coupon && isCouponApplied) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }
    set({ subtotal, total });
  },
}));
