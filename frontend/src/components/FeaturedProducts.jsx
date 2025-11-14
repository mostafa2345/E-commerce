import Slider from "react-slick";
import { useCartStore } from "../stores/useCartStore";
import {ShoppingCart} from 'lucide-react'
const FeaturedProducts = ({ featuredProducts }) => {
	const {addToCart}=useCartStore()
  const settings = {
    dots: true,          // show navigation dots
    infinite: false,     // disable infinite loop
    speed: 500,          // animation speed
    slidesToShow: 4,     // default items per page
    slidesToScroll: 4,   // how many items to move per click
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 3, slidesToScroll: 3 }
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 2 }
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, slidesToScroll: 1 }
      }
    ]
  };

  return (
    <div className="py-12 container mx-auto px-4">
      <h2 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4">
        Featured
      </h2>
      <Slider {...settings}>
        {featuredProducts.map(product => (
          <div key={product._id} className="px-2 flex flex-shrink-0">
            <div className="flex flex-col h-fullbg-gray bg-opacity-10 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden h-1/2 transition-all duration-300 hover:shadow-xl border border-emerald-500/30">
              <div className="overflow-hidden border-b-2 border-b-blue-950">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                />
              </div>
              <div className="p-4 flex flex-col flex-grow ">
                <h3 className="text-lg font-semibold mb-2 text-white">{product.name}</h3>
                <p className="text-emerald-300 font-medium mb-4">
                  ${product.price.toFixed(2)}
                </p>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full mt-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded transition-colors duration-300 flex items-center justify-center"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};
export default FeaturedProducts
