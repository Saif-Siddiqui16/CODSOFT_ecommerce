import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAppDispatch, useAppSelector } from "@/data/hook";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchAllAddresses } from "@/store/shop/address-slice";
import { fetchCartItems } from "@/store/shop/cart-slice";
import axios from "axios";
import { validateCoupon } from "@/store/shop/discount-slice";
import { API_BASE_URL } from "@/store/auth-slice";
const Checkout = () => {
    const dispatch = useAppDispatch();
    const { cartItems } = useAppSelector((state) => state.cart);
    const { validatedCoupon, error: couponError } = useAppSelector((state) => state.coupon);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [coupon, setCoupon] = useState("");
    const fetchAddresses = useCallback(async () => {
        let isMounted = true;
        try {
            const data = await dispatch(fetchAllAddresses()).unwrap();
            if (isMounted && data) {
                setAddresses(data);
            }
        }
        catch (error) {
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
        return cartItems.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);
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
            const response = await axios.post(`${API_BASE_URL}/api/user/payment/create-checkout-session`, {
                cartItems,
                addressId: selectedAddressId,
                totalAmount,
            }, { withCredentials: true });
            window.location.href = response.data.url;
        }
        catch (err) {
            console.error("Stripe checkout failed:", err);
            alert("Payment failed, try again!");
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleCouponApply = async () => {
        if (!coupon.trim())
            return;
        try {
            await dispatch(validateCoupon(coupon.trim())).unwrap();
        }
        catch (err) {
            console.error("Coupon validation failed:", err);
        }
    };
    const addressList = useMemo(() => addresses.map((addr) => (_jsxs("label", { className: "flex items-center gap-2 border p-2 rounded hover:bg-gray-50 cursor-pointer", children: [_jsx("input", { type: "radio", name: "address", value: addr._id, checked: selectedAddressId === addr._id, onChange: () => setSelectedAddressId(addr._id), className: "form-radio" }), _jsxs("span", { children: [_jsx("p", { children: addr.address }), _jsx("p", { children: addr.city }), _jsx("p", { children: addr.phone }), _jsx("p", { children: addr.pincode })] })] }, addr._id))), [addresses, selectedAddressId]);
    return (_jsxs("div", { className: "container mx-auto p-6 space-y-6", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Checkout" }), _jsxs("div", { className: "border p-4 rounded-lg space-y-4", children: [_jsx("h2", { className: "text-xl font-semibold mb-2", children: "Order Summary" }), cartItems.length === 0 ? (_jsx("p", { children: "Your cart is empty" })) : (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: coupon, onChange: (e) => setCoupon(e.target.value), placeholder: "Coupon code", className: "border px-3 py-2 rounded w-full md:w-1/2" }), _jsx(Button, { onClick: handleCouponApply, className: "bg-amber-500 hover:bg-amber-600", children: "Apply" })] }), cartItems.map((item) => (_jsxs("div", { className: "flex justify-between", children: [_jsxs("span", { children: [item.productId.name, " x ", item.quantity] }), _jsxs("span", { children: ["$", (item.productId.price * item.quantity).toFixed(2)] })] }, item._id))), _jsx("hr", {}), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Subtotal" }), _jsxs("span", { children: ["$", subtotal.toFixed(2)] })] }), validatedCoupon && (_jsxs("div", { className: "flex justify-between text-green-600 font-medium", children: [_jsxs("span", { children: ["Discount (", validatedCoupon.code, ")"] }), _jsxs("span", { children: ["- $", discountAmount.toFixed(2)] })] })), _jsxs("div", { className: "flex justify-between font-bold border-t pt-2 mt-2", children: [_jsx("span", { children: "Total" }), _jsxs("span", { children: ["$", totalAmount.toFixed(2)] })] }), couponError && (_jsx("p", { className: "text-red-600 text-sm mt-1", children: couponError }))] }))] }), _jsxs("div", { className: "border p-4 rounded-lg space-y-2", children: [_jsx("h2", { className: "text-xl font-semibold mb-2", children: "Select Address" }), addresses.length === 0 ? (_jsx("p", { children: "No addresses found. Please add an address in your profile." })) : (addressList)] }), _jsx("div", { children: _jsx(Button, { onClick: handleCheckout, disabled: cartItems.length === 0 || !selectedAddressId || isLoading, className: "bg-amber-500 hover:bg-amber-600 w-full", children: isLoading ? "Processing..." : `Pay $${totalAmount.toFixed(2)}` }) })] }));
};
export default Checkout;
