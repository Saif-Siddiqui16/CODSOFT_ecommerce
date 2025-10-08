// -------------------------
// 🛍️ Product
// -------------------------
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

// -------------------------
// 👤 User
// -------------------------
export interface User {
  _id: string;
  userName: string;
  email: string;
  role: "user" | "admin";
  createdAt?: string;
  updatedAt?: string;
}

// -------------------------
// 🏠 Address
// -------------------------
export interface Address {
  _id: string;
  userId: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  createdAt?: string;
  updatedAt?: string;
}

// -------------------------
// 🛒 Cart
// -------------------------
export interface CartItems {
  _id: string;
  productId: Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItems[];
  createdAt?: string;
  updatedAt?: string;
}

// -------------------------
// 💳 Payment
// -------------------------
export interface Payment {
  _id: string;
  orderId: string;
  userId: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentId: string;
  amountPaid: number;
  paymentDate: string;
  createdAt?: string;
  updatedAt?: string;
}

// -------------------------
// 📦 Order
// -------------------------
export interface OrderItem {
  productId: string | Product;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  userId: string;
  cartId: string;
  cartItems: OrderItem[];
  addressInfo: {
    addressId: string;
    address: string;
    city: string;
    pincode: string;
    phone: string;
  };
  orderStatus: "Pending" | "Paid" | "Shipped" | "Delivered" | "Cancelled";
  totalAmount: number;
  orderDate: string;
  orderUpdateDate: string;
  paymentId?: string | Payment;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentInfo {
  amount_total: number;
  customer_email: string;
  payment_status: string;
}
