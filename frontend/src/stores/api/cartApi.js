import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Cart", "Coupon"],
  endpoints: (builder) => ({
    getCartItems: builder.query({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: (productId) => ({
        url: "/cart",
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation({
      query: (productId) => ({ url: `/cart/${productId}`, method: "DELETE" }),
      invalidatesTags: ["Cart"],
    }),
    updateQuantity: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: `/cart/${productId}`,
        method: "PUT",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
    getMyCoupon: builder.query({
      query: () => "/coupons",
      providesTags: ["Coupon"],
    }),
    applyCoupon: builder.mutation({
      query: (code) => ({
        url: "/coupons/validate",
        method: "POST",
        body: { code },
      }),
      invalidatesTags: ["Coupon"],
    }),
  }),
});
export const {
  useGetCartItemsQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateQuantityMutation,
  useGetMyCouponQuery,
  useApplyCouponMutation,
} = cartApi;
