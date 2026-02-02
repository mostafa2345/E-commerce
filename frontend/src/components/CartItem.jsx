import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../stores/zustand/useCartStore";
import { useEffect } from "react";
import {
 
  useRemoveFromCartMutation,
  useUpdateQuantityMutation,
} from "../stores/api/cartApi";
import { toast } from "react-toastify";

const CartItem = ({ item }) => {
  // const {removeFromCart,updateQuantity,getCartItems}=useCartStore()
  
  const [removeFromCart, { isLoading: isRemoving, error: removeError }] =
    useRemoveFromCartMutation();

  const [updateQuantity, { isLoading: isUpdating, error: updateError }] =
    useUpdateQuantityMutation();
 
  const handleRemove = async () => {
    try {
      await removeFromCart(item._id).unwrap();
      toast.success("Item removed");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to remove item");
    }
  };
  const handleUpdateQuantity = async (quantity) => {
    try {
      await updateQuantity({ productId: item._id, quantity }).unwrap();
      toast.success("Quantity updated");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update quantity");
    }
  };
  return (
    <div
      key={item.id}
      className="rounded-lg border p-4 shadow-sm border-gray-700 bg-gray-800 md:p-6"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="shrink-0 md:order-1">
          <img
            className="h-20 w-40 md:h-32 rounded object-cover"
            src={item.image}
          />
        </div>
        <label className="sr-only">Choose quantity:</label>

        <div className="flex items-center justify-between md:order-3 md:justify-end">
          <div className="flex items-center gap-2">
            <button
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border
							 border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2
							  focus:ring-emerald-500"
              onClick={() => handleUpdateQuantity(item.quantity - 1)}
            >
              <Minus className="text-gray-300" />
            </button>
            <p>{item.quantity}</p>
            <button
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border
							 border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none 
						focus:ring-2 focus:ring-emerald-500"
              onClick={() => handleUpdateQuantity(item.quantity + 1)}
            >
              <Plus className="text-gray-300" />
            </button>
          </div>

          <div className="text-end md:order-4 md:w-32">
            <p className="text-base font-bold text-emerald-400">
              ${item.price}
            </p>
          </div>
        </div>

        <div className="w-full min-w-0 flex-1 space-y-4 sm:order-2 sm:max-w-md sm">
          <p className="text-base font-medium text-white hover:text-emerald-400 hover:underline">
            {item.name}
          </p>
          <p className="text-sm text-gray-400">{item.description}</p>

          <div className="flex items-center gap-4">
            <button
              className="inline-flex items-center text-sm font-medium text-red-400
							 hover:text-red-300 hover:underline"
              onClick={() => handleRemove()}
            >
              {isRemoving ? "Removing..." : "Remove"}
              <Trash />
            </button>
            {removeError && <p className="error">Error removing item</p>}
            {updateError && <p className="error">Error updating quantity</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CartItem;
