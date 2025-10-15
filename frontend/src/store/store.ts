import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import addressReducer from "./shop/address-slice";
import productReducer from "./shop/product-slice";
import cartReducer from "./shop/cart-slice";
import orderReducer from "./shop/order-slice";
import couponReducer from "./shop/discount-slice";
import paymentReducer from "./shop/payment-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    address: addressReducer,
    product: productReducer,
    cart: cartReducer,
    orders: orderReducer,
    coupon: couponReducer,
    payment: paymentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
