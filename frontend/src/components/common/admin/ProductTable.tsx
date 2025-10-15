import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import { useAppDispatch } from "@/data/hook";
import { deleteProduct, fetchProducts } from "@/store/shop/product-slice";

interface ProductTableProps {
  products: Product[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit }) => {
  const dispatch = useAppDispatch();
  if (products.length === 0) return <p>No products found.</p>;

  const handleDelete = async (id: string) => {
    await dispatch(deleteProduct(id));
    dispatch(fetchProducts());
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product._id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>${product.price}</TableCell>
            <TableCell className="flex gap-2">
              <Button onClick={() => onEdit(product._id)}>Edit</Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(product._id)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductTable;
