import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ProductForm from "@/components/common/admin/ProductForm";
import { useAppDispatch } from "@/data/hook";
import { fetchProductDetails, updateProduct } from "@/store/shop/product-slice";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const EditProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const dispatch = useAppDispatch();
    useEffect(() => {
        const fetchProduct = async () => {
            if (!id)
                return;
            const result = await dispatch(fetchProductDetails(id));
            if (result.meta.requestStatus === "fulfilled") {
                setProduct(result.payload);
            }
            else {
                alert("Failed to fetch product details.");
                navigate("/");
            }
        };
        fetchProduct();
    }, [id, dispatch, navigate]);
    // ✅ FIXED: Expect ProductFormData instead of FormData
    const handleUpdate = async (data) => {
        if (!id)
            return;
        await dispatch(updateProduct({ id, data }));
        alert("Product updated!");
        navigate("/admin");
    };
    if (!product)
        return null;
    return (_jsxs("div", { className: "min-h-screen p-6 bg-gray-50", children: [_jsx("h1", { className: "text-3xl font-bold mb-6", children: "Edit Product" }), _jsx(ProductForm, { initialData: product, onSubmit: handleUpdate })] }));
};
export default EditProductPage;
