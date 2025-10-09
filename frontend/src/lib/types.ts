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
export interface User {
  _id: string;
  userName: string;
  email: string;
  role: "user" | "admin";
  createdAt?: string;
  updatedAt?: string;
}

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

export const CATEGORIES = [
  "Accessories",
  "Electronics",
  "Shoes",
  "Clothing",
  "Home",
  "Stationery",
  "Sports",
  "Beauty & Personal Care",
  "Books",
  "Toys & Games",
  "Kitchen & Dining",
  "Outdoor & Garden",
  "Automotive",
  "Health & Wellness",
  "Other",
];
