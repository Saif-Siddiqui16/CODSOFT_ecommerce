import { Button } from "@/components/ui/button";
import React from "react";

interface AdminHeaderProps {
  onAddProduct: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onAddProduct }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <Button
        onClick={onAddProduct}
        className="bg-amber-500 hover:bg-amber-600"
      >
        Add Product
      </Button>
    </div>
  );
};

export default AdminHeader;
