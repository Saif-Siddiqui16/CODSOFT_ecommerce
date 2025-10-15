import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAppDispatch, useAppSelector } from "@/data/hook";
import type { RootState } from "@/store/store";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { logoutUser } from "@/store/auth-slice";

const Header = () => {
  const { isAuthenticated, user } = useAppSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleAdminPage = () => navigate("/admin");
  const handleLogout = () => dispatch(logoutUser());

  return (
    <header className="h-[100px] w-full bg-amber-300 flex items-center px-4 md:px-10 shadow-md">
      <div className="hidden md:flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold tracking-wide">Ecommerce App</h1>
        {user && (
          <nav className="flex gap-6 font-medium text-gray-800">
            <Link to="/" className="hover:underline">
              Home
            </Link>

            <Link to="/profile" className="hover:underline">
              Profile
            </Link>
            {user.role === "user" && (
              <>
                <Link to="/cart" className="hover:underline">
                  Cart
                </Link>
                <Link to="/orders" className="hover:underline">
                  Orders
                </Link>
              </>
            )}
            {isAuthenticated && <Button onClick={handleLogout}>Logout</Button>}
            {user?.role === "admin" && (
              <Button onClick={handleAdminPage}>Admin Home</Button>
            )}
          </nav>
        )}
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between w-full">
        <h1 className="text-xl font-bold">Ecommerce App</h1>
        <Sheet>
          <SheetTrigger className="text-black font-semibold border px-3 py-1 rounded-md">
            Menu
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle className="text-xl">Navigation</SheetTitle>
              <div className="flex flex-col items-start mt-4 gap-4">
                {user && (
                  <>
                    <Link to="/" className="hover:underline">
                      Home
                    </Link>

                    <Link to="/profile" className="hover:underline">
                      Profile
                    </Link>
                    {user.role === "user" && (
                      <>
                        <Link to="/cart" className="hover:underline">
                          Cart
                        </Link>
                        <Link to="/orders" className="hover:underline">
                          Orders
                        </Link>
                      </>
                    )}
                  </>
                )}
                {isAuthenticated && (
                  <Button onClick={handleLogout} className="w-full">
                    Logout
                  </Button>
                )}

                {user?.role === "admin" && (
                  <>
                    <Button onClick={handleAdminPage} className="w-full">
                      Admin Home
                    </Button>
                  </>
                )}
              </div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
