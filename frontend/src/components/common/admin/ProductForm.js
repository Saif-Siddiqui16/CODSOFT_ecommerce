import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES } from "@/lib/types";
import { useEffect, useState } from "react";
const ProductForm = ({ initialData, onSubmit }) => {
    const [form, setForm] = useState({
        name: initialData?.name || "",
        description: initialData?.description || "",
        price: initialData?.price || 0,
        category: initialData?.category || "Accessories",
        image: initialData?.image || undefined,
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "price" ? Number(value) : value,
        }));
    };
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setForm((prev) => ({ ...prev, image: file }));
        }
    };
    useEffect(() => {
        if (initialData) {
            setForm(initialData);
        }
    }, [initialData]);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.description || !form.price || !form.category) {
            alert("All fields are required");
            return;
        }
        onSubmit(form);
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 max-w-lg", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "name", children: "Name" }), _jsx(Input, { id: "name", type: "text", name: "name", value: form.name, onChange: handleChange, placeholder: "Product name" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "description", children: "Description" }), _jsx(Textarea, { id: "description", name: "description", value: form.description, onChange: handleChange, placeholder: "Product description" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "price", children: "Price ($)" }), _jsx(Input, { id: "price", type: "number", name: "price", value: form.price, onChange: handleChange, min: 0, step: 0.01 })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "category", children: "Category" }), _jsx("select", { id: "category", name: "category", value: form.category, onChange: handleChange, className: "border rounded px-3 py-2 w-full", required: true, children: CATEGORIES.map((cat) => (_jsx("option", { value: cat, children: cat }, cat))) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "image", children: "Image" }), _jsx(Input, { id: "image", type: "file", onChange: handleFileChange }), typeof form.image === "string" && (_jsx("img", { src: form.image, alt: "Product", className: "mt-2 w-32 h-32 object-cover rounded" }))] }), _jsx(Button, { type: "submit", className: "bg-amber-500 hover:bg-amber-600", children: initialData ? "Update Product" : "Create Product" })] }));
};
export default ProductForm;
