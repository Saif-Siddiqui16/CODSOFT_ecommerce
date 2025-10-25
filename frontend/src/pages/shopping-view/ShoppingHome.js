import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Pagination from "@/components/common/Pagination";
import ProductCard from "@/components/common/ProductCard";
import { useAppDispatch, useAppSelector } from "@/data/hook";
import { addToCart } from "@/store/shop/cart-slice";
import { fetchProducts } from "@/store/shop/product-slice";
import { useCallback, useEffect, useMemo, useState } from "react";
const ShoppingHome = () => {
    const dispatch = useAppDispatch();
    const { productList: products = [], isLoading } = useAppSelector((state) => state.product);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [sortOption, setSortOption] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);
    const allCategories = useMemo(() => Array.from(new Set((products || []).map((p) => p.category))).filter(Boolean), [products]);
    const handleCategoryChange = useCallback((category) => {
        setSelectedCategories((prev) => prev.includes(category)
            ? prev.filter((c) => c !== category)
            : [...prev, category]);
        setCurrentPage(1);
    }, []);
    const handleSortChange = useCallback((e) => {
        setSortOption(e.target.value);
        setCurrentPage(1);
    }, []);
    const handleSearchChange = useCallback((e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    }, []);
    const handleAddToCart = useCallback((product) => {
        dispatch(addToCart({ productId: product._id }));
    }, [dispatch]);
    const filteredProducts = useMemo(() => {
        if (!products)
            return [];
        return products
            .filter((p) => selectedCategories.length
            ? selectedCategories.includes(p.category)
            : true)
            .filter((p) => searchTerm
            ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.category.toLowerCase().includes(searchTerm.toLowerCase())
            : true)
            .sort((a, b) => {
            if (sortOption === "price-asc")
                return a.price - b.price;
            if (sortOption === "price-desc")
                return b.price - a.price;
            if (sortOption === "name-asc")
                return a.name.localeCompare(b.name);
            if (sortOption === "name-desc")
                return b.name.localeCompare(a.name);
            return 0;
        });
    }, [products, selectedCategories, searchTerm, sortOption]);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const currentProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredProducts, currentPage, itemsPerPage]);
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold mb-6", children: "Shop Products" }), _jsx("div", { className: "flex flex-col md:flex-row gap-4 mb-6", children: _jsx("input", { type: "text", value: searchTerm, onChange: handleSearchChange, placeholder: "Search products...", className: "border px-3 py-2 rounded w-full md:w-1/2" }) }), _jsxs("div", { className: "flex flex-col md:flex-row gap-6", children: [_jsxs("div", { className: "md:w-1/4", children: [_jsx("h2", { className: "text-xl font-semibold mb-2", children: "Filter by Category" }), _jsx("div", { className: "space-y-2", children: allCategories.length === 0 ? (_jsx("p", { className: "text-gray-500", children: "No categories available" })) : (allCategories.map((category) => (_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: selectedCategories.includes(category), onChange: () => handleCategoryChange(category) }), _jsx("span", { children: category })] }, category)))) })] }), _jsxs("div", { className: "md:w-3/4 flex-1", children: [_jsxs("div", { className: "flex justify-between mb-4", children: [_jsxs("span", { children: [filteredProducts.length, " products found"] }), _jsxs("select", { value: sortOption, onChange: handleSortChange, className: "border rounded px-3 py-1", children: [_jsx("option", { value: "", children: "Sort By" }), _jsx("option", { value: "price-asc", children: "Price: Low to High" }), _jsx("option", { value: "price-desc", children: "Price: High to Low" }), _jsx("option", { value: "name-asc", children: "Name: A-Z" }), _jsx("option", { value: "name-desc", children: "Name: Z-A" })] })] }), isLoading ? (_jsx("p", { children: "Loading products..." })) : currentProducts.length === 0 ? (_jsx("p", { children: "No products match your filters." })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: currentProducts.map((product) => (_jsx(ProductCard, { product: product, onAddToCart: handleAddToCart }, product._id))) }), _jsx(Pagination, { currentPage: currentPage, totalPages: totalPages, onPageChange: setCurrentPage })] }))] })] })] }));
};
export default ShoppingHome;
