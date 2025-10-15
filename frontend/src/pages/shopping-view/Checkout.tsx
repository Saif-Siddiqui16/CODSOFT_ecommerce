import { useAppDispatch, useAppSelector } from "@/data/hook";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { fetchAllAddresses } from "@/store/shop/address-slice";
import { fetchCartItems } from "@/store/shop/cart-slice";
import type { RootState } from "@/store/store";
import axios from "axios";
import { validateCoupon } from "@/store/shop/discount-slice";
import { API_BASE_URL } from "@/store/auth-slice";

export interface Address {
  _id: string;
  address: string;
  city: string;
  phone: string;
  pincode: string;
}

const Checkout = () => {
  const dispatch = useAppDispatch();

  const { cartItems } = useAppSelector((state: RootState) => state.cart);
  const { validatedCoupon, error: couponError } = useAppSelector(
    (state) => state.coupon
  );

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [coupon, setCoupon] = useState<string>("");

  const fetchAddresses = useCallback(async () => {
    let isMounted = true;
    try {
      const data = await dispatch(fetchAllAddresses()).unwrap();
      if (isMounted && data) {
        setAddresses(data);
      }
    } catch (error) {
      console.error("Failed to load addresses:", error);
    }
    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCartItems());
    fetchAddresses();
  }, [dispatch, fetchAddresses]);

  useEffect(() => {
    if (addresses.length > 0) {
      console.log("Fetched addresses:", addresses);
    }
  }, [addresses]);

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => acc + item.productId.price * item.quantity,
      0
    );
  }, [cartItems]);

  const discountAmount = useMemo(() => {
    return validatedCoupon
      ? (validatedCoupon.discountPercent / 100) * subtotal
      : 0;
  }, [validatedCoupon, subtotal]);

  const totalAmount = useMemo(() => {
    return subtotal - discountAmount;
  }, [subtotal, discountAmount]);

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      alert("Please select an address!");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/user/payment/create-checkout-session`,
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

  const handleCouponApply = async () => {
    if (!coupon.trim()) return;
    try {
      await dispatch(validateCoupon(coupon.trim())).unwrap();
    } catch (err) {
      console.error("Coupon validation failed:", err);
    }
  };

  const addressList = useMemo(
    () =>
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
      )),
    [addresses, selectedAddressId]
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Checkout</h1>

      <div className="border p-4 rounded-lg space-y-4">
        <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Coupon code"
                className="border px-3 py-2 rounded w-full md:w-1/2"
              />
              <Button
                onClick={handleCouponApply}
                className="bg-amber-500 hover:bg-amber-600"
              >
                Apply
              </Button>
            </div>

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
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {validatedCoupon && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Discount ({validatedCoupon.code})</span>
                <span>- ${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between font-bold border-t pt-2 mt-2">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>

            {couponError && (
              <p className="text-red-600 text-sm mt-1">{couponError}</p>
            )}
          </div>
        )}
      </div>

      <div className="border p-4 rounded-lg space-y-2">
        <h2 className="text-xl font-semibold mb-2">Select Address</h2>
        {addresses.length === 0 ? (
          <p>No addresses found. Please add an address in your profile.</p>
        ) : (
          addressList
        )}
      </div>

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
