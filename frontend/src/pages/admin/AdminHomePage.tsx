import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "@/components/common/admin/AdminHeader";
import ProductTable from "@/components/common/admin/ProductTable";
import OrderTable from "@/components/common/admin/OrderTable";
import Pagination from "@/components/common/Pagination";
import { useAppDispatch, useAppSelector } from "@/data/hook";
import { fetchProducts, deleteProduct } from "@/store/shop/product-slice";
import {
  fetchAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "@/store/shop/order-slice";
import type { RootState } from "@/store/store";
import type { Order } from "@/lib/types";

const ITEMS_PER_PAGE = 5;

const AdminHomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { productList } = useAppSelector((state: RootState) => state.product);
  const { orders } = useAppSelector((state: RootState) => state.orders);

  const [productPage, setProductPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);

  const totalProductPages = Math.ceil(
    (productList?.length ?? 0) / ITEMS_PER_PAGE
  );
  const totalOrderPages = Math.ceil((orders?.length ?? 0) / ITEMS_PER_PAGE);

  const paginatedProducts =
    productList?.slice(
      (productPage - 1) * ITEMS_PER_PAGE,
      productPage * ITEMS_PER_PAGE
    ) ?? [];

  const paginatedOrders =
    orders?.slice(
      (orderPage - 1) * ITEMS_PER_PAGE,
      orderPage * ITEMS_PER_PAGE
    ) ?? [];

  const handleAddProduct = () => navigate("/admin/products/add");
  const handleEditProduct = (id: string) =>
    navigate(`/admin/products/edit/${id}`);

  const handleDeleteProduct = (id: string) => {
    dispatch(deleteProduct(id)).then(() => {
      dispatch(fetchProducts());
    });
  };

  const handleStatusChange = (
    orderId: string,
    status: Order["orderStatus"]
  ) => {
    dispatch(updateOrderStatus({ orderId, status })).then(() => {
      dispatch(fetchAllOrders());
    });
  };

  const handleDeleteOrder = (orderId: string) => {
    dispatch(deleteOrder(orderId)).then(() => {
      dispatch(fetchAllOrders());
    });
  };

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <AdminHeader onAddProduct={handleAddProduct} />

      <section>
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <ProductTable
          products={paginatedProducts}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
        <Pagination
          currentPage={productPage}
          totalPages={totalProductPages}
          onPageChange={setProductPage}
        />
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Orders</h2>
        <OrderTable
          orders={paginatedOrders}
          onStatusChange={handleStatusChange}
          onDeleteOrder={handleDeleteOrder}
        />
        <Pagination
          currentPage={orderPage}
          totalPages={totalOrderPages}
          onPageChange={setOrderPage}
        />
      </section>
    </div>
  );
};

export default AdminHomePage;
