import CartItem from "@/components/common/CartItem";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/data/hook";
import {
  fetchCartItems,
  deleteCartItem,
  updateCartQuantity,
} from "@/store/shop/cart-slice";
import type { RootState } from "@/store/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { cartItems = [], isLoading } = useAppSelector(
    (state: RootState) => state.cart
  );

  const { user } = useAppSelector((state: RootState) => state.auth);
  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  const handleRemove = async (itemId: string) => {
    try {
      await dispatch(deleteCartItem({ itemId })).unwrap();
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      await dispatch(updateCartQuantity({ itemId, quantity })).unwrap();
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };
  const handleCheckout = async () => {
    navigate("/checkout");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <p>Loading cart items...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <CartItem
              key={item._id}
              item={item}
              onRemove={handleRemove}
              onUpdateQuantity={handleUpdateQuantity}
            />
          ))}
        </div>
      )}
      <div className="flex items-center justify-center">
        {user?.role === "user" && (
          <Button className="cursor-pointer" onClick={handleCheckout}>
            CheckOut
          </Button>
        )}
      </div>
    </div>
  );
};

export default Cart;
