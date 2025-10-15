import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/data/hook";
import { fetchOrderById } from "@/store/shop/order-slice";

import { Button } from "@/components/ui/button";
import type { RootState } from "@/store/store";
import { fetchPaymentStatus } from "@/store/shop/payment-slice";

const OrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const dispatch = useAppDispatch();
  const { orderDetails, isLoading } = useAppSelector(
    (state: RootState) => state.orders
  );
  const { status } = useAppSelector((state: RootState) => state.payment);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
      dispatch(fetchPaymentStatus(orderId));
    }
  }, [dispatch, orderId]);

  if (isLoading || !orderDetails) {
    return <div className="text-center mt-10">Loading order...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>

      <section className="bg-white p-6 rounded shadow space-y-2">
        <p>
          <strong>Order ID:</strong> {orderDetails._id}
        </p>
        <p>
          <strong>Order Status:</strong> {orderDetails.orderStatus}
        </p>
        <p>
          <strong>Payment Status:</strong> {status}
        </p>
        <p>
          <strong>Total Amount:</strong> ${orderDetails.totalAmount}
        </p>
        <p>
          <strong>Order Date:</strong>{" "}
          {new Date(orderDetails.orderDate).toLocaleString()}
        </p>
      </section>

      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">Products</h2>
        <div className="space-y-2">
          {orderDetails.cartItems.map((item) => (
            <div
              key={item.productId._id || item.productId}
              className="border p-3 rounded flex justify-between"
            >
              <div>
                <p>{item.title}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
              <p>${item.price}</p>
            </div>
          ))}
        </div>
      </section>

      

      <Button onClick={() => window.history.back()}>Back</Button>
    </div>
  );
};

export default OrderDetailsPage;
