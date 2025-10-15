import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES } from "@/lib/types";
import { useEffect, useState, type FormEvent } from "react";

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: File | string;
}

interface ProductFormProps {
  initialData?: ProductFormData;
  onSubmit: (data: FormData) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit }) => {
  const [form, setForm] = useState<ProductFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    category: initialData?.category || "Accessories",
    image: initialData?.image || undefined,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.description || !form.price || !form.category) {
      alert("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price.toString());
    formData.append("category", form.category);

    if (form.image && form.image instanceof File) {
      formData.append("image", form.image);
    } else if (typeof form.image === "string") {
      formData.append("existingImage", form.image);
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <Label>Name</Label>
        <Input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product name"
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Product description"
        />
      </div>

      <div>
        <Label>Price ($)</Label>
        <Input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          min={0}
          step={0.01}
        />
      </div>

      <div>
        <Label>Category</Label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
          required
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Image</Label>
        <Input type="file" onChange={handleFileChange} />
        {typeof form.image === "string" && (
          <img
            src={form.image}
            alt="Product"
            className="mt-2 w-32 h-32 object-cover rounded"
          />
        )}
      </div>

      <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
        {initialData ? "Update Product" : "Create Product"}
      </Button>
    </form>
  );
};

export default ProductForm;
