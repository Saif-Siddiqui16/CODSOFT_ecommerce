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
  orderDetails: Order | null;
}

const initialState: OrderState = {
  isLoading: false,
  orders: [],
  orderDetails: null,
};

// Fetch all orders
export const fetchAllOrders = createAsyncThunk<Order[]>(
  "orders/fetchAllOrders",
  async () => {
    const res = await axios.get("http://localhost:8000/api/admin/orders", {
      withCredentials: true,
    });
    return res.data.orders;
  }
);

// Fetch single order by ID
export const fetchOrderById = createAsyncThunk<Order, string>(
  "orders/fetchOrderById",
  async (orderId) => {
    const res = await axios.get(
      `http://localhost:8000/api/shop/order/${orderId}`,
      { withCredentials: true }
    );
    return res.data.order;
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk<
  Order,
  { orderId: string; status: Order["orderStatus"] }
>("orders/updateOrderStatus", async ({ orderId, status }) => {
  const res = await axios.put(
    `http://localhost:8000/api/admin/orders/${orderId}`,
    { status },
    { withCredentials: true }
  );
  return res.data.order;
});

// Delete order
export const deleteOrder = createAsyncThunk<string, string>(
  "orders/deleteOrder",
  async (orderId) => {
    await axios.delete(`http://localhost:8000/api/admin/orders/${orderId}`, {
      withCredentials: true,
    });
    return orderId;
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch all orders
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchAllOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.isLoading = false;
          state.orders = action.payload;
        }
      )
      .addCase(fetchAllOrders.rejected, (state) => {
        state.isLoading = false;
      });

    // Fetch single order
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
        state.orderDetails = null;
      })
      .addCase(
        fetchOrderById.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.isLoading = false;
          state.orderDetails = action.payload;
        }
      )
      .addCase(fetchOrderById.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });

    // Update order status
    builder.addCase(
      updateOrderStatus.fulfilled,
      (state, action: PayloadAction<Order>) => {
        const index = state.orders.findIndex(
          (o) => o._id === action.payload._id
        );
        if (index !== -1) state.orders[index] = action.payload;

        // If currently viewing this order, update orderDetails too
        if (state.orderDetails?._id === action.payload._id) {
          state.orderDetails = action.payload;
        }
      }
    );

    // Delete order
    builder.addCase(
      deleteOrder.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.orders = state.orders.filter((o) => o._id !== action.payload);
        if (state.orderDetails?._id === action.payload) {
          state.orderDetails = null;
        }
      }
    );
  },
});

export default orderSlice.reducer;
