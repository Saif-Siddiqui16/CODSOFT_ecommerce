import { render, screen, fireEvent } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import Header from "@/components/common/Header";
import authReducer, { logoutUser } from "@/store/auth-slice";

const mockNavigate = vi.fn();
const dispatchMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useAppSelector and useAppDispatch hooks
const mockState = {
  auth: {
    isAuthenticated: true,
    user: { id: "1", userName: "Admin", email: "a@a.com", role: "admin" },
  },
};

vi.mock("@/data/hook", () => ({
  useAppDispatch: () => dispatchMock,
  useAppSelector: (selector: any) => selector(mockState),
}));

vi.mock("@/store/auth-slice", async () => {
  const actual = await vi.importActual<typeof import("@/store/auth-slice")>(
    "@/store/auth-slice"
  );
  return {
    ...actual,
    logoutUser: vi.fn(),
  };
});

const renderWithStore = (ui: React.ReactNode, preloadedState = mockState) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

// --- Tests ---
describe("Header Component", () => {
  test("renders links and buttons correctly for admin", () => {
    renderWithStore(<Header />);

    // Desktop Links
    expect(screen.getByText(/^Home$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Cart$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Profile$/i)).toBeInTheDocument();

    // Buttons
    expect(screen.getByText(/^Logout$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Admin Home$/i)).toBeInTheDocument();
  });

  test("calls logout when logout button is clicked", () => {
    renderWithStore(<Header />);

    const logoutBtn = screen.getByText(/^Logout$/i);
    fireEvent.click(logoutBtn);

    expect(dispatchMock).toHaveBeenCalled();
    expect(logoutUser).toHaveBeenCalled();
  });
});
