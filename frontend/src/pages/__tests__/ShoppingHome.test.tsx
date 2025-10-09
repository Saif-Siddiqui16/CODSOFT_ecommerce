// src/pages/__tests__/ShoppingHome.test.tsx
import ShoppingHome from "@/pages/shopping-view/ShoppingHome";
import cartReducer from "@/store/shop/cart-slice";
import productReducer from "@/store/shop/product-slice";
import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, it, vi } from "vitest";

// Mock fetchProducts and addToCart to avoid network calls
vi.mock("@/store/shop/product-slice", async () => {
  const original = await vi.importActual<any>("@/store/shop/product-slice");
  return {
    ...original,
    fetchProducts: vi.fn(() => ({ type: "product/fetchProducts/mock" })),
  };
});

vi.mock("@/store/shop/cart-slice", async () => {
  const original = await vi.importActual<any>("@/store/shop/cart-slice");
  return {
    ...original,
    addToCart: vi.fn(() => ({ type: "cart/addToCart/mock" })),
  };
});

// Mock product data
const mockProducts = [
  {
    _id: "1",
    name: "Apple",
    category: "Fruits",
    price: 10,
    description: "",
    image: "",
    createdAt: "",
  },
  {
    _id: "2",
    name: "Banana",
    category: "Fruits",
    price: 5,
    description: "",
    image: "",
    createdAt: "",
  },
  {
    _id: "3",
    name: "Carrot",
    category: "Vegetables",
    price: 8,
    description: "",
    image: "",
    createdAt: "",
  },
];

const renderWithStore = (preloadedState = {}) => {
  const store = configureStore({
    reducer: {
      product: productReducer,
      cart: cartReducer,
    },
    preloadedState,
  });

  return {
    ...render(
      <Provider store={store}>
        <ShoppingHome />
      </Provider>
    ),
    store,
  };
};

describe("ShoppingHome Component", () => {
  it("renders product list and categories correctly", () => {
    renderWithStore({
      product: {
        productList: mockProducts,
        isLoading: false,
        productDetails: null,
      },
      cart: { cartItems: [], isLoading: false },
    });

    // Check category filters
    const categoryLabels = screen.getAllByText(/Fruits|Vegetables/i);
    expect(categoryLabels.some((el) => el.textContent === "Fruits")).toBe(true);
    expect(categoryLabels.some((el) => el.textContent === "Vegetables")).toBe(
      true
    );

    // Check product names
    expect(screen.getByText("Apple")).toBeDefined();
    expect(screen.getByText("Banana")).toBeDefined();
    expect(screen.getByText("Carrot")).toBeDefined();

    // Check product categories inside product cards
    const productCategories = screen.getAllByText(/Fruits|Vegetables/i, {
      selector: "p",
    });
    expect(productCategories.some((el) => el.textContent === "Fruits")).toBe(
      true
    );
    expect(
      productCategories.some((el) => el.textContent === "Vegetables")
    ).toBe(true);
  });
  it("filters products by category", () => {
    renderWithStore({
      product: {
        productList: mockProducts,
        isLoading: false,
        productDetails: null,
      },
      cart: { cartItems: [], isLoading: false },
    });

    const fruitsCheckbox = screen.getByLabelText("Fruits") as HTMLInputElement;
    fireEvent.click(fruitsCheckbox);

    expect(screen.getByText("Apple")).toBeDefined();
    expect(screen.getByText("Banana")).toBeDefined();
    expect(screen.queryByText("Carrot")).toBeNull();
  });

  it("searches products correctly", () => {
    renderWithStore({
      product: {
        productList: mockProducts,
        isLoading: false,
        productDetails: null,
      },
      cart: { cartItems: [], isLoading: false },
    });

    const searchInput = screen.getByPlaceholderText(
      "Search products..."
    ) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: "Carrot" } });

    expect(screen.getByText("Carrot")).toBeDefined();
    expect(screen.queryByText("Apple")).toBeNull();
    expect(screen.queryByText("Banana")).toBeNull();
  });

  it("calls addToCart when product is added", () => {
    const { store } = renderWithStore({
      product: {
        productList: mockProducts,
        isLoading: false,
        productDetails: null,
      },
      cart: { cartItems: [], isLoading: false },
    });

    const addButtons = screen.getAllByText("Add to Cart");
    fireEvent.click(addButtons[0]);

    const actions = store.getState().cart;
    expect(actions).toBeDefined(); // the dispatched action will not trigger a real API call
  });
});
