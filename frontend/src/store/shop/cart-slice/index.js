import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "@/store/auth-slice";
const initialState = {
    cartItems: [],
    isLoading: false,
    error: null,
};
export const addToCart = createAsyncThunk("cart/addToCart", async ({ productId }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/shop/cart`, { productId }, { withCredentials: true });
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to add item to cart");
    }
});
export const fetchCartItems = createAsyncThunk("cart/fetchCartItems", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/shop/cart`, {
            withCredentials: true,
        });
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch cart items");
    }
});
export const deleteCartItem = createAsyncThunk("cart/deleteCartItem", async ({ itemId }, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/api/shop/cart/${itemId}`, { withCredentials: true });
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete cart item");
    }
});
export const updateCartQuantity = createAsyncThunk("cart/updateCartQuantity", async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/api/shop/cart/${itemId}`, { quantity }, { withCredentials: true });
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to update cart quantity");
    }
});
const shoppingCartSlice = createSlice({
    name: "shoppingCart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
            .addCase(addToCart.fulfilled, (state, action) => {
            state.isLoading = false;
            state.cartItems = action.payload.items || [];
        })
            .addCase(addToCart.rejected, (state, action) => {
            state.isLoading = false;
            state.error =
                action.payload || "Failed to add item to cart";
        })
            .addCase(fetchCartItems.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
            .addCase(fetchCartItems.fulfilled, (state, action) => {
            state.isLoading = false;
            state.cartItems = action.payload.items || [];
        })
            .addCase(fetchCartItems.rejected, (state, action) => {
            state.isLoading = false;
            state.error =
                action.payload || "Failed to fetch cart items";
        })
            .addCase(updateCartQuantity.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
            .addCase(updateCartQuantity.fulfilled, (state, action) => {
            state.isLoading = false;
            const { itemId, quantity } = action.meta.arg;
            const item = state.cartItems.find((i) => i._id === itemId);
            if (item) {
                item.quantity = quantity;
            }
        })
            .addCase(updateCartQuantity.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "Failed to update quantity";
        })
            .addCase(deleteCartItem.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
            .addCase(deleteCartItem.fulfilled, (state, action) => {
            state.isLoading = false;
            const deletedId = action.meta.arg.itemId;
            state.cartItems = state.cartItems.filter((item) => item._id !== deletedId);
        })
            .addCase(deleteCartItem.rejected, (state, action) => {
            state.isLoading = false;
            state.error =
                action.payload || "Failed to delete cart item";
        });
    },
});
export default shoppingCartSlice.reducer;
