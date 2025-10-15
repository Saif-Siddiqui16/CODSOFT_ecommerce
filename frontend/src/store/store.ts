import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/auth-slice";
import addressReducer from "@/store/shop/address-slice";
import productReducer from "@/store/shop/product-slice";
import cartReducer from "@/store/shop/cart-slice";
import orderReducer from "@/store/shop/order-slice";
import couponReducer from "@/store/shop/discount-slice";
import paymentReducer from "@/store/shop/payment-slice";

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
