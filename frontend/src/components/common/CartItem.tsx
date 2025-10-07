import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { CartItemType } from "@/lib/types";

interface Props {
  item: CartItemType;
  onRemove: (id: string) => void;
  onUpdateQuantity: (itemId: string, qty: number) => void;
}

const CartItem: React.FC<Props> = ({ item, onRemove, onUpdateQuantity }) => {
  const [localQty, setLocalQty] = useState(item.quantity);

  // Only update localQty if Redux quantity changes significantly
  useEffect(() => {
    if (item.quantity !== localQty) setLocalQty(item.quantity);
  }, [item.quantity]);

  const handleIncrement = () => {
    const newQty = localQty + 1;
    setLocalQty(newQty);
    onUpdateQuantity(item._id, newQty); // Optimistic update
  };

  const handleDecrement = () => {
    if (localQty <= 1) return;
    const newQty = localQty - 1;
    setLocalQty(newQty);
    onUpdateQuantity(item._id, newQty); // Optimistic update
  };

  return (
    <div>
      <div className="flex items-center justify-between border-b py-4 hover:bg-gray-50 transition duration-150">
        <img
          src={item.productId.image}
          alt={item.productId.name}
          className="w-20 h-20 object-cover rounded"
        />

        <div className="flex-1 ml-4">
          <h3 className="font-semibold">{item.productId.name}</h3>
          <p className="text-gray-600">${item.productId.price}</p>

          <div className="flex items-center mt-2 gap-2">
            <button
              onClick={handleDecrement}
              className="px-2 py-1 border rounded hover:bg-gray-200"
              disabled={localQty <= 1}
            >
              -
            </button>
            <input
              type="number"
              min={1}
              value={localQty}
              onChange={(e) => {
                const val = Math.max(1, +e.target.value);
                setLocalQty(val);
                onUpdateQuantity(item._id, val);
              }}
              className="w-16 border rounded px-2 py-1 text-center"
            />
            <button
              onClick={handleIncrement}
              className="px-2 py-1 border rounded hover:bg-gray-200"
            >
              +
            </button>
          </div>
        </div>

        <Button
          variant="destructive"
          onClick={() => onRemove(item._id)}
          className="ml-4"
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
