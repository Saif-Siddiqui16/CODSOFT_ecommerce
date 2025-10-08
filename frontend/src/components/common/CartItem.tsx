import { Button } from "@/components/ui/button";
import type { CartItems } from "@/lib/types";

import React, { useEffect, useState, useCallback } from "react";

interface Props {
  item: CartItems;
  onRemove: (id: string) => void;
  onUpdateQuantity: (itemId: string, qty: number) => void;
}

const CartItem: React.FC<Props> = ({ item, onRemove, onUpdateQuantity }) => {
  const [localQty, setLocalQty] = useState(item.quantity);

  // Sync local quantity with Redux quantity only when it changes
  useEffect(() => {
    setLocalQty(item.quantity);
  }, [item.quantity]);

  const handleIncrement = useCallback(() => {
    const newQty = localQty + 1;
    setLocalQty(newQty);
    onUpdateQuantity(item._id, newQty); // Optimistic update
  }, [localQty, item._id, onUpdateQuantity]);

  const handleDecrement = useCallback(() => {
    if (localQty <= 1) return;
    const newQty = localQty - 1;
    setLocalQty(newQty);
    onUpdateQuantity(item._id, newQty); // Optimistic update
  }, [localQty, item._id, onUpdateQuantity]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Math.max(1, +e.target.value);
      setLocalQty(val);
      onUpdateQuantity(item._id, val);
    },
    [item._id, onUpdateQuantity]
  );

  return (
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
            onChange={handleInputChange}
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
  );
};

export default CartItem;
