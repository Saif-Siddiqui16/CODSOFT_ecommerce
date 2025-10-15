import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/data/hook";
import {
  addNewAddress,
  deleteAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import { fetchAllOrders } from "@/store/shop/order-slice";
import Pagination from "@/components/common/Pagination";
import type { RootState } from "@/store/store";
import type { Order } from "@/lib/types";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderPage, setOrderPage] = useState(1);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address: "",
    city: "",
    pincode: "",
    phone: "",
  });

  const fetchAddress = useCallback(async () => {
    const data = await dispatch(fetchAllAddresses());
    if (data.payload && Array.isArray(data.payload)) {
      setAddresses(data.payload);
    }
  }, [dispatch]);

  const fetchOrders = useCallback(async () => {
    const result = await dispatch(fetchAllOrders());
    if (result.payload && Array.isArray(result.payload)) {
      setOrders(result.payload);
    } else {
      console.warn("Invalid orders payload:", result.payload);
      setOrders([]);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAddress();
    fetchOrders();
  }, [fetchAddress, fetchOrders]);

  const handleDeleteAddress = async (id: string) => {
    await dispatch(deleteAddress(id));
    fetchAddress();
  };

  const handleEditAddress = (id: string) => {
    navigate(`/address/${id}`);
  };

  const handleCreateAddress = async () => {
    await dispatch(addNewAddress(newAddress));
    setNewAddress({ address: "", city: "", pincode: "", phone: "" });
    setIsDialogOpen(false);
    fetchAddress();
  };

  const totalOrderPages = Math.ceil((orders?.length || 0) / ITEMS_PER_PAGE);
  const paginatedOrders = Array.isArray(orders)
    ? orders.slice((orderPage - 1) * ITEMS_PER_PAGE, orderPage * ITEMS_PER_PAGE)
    : [];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <section className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p>
          <strong>Username:</strong> {user?.userName}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
      </section>

      <section className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Addresses</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Add Address</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-4">
                <Label>Address</Label>
                <input
                  className="border px-3 py-2 w-full rounded"
                  placeholder="Address"
                  value={newAddress.address}
                  onChange={(e) =>
                    setNewAddress((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                />
                <Label>City</Label>
                <input
                  className="border px-3 py-2 w-full rounded"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress((prev) => ({ ...prev, city: e.target.value }))
                  }
                />
                <Label>Pincode</Label>
                <input
                  className="border px-3 py-2 w-full rounded"
                  placeholder="Pincode"
                  value={newAddress.pincode}
                  onChange={(e) =>
                    setNewAddress((prev) => ({
                      ...prev,
                      pincode: e.target.value,
                    }))
                  }
                />
                <Label>Phone</Label>
                <input
                  className="border px-3 py-2 w-full rounded"
                  placeholder="Phone"
                  value={newAddress.phone}
                  onChange={(e) =>
                    setNewAddress((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                />
                <Button className="mt-2 w-full" onClick={handleCreateAddress}>
                  Save Address
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-3">
          {Array.isArray(addresses) && addresses.length > 0 ? (
            addresses.map((addr) => (
              <div
                key={addr._id}
                className="border p-3 rounded flex justify-between items-center"
              >
                <div>
                  <p>
                    {addr.address}, {addr.city}, {addr.pincode}
                  </p>
                  <p>Phone: {addr.phone}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleEditAddress(addr._id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteAddress(addr._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p>No addresses found.</p>
          )}
        </div>
      </section>

      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Orders</h2>
        <div className="space-y-3">
          {Array.isArray(paginatedOrders) && paginatedOrders.length === 0 && (
            <p>No orders found.</p>
          )}

          {Array.isArray(paginatedOrders) &&
            paginatedOrders.map((order) => (
              <div
                key={order._id}
                className="border p-3 rounded flex justify-between items-center"
              >
                <div>
                  <p>Order ID: {order._id}</p>
                  <p>Total Amount: ${order.totalAmount}</p>
                  <p>Status: {order.orderStatus}</p>
                  <p>
                    Date:{" "}
                    {order.orderDate
                      ? new Date(order.orderDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/order/${order._id}`)}
                >
                  View Details
                </Button>
              </div>
            ))}
        </div>

        {totalOrderPages > 1 && (
          <Pagination
            currentPage={orderPage}
            totalPages={totalOrderPages}
            onPageChange={setOrderPage}
          />
        )}
      </section>
    </div>
  );
};

export default Profile;
