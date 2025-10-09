import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Product } from "@/lib/types";

interface AddToCartArgs {
  productId: string;
}
interface DeletItem {
  itemId: string;
}
interface UpdateCart {
  itemId: string;
  quantity: number;
}

export interface CartItem {
  _id: string;
  productId: Product;
  quantity: number;
}

interface CartResponse {
  _id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartState {
  cartItems: CartItem[];
  isLoading: boolean;
}
const initialState: CartState = {
  cartItems: [],
  isLoading: false,
};
export const addToCart = createAsyncThunk<CartResponse, AddToCartArgs>(
  "cart/addToCart",
  async ({ productId }) => {
    const response = await axios.post(
      "http://localhost:8000/api/shop/cart",
      {
        productId,
      },
      { withCredentials: true }
    );
    console.log(response.data);

    return response.data;
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async () => {
    const response = await axios.get(`http://localhost:8000/api/shop/cart`, {
      withCredentials: true,
    });

    return response.data;
  }
);

export const deleteCartItem = createAsyncThunk<CartResponse, DeletItem>(
  "cart/deleteCartItem",
  async ({ itemId }) => {
    const response = await axios.delete(
      `http://localhost:8000/api/shop/cart/${itemId}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

export const updateCartQuantity = createAsyncThunk<CartResponse, UpdateCart>(
  "cart/updateCartQuantity",
  async ({ itemId, quantity }) => {
    const response = await axios.put(
      `http://localhost:8000/api/shop/cart/${itemId}`,
      { quantity },
      { withCredentials: true }
    );

    return response.data; // this returns the full cart
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.items || [];
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.items || [];
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        const { itemId, quantity } = action.meta.arg; // optimistic update
        const item = state.cartItems.find((i) => i._id === itemId);
        if (item) item.quantity = quantity;
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedId = action.meta.arg.itemId;
        state.cartItems = state.cartItems.filter(
          (item) => item._id !== deletedId
        );
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      });
  },
});

export default shoppingCartSlice.reducer;
