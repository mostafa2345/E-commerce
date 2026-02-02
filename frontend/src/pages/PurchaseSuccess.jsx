// pages/PurchaseSuccess.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const PurchaseSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      navigate("/");
      return;
    }


   
    
  }, [sessionId,navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8"
      >
        <div className="flex justify-center mb-6">
          <CheckCircle className="text-green-500 w-20 h-20" />
        </div>

        <h1 className="text-3xl font-bold text-center text-green-500 mb-4">
          Payment Successful!
        </h1>

        <p className="text-gray-300 text-center mb-6">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-400 text-center">
            Redirecting you to your orders...
          </p>
        </div>

        <button
          onClick={() => navigate("/orders")}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition"
        >
          View My Orders
        </button>
      </motion.div>
    </div>
  );
};

export default PurchaseSuccess;
