import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};

// ✅ Fetch all products (no filters)
export const fetchProducts = createAsyncThunk(
  "/products/fetchProducts",
  async () => {
    const result = await axios.get("http://localhost:8000/api/shop/products", {
      withCredentials: true,
    });
    return result.data; // return the data directly
  }
);

// ✅ Fetch products with filters & sorting
export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllFilteredProducts",
  async ({ filterParams = {}, sortParams = "" }) => {
    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    }).toString();

    const result = await axios.get(
      `http://localhost:8000/api/shop/products/get?${query}`,
      { withCredentials: true }
    );
    return result.data;
  }
);

// ✅ Fetch single product details
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
      // 🟡 Fetch All Products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        // API returns { data: [...] } or [...] — adjust safely
        state.productList = action.payload.data || action.payload;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })

      // 🟢 Filtered Products
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data || action.payload;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })

      // 🔵 Single Product Details
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
