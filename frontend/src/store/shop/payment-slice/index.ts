import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface PaymentState {
  isLoading: boolean;
  status: string | null;
  error: string | null;
}

const initialState: PaymentState = {
  isLoading: false,
  status: null,
  error: null,
};

export const fetchPaymentStatus = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("payment/fetchStatus", async (orderId, { rejectWithValue }) => {
  try {
    const res = await axios.get(
      `http://localhost:8000/api/user/payment/status/${orderId}`,
      { withCredentials: true }
    );
    return res.data.paymentStatus;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to get payment status"
    );
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
      .addCase(
        fetchPaymentStatus.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.status = action.payload;
        }
      )
      .addCase(fetchPaymentStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Error fetching payment status";
      });
  },
});

export const { clearPaymentStatus } = paymentSlice.actions;
export default paymentSlice.reducer;
