import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";

interface Props {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<Props> = React.memo(({ product, onAddToCart }) => {
  const [added, setAdded] = useState(false);

  const handleAdd = useCallback(() => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }, [onAddToCart, product]);

  return (
    <div className="border rounded-lg shadow hover:shadow-lg overflow-hidden bg-white">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-gray-600 text-sm">{product.category}</p>
        <p className="text-amber-600 font-bold mt-2">${product.price}</p>
        <Button
          className={`mt-4 w-full ${
            added
              ? "bg-green-500 hover:bg-green-500"
              : "bg-amber-500 hover:bg-amber-600"
          }`}
          onClick={handleAdd}
          disabled={added}
        >
          {added ? "Added!" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
});

export default ProductCard;
