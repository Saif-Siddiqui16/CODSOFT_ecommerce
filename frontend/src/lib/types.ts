export interface ProductType {
  id: string;
  name: string;
  price: number;
  category?: string;
  image: string;
  description?: string;
}
export interface CartItemType {
  product: ProductType;
  quantity: number;
}
export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
}

export interface User {
  id: string;
  userName: string;
  email: string;
  role: "user" | "admin";
}

export interface CartItem {
  productId: string;
  quantity: number;
  product?: Product;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

export interface Address {
  id: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  cartItems: OrderItem[];
  totalAmount: number;
  orderStatus: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  addressInfo: Address;
  payment?: any;
  orderDate: string;
  orderUpdateDate: string;
}
