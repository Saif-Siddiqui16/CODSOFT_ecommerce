import type { ProductFormData } from "@/components/common/admin/ProductForm";
import ProductForm from "@/components/common/admin/ProductForm";
import { useAppDispatch } from "@/data/hook";
import { fetchProductDetails, updateProduct } from "@/store/shop/product-slice";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductFormData | null>(null);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const result = await dispatch(fetchProductDetails(id));
      if (result.meta.requestStatus === "fulfilled") {
        setProduct(result.payload);
      } else {
        alert("Failed to fetch product details.");
        navigate("/");
      }
    };
    fetchProduct();
  }, [id, dispatch, navigate]);

  const handleUpdate = (formData: FormData) => {
    dispatch(updateProduct({ id: id!, formData }));
    alert("Product updated!");
    navigate("/admin");
  };

  if (!product) return null;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <ProductForm initialData={product} onSubmit={handleUpdate} />
    </div>
  );
};

export default EditProductPage;
