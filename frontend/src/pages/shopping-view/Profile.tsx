import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppDispatch } from "@/data/hook";
import {
  addNewAddress,
  deleteAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";

// Dummy data placeholders (replace with Redux selectors / API calls)
const dummyUser = { username: "John Doe", email: "john@example.com" };

const dummyOrders = [
  { id: "1", totalAmount: 120, status: "Delivered", date: "2025-10-07" },
  { id: "2", totalAmount: 45, status: "Pending", date: "2025-10-05" },
];

const Profile: React.FC = () => {
  const [addresses, setAddresses] = useState([]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address: "",
    city: "",
    pincode: "",
    phone: "",
  });
  const handleDeleteAddress = async (id: string) => {
    try {
      await dispatch(deleteAddress(id));
      fetchAddress(); // Refresh list automatically
    } catch (err) {
      console.error("Failed to delete address", err);
    }
  };
  const handleEditAddress = (id: string) => {
    navigate(`/address/${id}`);
  };
  const handleCreateAddress = async () => {
    try {
      await dispatch(addNewAddress(newAddress));
      setNewAddress({ address: "", city: "", pincode: "", phone: "" });
      setIsDialogOpen(false);
      fetchAddress();
    } catch (err) {
      console.error("Failed to add address", err);
    }
  };

  const fetchAddress = async () => {
    const data = await dispatch(fetchAllAddresses());
    console.log("data", data);
    if (data.payload) {
      setAddresses(data.payload);
    }
  };
  useEffect(() => {
    fetchAddress();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* User Info */}
      <section className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p>
          <strong>Username:</strong> {dummyUser.username}
        </p>
        <p>
          <strong>Email:</strong> {dummyUser.email}
        </p>
      </section>

      {/* Addresses */}
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
              {/* Form */}
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
          {addresses.map((addr) => (
            <div
              key={addr.id}
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
          ))}
        </div>
      </section>

      {/* Orders */}
      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Orders</h2>
        <div className="space-y-3">
          {dummyOrders.map((order) => (
            <div
              key={order.id}
              className="border p-3 rounded flex justify-between items-center"
            >
              <div>
                <p>Order ID: {order.id}</p>
                <p>Total Amount: ${order.totalAmount}</p>
                <p>Status: {order.status}</p>
                <p>Date: {order.date}</p>
              </div>
              <Button variant="outline">View Details</Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Profile;
