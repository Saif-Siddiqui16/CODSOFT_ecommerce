import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import addressReducer from "./shop/address-slice";
import productReducer from "./shop/product-slice";
import cartReducer from "./shop/cart-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    address: addressReducer,
    product: productReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
