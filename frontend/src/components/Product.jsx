import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../stores/zustand/userUserStore";
import toast from "react-hot-toast";
import { useCartStore } from "../stores/zustand/useCartStore";
import { useAddToCartMutation } from "../stores/api/cartApi";
const Product = ({ product }) => {
  const [addToCartMutation, { isLoading, error }] = useAddToCartMutation();
  const setCart = useCartStore((state) => state.setCart);
  const { user } = useUserStore();

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("please login to add products to cart", { id: "login" });
      return;
    }
    try {
      const result = await addToCartMutation(product._id).unwrap();
      
      setCart(result);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add product");
    }
  };
  return (
    <div className="flex w-52 h-100 relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg">
      <div className="relative mx-3 mt-3 flex h-50 overflow-hidden rounded-xl">
        <img className=" w-full " src={product.image} alt="product image" />
        {/* <div className='absolute inset-0 bg-black bg-opacity-20' /> */}
      </div>

      <div className="mt-4 px-5 pb-5 h-50">
        <h5 className="text-xl font-semibold tracking-tight text-white">
          {product.name}
        </h5>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-emerald-400">
              ${product.price}
            </span>
          </p>
        </div>
        <button
          className="flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium
					 text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          onClick={handleAddToCart}
          disabled={isLoading}
        >
          <ShoppingCart size={22} className="mr-2" />
          {isLoading ? "Adding..." : "Add to Cart"}
        </button>
        {error && <p className="error">Error adding item</p>}
      </div>
    </div>
  );
};
export default Product;
