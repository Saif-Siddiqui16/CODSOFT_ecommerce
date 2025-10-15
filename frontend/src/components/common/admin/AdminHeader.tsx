import { Button } from "@/components/ui/button";
import React from "react";
import { useNavigate } from "react-router-dom";

interface AdminHeaderProps {
  onAddProduct: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onAddProduct }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <Button
        onClick={() => navigate("/coupons")}
        className="bg-amber-500 hover:bg-amber-600"
      >
        Add/Delete Coupons
      </Button>
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
