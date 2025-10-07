import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/data/hook";

import { fetchCartItems } from "@/store/shop/cart-slice";
import { Button } from "@/components/ui/button";
import axios from "axios";
import type { RootState } from "@/store/store";
import { fetchAllAddresses } from "@/store/shop/address-slice";

// Types
interface Address {
  _id: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const Checkout = () => {
  const dispatch = useAppDispatch();
  const { cartItems = [] } = useAppSelector((state: RootState) => state.cart);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchAddresses = async () => {
    const data = await dispatch(fetchAllAddresses());
    setAddresses(data.payload);
  };
  console.log(addresses);

  useEffect(() => {
    dispatch(fetchCartItems());
    fetchAddresses();
  }, []);

  // Calculate total
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.productId.price * item.quantity,
    0
  );

  // Handle Stripe Checkout
  const handleCheckout = async () => {
    if (!selectedAddressId) {
      alert("Please select an address!");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/user/payment/create-checkout-session",
        {
          cartItems,
          addressId: selectedAddressId,
          totalAmount,
        },
        { withCredentials: true }
      );

      window.location.href = response.data.url;
    } catch (err) {
      console.error("Stripe checkout failed:", err);
      alert("Payment failed, try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Checkout</h1>

      {/* Cart Overview */}
      <div className="border p-4 rounded-lg space-y-4">
        <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <div className="space-y-2">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between">
                <span>
                  {item.productId.name} x {item.quantity}
                </span>
                <span>
                  ${(item.productId.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <hr />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Address Selection */}
      <div className="border p-4 rounded-lg space-y-2">
        <h2 className="text-xl font-semibold mb-2">Select Address</h2>
        {addresses.length === 0 ? (
          <p>No addresses found. Please add an address in your profile.</p>
        ) : (
          addresses.map((addr) => (
            <label
              key={addr._id}
              className="flex items-center gap-2 border p-2 rounded hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="radio"
                name="address"
                value={addr._id}
                checked={selectedAddressId === addr._id}
                onChange={() => setSelectedAddressId(addr._id)}
                className="form-radio"
              />
              <span>
                <p>{addr.address}</p>
                <p>{addr.city}</p>
                <p>{addr.phone}</p>
                <p>{addr.pincode}</p>
              </span>
            </label>
          ))
        )}
      </div>

      {/* Payment */}
      <div>
        <Button
          onClick={handleCheckout}
          disabled={cartItems.length === 0 || !selectedAddressId || isLoading}
          className="bg-amber-500 hover:bg-amber-600 w-full"
        >
          {isLoading ? "Processing..." : `Pay $${totalAmount.toFixed(2)}`}
        </Button>
      </div>
    </div>
  );
};

export default Checkout;
