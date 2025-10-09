import Pagination from "@/components/common/Pagination";
import ProductCard from "@/components/common/ProductCard";
import { useAppDispatch, useAppSelector } from "@/data/hook";
import type { Product } from "@/lib/types";
import { addToCart } from "@/store/shop/cart-slice";
import { fetchProducts } from "@/store/shop/product-slice";
import type { RootState } from "@/store/store";
import { useCallback, useEffect, useMemo, useState } from "react";

const ShoppingHome = () => {
  const dispatch = useAppDispatch();
  const { productList: products, isLoading } = useAppSelector(
    (state: RootState) => state.product
  );

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 6;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const allCategories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).filter(Boolean),
    [products]
  );

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSortOption(e.target.value);
      setCurrentPage(1);
    },
    []
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
    },
    []
  );

  const handleAddToCart = useCallback(
    (product: Product) => {
      dispatch(addToCart({ productId: product._id }));
    },
    [dispatch]
  );

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) =>
        selectedCategories.length
          ? selectedCategories.includes(p.category)
          : true
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
  }, [products, selectedCategories, searchTerm, sortOption]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Shop Products</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search products..."
          className="border px-3 py-2 rounded w-full md:w-1/2"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
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
            <p>Loading products...</p>
          ) : currentProducts.length === 0 ? (
            <p>No products match your filters.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingHome;
