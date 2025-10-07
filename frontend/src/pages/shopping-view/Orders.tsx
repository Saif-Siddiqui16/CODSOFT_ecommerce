import React from "react";

const Orders = () => {
  const orders = []; // Placeholder: Redux/API

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div key={order.id} className="border p-4 rounded bg-white">
              <h2 className="font-semibold">Order #{order.id}</h2>
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
