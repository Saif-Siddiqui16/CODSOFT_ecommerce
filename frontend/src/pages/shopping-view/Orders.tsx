import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/data/hook";
import { fetchUserOrders } from "@/store/shop/order-slice";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    userOrders: orders,
    isLoading,
    error,
  } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleOrderClick = (orderId: string) => {
    navigate(`/order/${orderId}`);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {isLoading && <p>Loading orders...</p>}

      {error && <p className="text-red-600">Error: {error}</p>}

      {!isLoading && orders.length === 0 && <p>No orders yet</p>}

      {!isLoading && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border p-4 rounded bg-white cursor-pointer hover:bg-gray-400"
              onClick={() => handleOrderClick(order._id)}
            >
              <h2 className="font-semibold">Order #{order._id}</h2>
              <p>Status: {order.orderStatus}</p>
              <p>Total: ${order.totalAmount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
