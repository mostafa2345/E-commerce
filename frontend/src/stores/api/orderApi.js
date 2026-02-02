import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => "/orders",
      providesTags: ["Order"],
    }),
    getOrder: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: ["Order"],
    }),
    createOrder: builder.mutation({
      query: ({ cart, coupon, isCouponApplied, checkoutData }) => ({
        url: "/orders/create-order",
        method: "POST",
        body: { cart, coupon, isCouponApplied, checkoutData },
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const { useGetOrdersQuery, useGetOrderQuery, useCreateOrderMutation } =
  orderApi;
