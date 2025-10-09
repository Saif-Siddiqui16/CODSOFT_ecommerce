import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Order } from "@/lib/types";

interface OrderTableProps {
  orders: Order[];
  onStatusChange: (orderId: string, status: Order["orderStatus"]) => void;
  onDeleteOrder: (orderId: string) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  onStatusChange,
  onDeleteOrder,
}) => {
  if (!orders || orders.length === 0) return <p>No orders yet.</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>Order ID</TableCell>
          <TableCell>User ID</TableCell>
          <TableCell>Total</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order._id}>
            <TableCell>{order._id}</TableCell>
            <TableCell>{order.userId}</TableCell>
            <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
            <TableCell>{order.orderStatus}</TableCell>
            <TableCell className="flex gap-2">
              {order.orderStatus !== "Delivered" &&
                order.orderStatus !== "Cancelled" && (
                  <>
                    <Button
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => onStatusChange(order._id, "Delivered")}
                    >
                      Delivered
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => onStatusChange(order._id, "Cancelled")}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              <Button
                variant="destructive"
                onClick={() => onDeleteOrder(order._id)}
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

export default OrderTable;
