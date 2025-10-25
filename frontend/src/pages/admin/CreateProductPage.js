import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ProductForm from "@/components/common/admin/ProductForm";
import { useAppDispatch } from "@/data/hook";
import { createProduct } from "@/store/shop/product-slice";
import { useNavigate } from "react-router-dom";
const CreateProductPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const handleCreate = async (data) => {
        console.log("Submit new product:", data);
        const response = await dispatch(createProduct(data));
        console.log(response);
        alert("Product created!");
        navigate("/");
    };
    return (_jsxs("div", { className: "min-h-screen p-6 bg-gray-50", children: [_jsx("h1", { className: "text-3xl font-bold mb-6", children: "Create New Product" }), _jsx(ProductForm, { onSubmit: handleCreate })] }));
};
export default CreateProductPage;
