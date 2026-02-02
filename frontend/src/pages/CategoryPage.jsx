import { useEffect } from "react";
import { useProductStore } from "../stores/zustand/useProductStore";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Product from "../components/Product";
import { useLazyGetProductsByCategoryQuery } from "../stores/api/productApi";
import { useState } from "react";

const CategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [lastCursor, setLastCursor] = useState(null);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get("category");
  const [trigger, { data, isLoading }] = useLazyGetProductsByCategoryQuery();

  useEffect(() => {
    const fetchInitial = async () => {
      const res = await trigger({ category, cursor: null, limit: 2 }).unwrap();
      setProducts(res.products);
      setLastCursor(res.lastCursor);
    };
    fetchInitial();
  }, [category]);

  const handleLoadMore = async () => {
    if (lastCursor) {
      const res = await trigger({
        category,
        cursor: lastCursor,
        limit: 2,
      }).unwrap();
      setProducts((prev) => [...prev, ...res.products]);
      setLastCursor(res.lastCursor);
    }
  };
  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h1
          className="text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </motion.h1>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {products?.length === 0 && (
            <h2 className="text-3xl font-semibold text-gray-300 text-center col-span-full">
              No products found
            </h2>
          )}

          {products?.map((product) => (
            <Product key={product._id} product={product} />
          ))}
          {products?.length > 0 && (
            <button onClick={handleLoadMore} disabled={isLoading}>
              {isLoading ? "Loading..." : "Load More"}
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
};
export default CategoryPage;
