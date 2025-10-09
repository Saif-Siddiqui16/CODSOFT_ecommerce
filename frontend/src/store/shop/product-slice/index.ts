import type { ProductFormData } from "@/components/common/admin/ProductForm";
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
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

export interface ProductState {
  isLoading: boolean;
  productList: Product[];
  productDetails: Product | null;
}

const initialState: ProductState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};
export const deleteProduct = createAsyncThunk<string, string>(
  "products/deleteProduct",
  async (id: string) => {
    await axios.delete(`http://localhost:8000/api/admin/product/${id}`, {
      withCredentials: true,
    });
    return id;
  }
);

export const fetchProducts = createAsyncThunk(
  "/products/fetchProducts",
  async () => {
    const result = await axios.get("http://localhost:8000/api/shop/products", {
      withCredentials: true,
    });
    return result.data; // return the data directly
  }
);
export const createProduct = createAsyncThunk(
  "/products/createProduct",
  async (formData: ProductFormData) => {
    console.log(formData);
    const result = await axios.post(
      "http://localhost:8000/api/admin/product",
      formData,
      {
        withCredentials: true,
      }
    );
    return result.data;
  }
);
export const updateProduct = createAsyncThunk(
  "/products/editProducts",
  async ({ id, formData }: { id: string; formData: FormData }) => {
    console.log(formData);
    const result = await axios.put(
      `http://localhost:8000/api/admin/product/${id}`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return result.data;
  }
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id: string) => {
    const result = await axios.get(
      `http://localhost:8000/api/shop/products/${id}`,
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
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.isLoading = false;
          state.productList = action.payload;
        }
      )
      .addCase(fetchProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })

      // Fetch product details
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchProductDetails.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.isLoading = false;
          state.productDetails = action.payload;
        }
      )
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      })

      // Create product
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        createProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.isLoading = false;
          state.productList.push(action.payload);
        }
      )
      .addCase(createProduct.rejected, (state) => {
        state.isLoading = false;
      })

      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.isLoading = false;
          const index = state.productList.findIndex(
            (p) => p._id === action.payload._id
          );
          if (index !== -1) state.productList[index] = action.payload;
        }
      )
      .addCase(updateProduct.rejected, (state) => {
        state.isLoading = false;
      })

      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.productList = state.productList.filter(
            (p) => p._id !== action.payload
          );
        }
      )
      .addCase(deleteProduct.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setProductDetails } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;
