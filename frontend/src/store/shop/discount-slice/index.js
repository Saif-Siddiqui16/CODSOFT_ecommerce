import { API_BASE_URL } from "@/store/auth-slice";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
    isLoading: false,
    coupons: [],
    validatedCoupon: null,
    error: null,
};
const getErrorMessage = (error) => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || error.message;
    }
    return String(error);
};
export const fetchCoupons = createAsyncThunk("coupon/fetchCoupons", async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/api/coupons`, {
            withCredentials: true,
        });
        return res.data.coupons;
    }
    catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});
export const createCoupon = createAsyncThunk("coupon/createCoupon", async (couponData, { rejectWithValue }) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/api/coupons`, couponData, {
            withCredentials: true,
        });
        return res.data.coupon;
    }
    catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});
export const validateCoupon = createAsyncThunk("coupon/validateCoupon", async (code, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/api/coupons/validate/${code}`, {
            withCredentials: true,
        });
        return res.data.coupon;
    }
    catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});
export const deleteCoupon = createAsyncThunk("coupon/deleteCoupon", async (couponId, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_BASE_URL}/api/coupons/${couponId}`, {
            withCredentials: true,
        });
        return couponId;
    }
    catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});
const couponSlice = createSlice({
    name: "coupon",
    initialState,
    reducers: {
        clearValidatedCoupon(state) {
            state.validatedCoupon = null;
            state.error = null;
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoupons.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
            .addCase(fetchCoupons.fulfilled, (state, action) => {
            state.isLoading = false;
            state.coupons = action.payload;
        })
            .addCase(fetchCoupons.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "Failed to fetch coupons";
        })
            .addCase(createCoupon.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
            .addCase(createCoupon.fulfilled, (state, action) => {
            state.isLoading = false;
            state.coupons.push(action.payload);
        })
            .addCase(createCoupon.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "Failed to create coupon";
        })
            .addCase(validateCoupon.pending, (state) => {
            state.isLoading = true;
            state.error = null;
            state.validatedCoupon = null;
        })
            .addCase(validateCoupon.fulfilled, (state, action) => {
            state.isLoading = false;
            state.validatedCoupon = action.payload;
        })
            .addCase(validateCoupon.rejected, (state, action) => {
            state.isLoading = false;
            state.validatedCoupon = null;
            state.error = action.payload || "Invalid coupon code";
        })
            .addCase(deleteCoupon.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
            .addCase(deleteCoupon.fulfilled, (state, action) => {
            state.isLoading = false;
            state.coupons = state.coupons.filter((c) => c._id !== action.payload);
        })
            .addCase(deleteCoupon.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "Failed to delete coupon";
        });
    },
});
export const { clearValidatedCoupon, clearError } = couponSlice.actions;
export default couponSlice.reducer;
