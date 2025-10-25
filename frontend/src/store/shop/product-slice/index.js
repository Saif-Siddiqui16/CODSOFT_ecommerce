import { API_BASE_URL } from "@/store/auth-slice";
import { createAsyncThunk, createSlice, } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
    isLoading: false,
    productList: [],
    productDetails: null,
};
export const deleteProduct = createAsyncThunk("products/deleteProduct", async (id) => {
    await axios.delete(`${API_BASE_URL}/api/admin/product/${id}`, {
        withCredentials: true,
    });
    return id;
});
export const fetchProducts = createAsyncThunk("/products/fetchProducts", async () => {
    const result = await axios.get(`${API_BASE_URL}/api/shop/products`, {
        withCredentials: true,
    });
    return result.data;
});
export const createProduct = createAsyncThunk("products/createProduct", async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("category", data.category);
    if (data.image instanceof File) {
        formData.append("image", data.image);
    }
    const response = await axios.post(`${API_BASE_URL}/api/admin/product`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.product;
});
export const updateProduct = createAsyncThunk("/products/editProducts", async ({ id, data }) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("category", data.category);
    if (data.image instanceof File) {
        formData.append("image", data.image);
    }
    else if (typeof data.image === "string") {
        formData.append("existingImage", data.image);
    }
    const result = await axios.put(`${API_BASE_URL}/api/admin/product/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
    });
    return result.data.product;
});
export const fetchProductDetails = createAsyncThunk("/products/fetchProductDetails", async (id) => {
    const result = await axios.get(`${API_BASE_URL}/api/shop/products/${id}`, {
        withCredentials: true,
    });
    return result.data;
});
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
            state.productList = action.payload;
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
            state.productDetails = action.payload;
        })
            .addCase(fetchProductDetails.rejected, (state) => {
            state.isLoading = false;
            state.productDetails = null;
        })
            .addCase(createProduct.pending, (state) => {
            state.isLoading = true;
        })
            .addCase(createProduct.fulfilled, (state, action) => {
            state.isLoading = false;
            state.productList.push(action.payload);
        })
            .addCase(createProduct.rejected, (state) => {
            state.isLoading = false;
        })
            .addCase(updateProduct.pending, (state) => {
            state.isLoading = true;
        })
            .addCase(updateProduct.fulfilled, (state, action) => {
            state.isLoading = false;
            const index = state.productList.findIndex((p) => p._id === action.payload._id);
            if (index !== -1)
                state.productList[index] = action.payload;
        })
            .addCase(updateProduct.rejected, (state) => {
            state.isLoading = false;
        })
            .addCase(deleteProduct.pending, (state) => {
            state.isLoading = true;
        })
            .addCase(deleteProduct.fulfilled, (state, action) => {
            state.isLoading = false;
            state.productList = state.productList.filter((p) => p._id !== action.payload);
        })
            .addCase(deleteProduct.rejected, (state) => {
            state.isLoading = false;
        });
    },
});
export const { setProductDetails } = shoppingProductSlice.actions;
export default shoppingProductSlice.reducer;
