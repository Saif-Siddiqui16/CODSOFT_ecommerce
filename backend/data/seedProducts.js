import mongoose from "mongoose";
import Product from "../models/Product.js";
import dotenv from "dotenv";

dotenv.config();
const MONGO_URI = process.env.MONGOURI;

const dummyProducts = [
  {
    name: "Leather Wallet",
    description: "Premium leather wallet made from genuine leather.",
    price: 29.99,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=60",
    category: "Accessories",
  },
  {
    name: "Bluetooth Speaker",
    description: "Portable Bluetooth speaker with crystal-clear sound.",
    price: 59.99,
    image:
      "https://images.unsplash.com/photo-1585386959984-a415522316a0?auto=format&fit=crop&w=500&q=60",
    category: "Electronics",
  },
  {
    name: "Running Shoes",
    description: "Lightweight and comfortable running shoes.",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=500&q=60",
    category: "Shoes",
  },
  {
    name: "Backpack",
    description: "Durable and stylish everyday backpack.",
    price: 49.99,
    image:
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=500&q=60",
    category: "Accessories",
  },
  {
    name: "Sunglasses",
    description: "UV-protected stylish sunglasses.",
    price: 19.99,
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=500&q=60",
    category: "Accessories",
  },
  {
    name: "Smart Watch",
    description: "Track your fitness and receive notifications easily.",
    price: 199.99,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=60",
    category: "Electronics",
  },
  {
    name: "Gaming Mouse",
    description: "High precision RGB gaming mouse for performance.",
    price: 39.99,
    image:
      "https://images.unsplash.com/photo-1610337673044-7203d47b66df?auto=format&fit=crop&w=500&q=60",
    category: "Electronics",
  },
  {
    name: "T-shirt",
    description: "100% cotton t-shirt with a soft and comfy feel.",
    price: 14.99,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=60",
    category: "Clothing",
  },
  {
    name: "Jeans",
    description: "Classic blue denim jeans for everyday wear.",
    price: 49.99,
    image:
      "https://images.unsplash.com/photo-1583002482921-1c2c4b6cb9e0?auto=format&fit=crop&w=500&q=60",
    category: "Clothing",
  },
  {
    name: "Desk Lamp",
    description: "LED desk lamp with adjustable brightness.",
    price: 24.99,
    image:
      "https://images.unsplash.com/photo-1616627451141-5e76c1f38d5b?auto=format&fit=crop&w=500&q=60",
    category: "Home",
  },
  {
    name: "Coffee Mug",
    description: "Ceramic mug for your daily coffee routine.",
    price: 9.99,
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=500&q=60",
    category: "Home",
  },
  {
    name: "Notebook",
    description: "Premium 100-page notebook for daily notes.",
    price: 4.99,
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=500&q=60",
    category: "Stationery",
  },
  {
    name: "Pen Set",
    description: "Set of 5 high-quality gel pens for smooth writing.",
    price: 7.99,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=500&q=60",
    category: "Stationery",
  },
  {
    name: "Wireless Earbuds",
    description: "Noise-cancelling wireless earbuds with long battery life.",
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1590031905471-5f67b7b0b01a?auto=format&fit=crop&w=500&q=60",
    category: "Electronics",
  },
  {
    name: "Hoodie",
    description: "Warm cotton hoodie for everyday comfort.",
    price: 39.99,
    image:
      "https://images.unsplash.com/photo-1618354691373-d851c2c1d9a9?auto=format&fit=crop&w=500&q=60",
    category: "Clothing",
  },
  {
    name: "Water Bottle",
    description: "Reusable stainless steel water bottle.",
    price: 19.99,
    image:
      "https://images.unsplash.com/photo-1526401485004-2fda9f4f3f48?auto=format&fit=crop&w=500&q=60",
    category: "Accessories",
  },
  {
    name: "Yoga Mat",
    description: "Non-slip yoga mat for your workout sessions.",
    price: 29.99,
    image:
      "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=500&q=60",
    category: "Sports",
  },
  {
    name: "Dumbbell Set",
    description: "Adjustable dumbbell set for home workouts.",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=500&q=60",
    category: "Sports",
  },
  {
    name: "Table Lamp",
    description: "Modern table lamp to light up your space.",
    price: 34.99,
    image:
      "https://images.unsplash.com/photo-1582719478181-2cf4e1b2d5a2?auto=format&fit=crop&w=500&q=60",
    category: "Home",
  },
  {
    name: "Sneakers",
    description: "Casual sneakers for everyday use.",
    price: 59.99,
    image:
      "https://images.unsplash.com/photo-1606813902773-9c3a1f43b04b?auto=format&fit=crop&w=500&q=60",
    category: "Shoes",
  },
];
const seedProducts = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Product.deleteMany({});
    console.log("🧹 Existing products deleted");

    const result = await Product.insertMany(dummyProducts);
    console.log(`✅ ${result.length} products inserted successfully`);

    mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error seeding products:", error);
  }
};

seedProducts();
