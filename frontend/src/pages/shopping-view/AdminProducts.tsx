import { Button } from "@/components/ui/button";

const AdminProducts = () => {
  const products = [];

  const handleCreate = () => {};
  const handleEdit = (id: string) => {};
  const handleDelete = (id: string) => {};

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Products</h1>
      <Button
        onClick={handleCreate}
        className="mb-4 bg-amber-500 hover:bg-amber-600"
      >
        Create Product
      </Button>
      <div className="space-y-4">
        {products.map((product: any) => (
          <div
            key={product.id}
            className="border p-4 rounded bg-white flex justify-between items-center"
          >
            <span>{product.name}</span>
            <div className="flex gap-2">
              <Button onClick={() => handleEdit(product.id)}>Edit</Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(product.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
