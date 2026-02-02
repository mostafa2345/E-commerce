import { useParams, Link } from "react-router-dom";
import { useGetOrderQuery } from "../stores/api/orderApi";
import { format } from "date-fns";
import {
  Loader2,
  ArrowLeft,
  Package,
  CreditCard,
  Truck,
  CheckCircle,
} from "lucide-react";
import { useOrderStore } from "../stores/zustand/useOrderStore";
import { useEffect } from "react";

export default function OrderDetailsPage() {
  const { id } = useParams();
 
// const orders=useOrderStore((state)=>state.orders)
 const { data: order, isLoading,isError,error } = useGetOrderQuery(id);

console.log(error);
const setOrder = useOrderStore((state) => state.setOrder);
// let order = orders?.find((o) => o._id === id);
  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      payment_failed: "bg-red-100 text-red-800",
      completed: "bg-green-100 text-green-800",
    };

    return (
      <span
        className={`px-3 py-1 text-sm font-medium rounded-full ${
          statusClasses[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status.replace(/_/g, " ")}
      </span>
    );
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      pending: <Package className="w-5 h-5 text-yellow-500" />,
      processing: <Package className="w-5 h-5 text-blue-500" />,
      shipped: <Truck className="w-5 h-5 text-indigo-500" />,
      delivered: <CheckCircle className="w-5 h-5 text-green-500" />,
      completed: <CheckCircle className="w-5 h-5 text-green-500" />,
    };
    return statusIcons[status] || <Package className="w-5 h-5 text-gray-400" />;
  };
useEffect(() => {
  if (order) {
    setOrder(order);
  }
}, [order]);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="p-4 text-red-600 bg-red-100 rounded-lg">
         {error.data?.message}
        </div>
        <Link
          to="/orders"
          className="inline-flex items-center mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="mb-6">
        <Link
          to="/orders"
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Orders
        </Link>
        <div className="flex items-center justify-between mt-4">
          <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
          <div className="flex items-center space-x-2">
            {getStatusIcon(order.status)}
            {getStatusBadge(order.status)}
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Placed on{" "}
          {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-lg font-semibold">Order Items</h2>
            <div className="divide-y divide-gray-200">
              {order.products.map((item) => (
                <div key={item._id} className="flex py-4">
                  <div className="flex-shrink-0 w-20 h-20 overflow-hidden border border-gray-200 rounded-md">
                    {item.product?.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="object-cover object-center w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-gray-100">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 ml-4">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {item.product?.name || "Product not available"}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="mt-2 font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

     
      </div>
    </div>
  );
}
