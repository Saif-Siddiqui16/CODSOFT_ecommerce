import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@/components/ui/button";
const AddressForm = ({ onSubmit, initialData }) => {
    const [form, setForm] = useState({
        _id: initialData?._id || "",
        userId: initialData?.userId || "",
        address: initialData?.address || "",
        city: initialData?.city || "",
        pincode: initialData?.pincode || "",
        phone: initialData?.phone || "",
    });
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-3 border p-4 rounded bg-white", children: [_jsx("input", { name: "address", value: form.address, onChange: handleChange, placeholder: "Address", className: "input input-bordered w-full" }), _jsx("input", { name: "city", value: form.city, onChange: handleChange, placeholder: "City", className: "input input-bordered w-full" }), _jsx("input", { name: "pincode", value: form.pincode, onChange: handleChange, placeholder: "Pincode", className: "input input-bordered w-full" }), _jsx("input", { name: "phone", value: form.phone, onChange: handleChange, placeholder: "Phone", className: "input input-bordered w-full" }), _jsx(Button, { type: "submit", className: "w-full bg-amber-500 hover:bg-amber-600", children: "Save Address" })] }));
};
export default AddressForm;
