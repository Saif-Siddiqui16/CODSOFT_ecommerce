import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import type { Order } from "@/lib/types";

interface OrderState {
  isLoading: boolean;
  orders: Order[];
  userOrders: Order[];
  orderDetails: Order | null;
  error: string | null;
}

const initialState: OrderState = {
  isLoading: false,
  orders: [],
  userOrders: [],
  orderDetails: null,
  error: null,
};

const getErrorMessage = (error: any): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  return String(error);
};

export const fetchAllOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("orders/fetchAllOrders", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get("http://localhost:8000/api/admin/orders", {
      withCredentials: true,
    });
    return res.data.orders;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchUserOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("orders/fetchUserOrders", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(
      "http://localhost:8000/api/shop/order/my-orders",
      {
        withCredentials: true,
      }
    );
    return res.data.orders;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchOrderById = createAsyncThunk<
  Order,
  string,
  { rejectValue: string }
>("orders/fetchOrderById", async (orderId, { rejectWithValue }) => {
  try {
    const res = await axios.get(
      `http://localhost:8000/api/shop/order/${orderId}`,
      { withCredentials: true }
    );
    return res.data.order;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateOrderStatus = createAsyncThunk<
  Order,
  { orderId: string; status: Order["orderStatus"] },
  { rejectValue: string }
>(
  "orders/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:8000/api/admin/orders/${orderId}`,
        { status },
        { withCredentials: true }
      );
      return res.data.order;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteOrder = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("orders/deleteOrder", async (orderId, { rejectWithValue }) => {
  try {
    await axios.delete(`http://localhost:8000/api/admin/orders/${orderId}`, {
      withCredentials: true,
    });
    return orderId;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchAllOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.isLoading = false;
          state.orders = action.payload;
        }
      )
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch orders";
      });

    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchUserOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.isLoading = false;
          state.userOrders = action.payload;
        }
      )
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch user orders";
      });

    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
        state.orderDetails = null;
        state.error = null;
      })
      .addCase(
        fetchOrderById.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.isLoading = false;
          state.orderDetails = action.payload;
        }
      )
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.orderDetails = null;
        state.error = action.payload || "Failed to fetch order details";
      });

    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(
        updateOrderStatus.fulfilled,
        (state, action: PayloadAction<Order>) => {
          const index = state.orders.findIndex(
            (o) => o._id === action.payload._id
          );
          if (index !== -1) state.orders[index] = action.payload;

          if (state.orderDetails?._id === action.payload._id) {
            state.orderDetails = action.payload;
          }
        }
      )
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload || "Failed to update order status";
      });

    builder
      .addCase(deleteOrder.pending, (state) => {
        state.error = null;
      })
      .addCase(
        deleteOrder.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.orders = state.orders.filter((o) => o._id !== action.payload);
          if (state.orderDetails?._id === action.payload) {
            state.orderDetails = null;
          }
        }
      )
      .addCase(deleteOrder.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete order";
      });
  },
});

export const { clearError } = orderSlice.actions;
export default orderSlice.reducer;
