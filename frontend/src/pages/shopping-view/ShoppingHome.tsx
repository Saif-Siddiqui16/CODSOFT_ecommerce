import { useEffect, useState } from "react";
import ProductCard from "@/components/common/ProductCard";

import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/data/hook";
import { fetchProducts } from "@/store/shop/product-slice";
import type { RootState } from "@/store/store";
import { addToCart } from "@/store/shop/cart-slice";

const ShoppingHome = () => {
  const dispatch = useAppDispatch();
  const { productList: products, isLoading } = useAppSelector(
    (state: RootState) => state.product
  );

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [coupon, setCoupon] = useState<string>("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const allCategories = Array.from(
    new Set(products.map((p) => p.category))
  ).filter(Boolean);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCouponApply = () => {
    console.log("Coupon applied:", coupon);
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({ productId: product._id }));
  };

  // 🔹 Filter & sort
  const filteredProducts = products
    .filter((p) =>
      selectedCategories.length ? selectedCategories.includes(p.category) : true
    )
    .filter((p) =>
      searchTerm
        ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    )
    .sort((a, b) => {
      if (sortOption === "price-asc") return a.price - b.price;
      if (sortOption === "price-desc") return b.price - a.price;
      if (sortOption === "name-asc") return a.name.localeCompare(b.name);
      if (sortOption === "name-desc") return b.name.localeCompare(a.name);
      return 0;
    });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Shop Products</h1>

      {/* Search & Coupon */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search products..."
          className="border px-3 py-2 rounded w-full md:w-1/2"
        />
        <div className="flex gap-2">
          <input
            type="text"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Coupon code"
            className="border px-3 py-2 rounded w-full md:w-1/2"
          />
          <Button
            onClick={handleCouponApply}
            className="bg-amber-500 hover:bg-amber-600"
          >
            Apply
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Categories */}
        <div className="md:w-1/4">
          <h2 className="text-xl font-semibold mb-2">Filter by Category</h2>
          <div className="space-y-2">
            {allCategories.length === 0 ? (
              <p className="text-gray-500">No categories available</p>
            ) : (
              allCategories.map((category) => (
                <label key={category} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <span>{category}</span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="md:w-3/4 flex-1">
          <div className="flex justify-between mb-4">
            <span>{filteredProducts.length} products found</span>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="border rounded px-3 py-1"
            >
              <option value="">Sort By</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A-Z</option>
              <option value="name-desc">Name: Z-A</option>
            </select>
          </div>

          {isLoading ? (
            <p>isLoading products...</p>
          ) : filteredProducts.length === 0 ? (
            <p>No products match your filters.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingHome;
