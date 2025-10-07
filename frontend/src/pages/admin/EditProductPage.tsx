/*
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { products, type Product } from "@/data/products";
import ProductForm from "@/components/common/ProductForm";

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  useEffect(() => {
    const found = products.find((p) => p.id === Number(id));
    if (found) {
      setProductToEdit(found);
    } else {
      alert("Product not found");
      navigate("/");
    }
  }, [id]);

  const handleUpdate = (updated: Product) => {
    const index = products.findIndex((p) => p.id === updated.id);
    if (index !== -1) {
      products[index] = updated;
      alert("Product updated!");
      navigate("/");
    }
  };

  if (!productToEdit) return null;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <ProductForm initialData={productToEdit} onSubmit={handleUpdate} />
    </div>
  );
};

export default EditProductPage;
*/
