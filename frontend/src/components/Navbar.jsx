import {
  ShoppingCart,
  UserPlus,
  LogIn,
  LogOut,
  Lock,
  InboxIcon,
  Search,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/zustand/userUserStore";
import { useCartStore } from "../stores/zustand/useCartStore";
import { useGetCartItemsQuery } from "../stores/api/cartApi";
import { useSearchProductsQuery } from "../stores/api/productApi";
import { useEffect, useState, useRef } from "react";
import {
  Paper,
  InputBase,
  IconButton,
  TextField,
  List,
  ListItemButton,
  ListItemIcon,
  ListItem,
  ListItemText,
  Box,
  Typography,
} from "@mui/material";
import { useDebounce } from "../lib/useDebounce";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);
  const [error, setError] = useState(false);
  const { user, logout } = useUserStore();
  const { cart } = useCartStore();
  const { data: cartData } = useGetCartItemsQuery();
  const setCart = useCartStore((state) => state.setCart);

  useEffect(() => {
    if (cartData) setCart(cartData);
  }, [cartData]);

  const debouncedQuery = useDebounce(query, 500);
  const { data: searchData, isFetching } = useSearchProductsQuery(
    { query: debouncedQuery }, // Limit to 5 results for the dropdown
    { skip: !debouncedQuery || debouncedQuery.length < 3 },
  );

  const searchResults = searchData || [];
  useEffect(() => {
    if (isFetching) {
      console.log("Search query is running with:", debouncedQuery);
    }
  }, [isFetching, debouncedQuery]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setError(value.length > 0 && value.length < 3);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleResultClick = (productId) => {
    navigate(`/product/${productId}`);
    setQuery("");
    setIsSearchFocused(false);
  };
  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center flex-wrap   gap-1.5">
          <Link
            to="/"
            className="text-2xl font-bold text-emerald-400 items-center space-x-2 flex"
          >
            E-Commerce
          </Link>

          <div className="relative max-w-md w-full" ref={searchRef}>
            <Paper className="flex items-center w-full px-2 py-1 border border-gray-300 rounded">
              <Search className="text-gray-400 mr-2" size={20} />
              <InputBase
                placeholder="Search products..."
                className="flex-1"
                inputProps={{ "aria-label": "search products" }}
                value={query}
                onChange={handleChange}
                onFocus={handleSearchFocus}
              />
            </Paper>

            {isSearchFocused && query.length > 0 && (
              <Paper
                className="absolute left-0 right-0 mt-1 max-h-96 overflow-auto shadow-lg z-50"
                elevation={3}
              >
                {isFetching ? (
                  <Box className="p-4 text-center text-gray-500">
                    <Typography>Searching...</Typography>
                  </Box>
                ) : searchResults.length > 0 ? (
                  <List>
                    {searchResults.map((product) => (
                      <ListItemButton
                        key={product._id}
                        onClick={() => handleResultClick(product._id)}
                        className="hover:bg-gray-100"
                      >
                        <ListItemText
                          primary={product.name}
                          secondary={`$${product.price?.toFixed(2) || "0.00"}`}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                ) : query.length >= 3 ? (
                  <Box className="p-4 text-center text-gray-500">
                    <Typography>No products found</Typography>
                  </Box>
                ) : null}
              </Paper>
            )}

            {error && (
              <Typography
                color="error"
                variant="caption"
                className="absolute -bottom-5 left-0"
              >
                Minimum 3 characters required
              </Typography>
            )}
          </div>

          <nav className="flex  items-center gap-4">
            {user && (
              <>
                <Link
                  to={"/"}
                  className="text-gray-300 hover:text-emerald-400 transition duration-300
					 ease-in-out"
                >
                  Home
                </Link>
                <Link to={"/cart"} className="relative group">
                  <ShoppingCart
                    className=" inline-block mr-1 group-hover:text-emerald-400"
                    size={20}
                  />
                  <span className="hidden sm:inline">Cart</span>
                  {Array.isArray(cart) && cart.length > 0 && (
                    <span className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 	text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out">
                      {cart.length}
                    </span>
                  )}
                </Link>
                <Link to="/orders" className="hover:text-gray-300">
                  My Orders
                </Link>
              </>
            )}
            {user?.role === "admin" && (
              <Link
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
								 transition duration-300 ease-in-out flex items-center"
                to={"/secret-dashboard"}
              >
                <Lock className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {user ? (
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
						rounded-md flex items-center transition duration-300 ease-in-out"
                onClick={logout}
              >
                <LogOut size={18} />
                <span className="hidden sm:inline ml-2">Log Out</span>
              </button>
            ) : location.pathname === "/login" ? (
              <Link
                to={"/signup"}
                className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out"
              >
                <UserPlus className="mr-2" size={18} />
                Sign Up
              </Link>
            ) : location.pathname === "/signup" ? (
              <Link
                to={"/login"}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out"
              >
                <LogIn className="mr-2" size={18} />
                Login
              </Link>
            ) : (
              <>
                <Link
                  to={"/login"}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <LogIn className="mr-2" size={18} />
                  Login
                </Link>
                <Link
                  to={"/signup"}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <UserPlus className="mr-2" size={18} />
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
//  <Link
//                   to={"/signup"}
//                   className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4
// 									rounded-md flex items-center transition duration-300 ease-in-out"
//                 >
//                   <UserPlus className="mr-2" size={18} />
//                   Sign Up
//                 </Link>
//                 <Link
//                   to={"/login"}
//                   className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4
// 									rounded-md flex items-center transition duration-300 ease-in-out"
//                 >
//                   <LogIn className="mr-2" size={18} />
//                   Login
//                 </Link>
