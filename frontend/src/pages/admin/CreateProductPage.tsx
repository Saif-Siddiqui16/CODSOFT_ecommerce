import type { ProductFormData } from "@/components/common/admin/ProductForm";
import ProductForm from "@/components/common/admin/ProductForm";
import { useAppDispatch } from "@/data/hook";
import { createProduct } from "@/store/shop/product-slice";
import { useNavigate } from "react-router-dom";

const CreateProductPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleCreate = async (data: ProductFormData) => {
    console.log("Submit new product:", data);
    const response = await dispatch(createProduct(data));
    console.log(response);
    alert("Product created!");
    navigate("/");
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Create New Product</h1>
      <ProductForm onSubmit={handleCreate} />
    </div>
  );
};

export default CreateProductPage;
