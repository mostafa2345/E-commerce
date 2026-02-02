// pages/PurchaseCancel.jsx
import { useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { XCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const PurchaseCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      navigate("/");
      return;
    }

    toast.error("Payment cancelled");
  }, [sessionId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8"
      >
        <div className="flex justify-center mb-6">
          <XCircle className="text-red-500 w-20 h-20" />
        </div>

        <h1 className="text-3xl font-bold text-center text-red-500 mb-4">
          Payment Cancelled
        </h1>

        <p className="text-gray-300 text-center mb-6">
          Your payment was cancelled. No charges were made.
        </p>

        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-400 text-center">
            Your cart items are still saved. You can try again anytime.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            to="/cart"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center"
          >
            <ArrowLeft className="mr-2" size={18} />
            Back to Cart
          </Link>

          <Link
            to="/"
            className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-3 rounded-lg transition flex items-center justify-center"
          >
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PurchaseCancel;
