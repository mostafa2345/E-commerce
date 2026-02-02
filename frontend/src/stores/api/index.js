import { configureStore } from "@reduxjs/toolkit";
import { cartApi } from "./cartApi";
import { orderApi } from "./orderApi";
import { productApi } from "./productApi";

export const store = configureStore({
  reducer: {
    [cartApi.reducerPath]: cartApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      cartApi.middleware,
      orderApi.middleware,
      productApi.middleware,
    ),
});
