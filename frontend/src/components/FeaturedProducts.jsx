import Slider from "react-slick";
import { useCartStore } from "../stores/zustand/useCartStore";
import { ShoppingCart } from "lucide-react";
import { useAddToCartMutation } from "../stores/api/cartApi";
import { toast } from "react-toastify";
import { useState } from "react";
import Product from "./Product";
const FeaturedProducts = ({ featuredProducts }) => {
  const [addToCart, { isLoading, isError }] = useAddToCartMutation();
  const [loadingId, setLoadingId] = useState(null);
  const setCart = useCartStore((state) => state.setCart);
  const settings = {
    dots: true, // show navigation dots
    infinite: false, // disable infinite loop
    speed: 500, // animation speed
    slidesToShow: 4, // default items per page
    slidesToScroll: 4, // how many items to move per click
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 3, slidesToScroll: 3 },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };
  const handleAddToCart = async (productId) => {
    try {
      setLoadingId(productId);
      const result = await addToCart(productId).unwrap();
      setCart(result);
      toast.success("product added successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingId(null);
    }
  };
  return (
    <div className="py-12 container mx-auto px-4">
      <h2 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4">
        Featured
      </h2>
      <Slider {...settings}>
       
          {featuredProducts.map((product) => (
            <Product product={product} />
          ))}
      
      </Slider>
    </div>
  );
};
export default FeaturedProducts;
