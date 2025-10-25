import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/data/hook";
import { editaAddress, fetchAllAddresses } from "@/store/shop/address-slice";
const EditAddressPage = () => {
    const { addressId } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [form, setForm] = useState({
        address: "",
        city: "",
        pincode: "",
        phone: "",
    });
    useEffect(() => {
        const fetchAddress = async () => {
            if (!addressId)
                return;
            const response = await dispatch(fetchAllAddresses());
            const existing = response.payload.find((addr) => addr._id === addressId);
            if (existing) {
                setForm({
                    address: existing.address,
                    city: existing.city,
                    pincode: existing.pincode,
                    phone: existing.phone,
                });
            }
        };
        fetchAddress();
    }, [addressId, dispatch]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!addressId)
            return;
        try {
            await dispatch(editaAddress({ addressId, formData: form })).unwrap();
            navigate("/profile");
        }
        catch (err) {
            console.error("Failed to update address:", err);
        }
    };
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold mb-6", children: "Edit Address" }), _jsxs("form", { onSubmit: handleSubmit, className: "bg-white p-6 rounded shadow space-y-4 max-w-md", children: [_jsxs("div", { children: [_jsx("label", { className: "block mb-1 font-medium", children: "Address" }), _jsx(Input, { name: "address", value: form.address, onChange: handleChange, placeholder: "Street Address", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1 font-medium", children: "City" }), _jsx(Input, { name: "city", value: form.city, onChange: handleChange, placeholder: "City", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1 font-medium", children: "Pincode" }), _jsx(Input, { name: "pincode", value: form.pincode, onChange: handleChange, placeholder: "Pincode", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1 font-medium", children: "Phone" }), _jsx(Input, { name: "phone", value: form.phone, onChange: handleChange, placeholder: "Phone Number", required: true })] }), _jsx(Button, { type: "submit", className: "w-full bg-amber-500 hover:bg-amber-600", children: "Update Address" })] })] }));
};
export default EditAddressPage;
