import { useNavigate } from "react-router-dom";

const CheckoutCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center space-y-6">
      <h1 className="text-3xl font-bold text-red-500">Payment Canceled ❌</h1>
      <p>Your payment was canceled. You can try again anytime.</p>
      <button
        onClick={() => navigate("/cart")}
        className="bg-gray-600 text-white px-6 py-2 rounded"
      >
        Return to Cart
      </button>
    </div>
  );
};

export default CheckoutCancel;
