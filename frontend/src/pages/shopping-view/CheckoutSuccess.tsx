import type { PaymentInfo } from "@/lib/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CheckoutSuccess = () => {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const sessionId = new URLSearchParams(location.search).get("session_id");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/user/payment/verify-session/${sessionId}`,
          { withCredentials: true }
        );
        setPaymentInfo(res.data);
      } catch (err) {
        console.error("Failed to verify payment:", err);
      } finally {
        setLoading(false);
      }
    };
    if (sessionId) verifyPayment();
  }, [sessionId]);

  if (loading) return <p className="text-center mt-10">Verifying payment...</p>;

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center space-y-6">
      <h1 className="text-3xl font-bold text-green-600">
        Payment Successful 🎉
      </h1>
      {paymentInfo ? (
        <>
          <p>
            Thank you! You paid{" "}
            <strong>${(paymentInfo.amount_total / 100).toFixed(2)}</strong>.
          </p>
          <p>Receipt sent to: {paymentInfo.customer_email}</p>
          <button
            onClick={() => navigate("/orders")}
            className="bg-amber-500 text-white px-6 py-2 rounded"
          >
            View My Orders
          </button>
        </>
      ) : (
        <p>Could not load payment details.</p>
      )}
    </div>
  );
};

export default CheckoutSuccess;
