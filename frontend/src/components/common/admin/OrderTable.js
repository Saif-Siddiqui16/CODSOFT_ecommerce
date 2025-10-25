import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHeader, TableRow, } from "@/components/ui/table";
const OrderTable = ({ orders, onStatusChange, onDeleteOrder, }) => {
    if (!orders || orders.length === 0)
        return _jsx("p", { children: "No orders yet." });
    return (_jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Order ID" }), _jsx(TableCell, { children: "User ID" }), _jsx(TableCell, { children: "Total" }), _jsx(TableCell, { children: "Status" }), _jsx(TableCell, { children: "Actions" })] }) }), _jsx(TableBody, { children: orders.map((order) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: order._id }), _jsx(TableCell, { children: order.userId }), _jsxs(TableCell, { children: ["$", order.totalAmount.toFixed(2)] }), _jsx(TableCell, { children: order.orderStatus }), _jsxs(TableCell, { className: "flex gap-2", children: [order.orderStatus !== "Delivered" &&
                                    order.orderStatus !== "Cancelled" && (_jsxs(_Fragment, { children: [_jsx(Button, { className: "bg-green-500 hover:bg-green-600", onClick: () => onStatusChange(order._id, "Delivered"), children: "Delivered" }), _jsx(Button, { variant: "destructive", onClick: () => onStatusChange(order._id, "Cancelled"), children: "Cancel" })] })), _jsx(Button, { variant: "destructive", onClick: () => onDeleteOrder(order._id), children: "Delete" })] })] }, order._id))) })] }));
};
export default OrderTable;
