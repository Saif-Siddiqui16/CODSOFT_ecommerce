import { API_BASE_URL } from "@/store/auth-slice";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
    isLoading: false,
    status: null,
    error: null,
};
export const fetchPaymentStatus = createAsyncThunk("payment/fetchStatus", async (orderId, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/api/user/payment/status/${orderId}`, { withCredentials: true });
        return res.data.paymentStatus;
    }
    catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to get payment status");
    }
});
const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {
        clearPaymentStatus(state) {
            state.status = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPaymentStatus.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
            .addCase(fetchPaymentStatus.fulfilled, (state, action) => {
            state.isLoading = false;
            state.status = action.payload;
        })
            .addCase(fetchPaymentStatus.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "Error fetching payment status";
        });
    },
});
export const { clearPaymentStatus } = paymentSlice.actions;
export default paymentSlice.reducer;
