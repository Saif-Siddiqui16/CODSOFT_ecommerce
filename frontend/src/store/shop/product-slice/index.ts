import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface Product {
  _id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  price: number;
  createdAt: string;
}

interface ProductState {
  isLoading: boolean;
  productList: Product[];
  productDetails: Product | null;
}

const initialState: ProductState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};

export const fetchProducts = createAsyncThunk(
  "/products/fetchProducts",
  async () => {
    const result = await axios.get("http://localhost:8000/api/shop/products", {
      withCredentials: true,
    });
    return result.data; // return the data directly
  }
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    const result = await axios.get(
      `http://localhost:8000/api/shop/products/get/${id}`,
      { withCredentials: true }
    );
    return result.data;
  }
);

const shoppingProductSlice = createSlice({
  name: "shopProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data || action.payload;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })

      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data || action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

export const { setProductDetails } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;
