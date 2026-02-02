import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    searchProducts: builder.query({
      query: ({ query = "", limit = 10 }) => ({
        url: "/products/search",
        params: { query, limit },
      }),
      providesTags: (result) =>
        result?.products
          ? [
              ...result.products.map(({ _id }) => ({
                type: "Product",
                id: _id,
              })),
              { type: "Product", id: "SEARCH" },
            ]
          : [{ type: "Product", id: "SEARCH" }],
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    getProductsByCategory: builder.query({
      query: ({ category, cursor = null, limit = 2 }) => {
        const params = new URLSearchParams({
          category,
          limit: limit.toString(),
        });
        if (cursor) params.append("after", cursor);
        return {
          url: `/products/by-category?${params.toString()}`,
        };
      },
      providesTags: (result, error, { category }) => [
        { type: "Product", id: `CATEGORY_${category}` },
        ...(result?.products || []).map(({ _id }) => ({
          type: "Product",
          id: _id,
        })),
      ],
    }),
  }),
});

export const {
  useSearchProductsQuery,
  useLazySearchProductsQuery,
  useGetProductByIdQuery,
  useLazyGetProductsByCategoryQuery,
} = productApi;
