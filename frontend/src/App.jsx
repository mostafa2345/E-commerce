import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
// import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/zustand/userUserStore";
import { lazy, Suspense, useEffect } from "react";
import { Home, Loader } from "lucide-react";
import LoadingSpinner from "./components/LoadingSpinner";
// import { AdminPage } from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
// import CartPage from "./pages/CartPage";
import { useCartStore } from "./stores/zustand/useCartStore";
import PurchaseSuccess from "./pages/PurchaseSuccess";
import PurchaseCancel from "./pages/PurchaseCancel";
import CheckoutPage from "./pages/CheckoutPage";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// import OrderDetailsPage from "./pages/OrderDetailsPage";
const SignUpPagePreview = lazy(() => import("./pages/SignupPage"));
const LoginPagePreview = lazy(() => import("./pages/LoginPage"));
const AdminPagePreview = lazy(() => import("./pages/AdminPage"));
const CartPreview = lazy(() => import("./pages/CartPage"));
const CategoryPagePreview = lazy(() => import("./pages/CategoryPage"));
const OrdersPagePreview = lazy(() => import("./pages/OrdersPage"));
const CheckoutPagePreview = lazy(() => import("./pages/CheckoutPage"));
const OrderDetailsPagePreview = lazy(() => import("./pages/OrderDetailsPage"));
const PurchaseSuccessPagePreview = lazy(
  () => import("./pages/PurchaseSuccess"),
);
const PurchaseCancelPagePreview = lazy(() => import("./pages/PurchaseCancel"));
const ProductPagePrev = lazy(() => import("./pages/ProductPage"));
function App() {
  const { user, profile, checkAuth, checkProfile, checkingAuth } =
    useUserStore();

  const { cart, getCartItems } = useCartStore();
  const isAdmin = user?.role;
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  // useEffect(() => {
  //   if (!user) return;

  //   getCartItems();
  // }, [getCartItems, user]);
  // if (checkingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-900 text-white  relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div>
      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/signup"
            element={
              !user ? (
                <Suspense fallback={<LoadingSpinner />}>
                  <SignUpPagePreview />
                </Suspense>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/login"
            element={
              !user ? (
                <Suspense fallback={<LoadingSpinner />}>
                  <LoginPagePreview />
                </Suspense>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/secret-dashboard"
            element={
              isAdmin === "admin" ? (
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminPagePreview />
                </Suspense>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/products"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <CategoryPagePreview />
              </Suspense>
            }
          />
          <Route
            path="/cart"
            element={
              !user ? (
                <LoginPage />
              ) : (
                <Suspense fallback={<LoadingSpinner />}>
                  <CartPreview />
                </Suspense>
              )
            }
          />
          <Route
            path="/purchase-success"
            element={
              !user ? (
                <Navigate to="/" />
              ) : (
                <Suspense fallback={<LoadingSpinner />}>
                  <PurchaseSuccessPagePreview />
                </Suspense>
              )
            }
          />
          <Route
            path="/purchase-cancel"
            element={
              !user ? (
                <Navigate to="/" />
              ) : (
                <Suspense fallback={<LoadingSpinner />}>
                  <PurchaseCancelPagePreview />
                </Suspense>
              )
            }
          />
          <Route
            path="/orders"
            element={
              !user ? (
                <Navigate to="/" />
              ) : (
                <Suspense fallback={<LoadingSpinner />}>
                  <OrdersPagePreview />
                </Suspense>
              )
            }
          />
          <Route
            path="/product/:id"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ProductPagePrev />
              </Suspense>
            }
          />

          <Route
            path="/orders/:id"
            element={
              !user ? (
                <Navigate to="/" />
              ) : (
                <Suspense fallback={<LoadingSpinner />}>
                  <OrderDetailsPagePreview />
                </Suspense>
              )
            }
          />
          <Route
            path="/checkout"
            element={
              !user ? (
                <Navigate to="/" />
              ) : !cart?.length ? (
                <Navigate to="/" />
              ) : (
                <Suspense fallback={<LoadingSpinner />}>
                  <CheckoutPagePreview />
                </Suspense>
              )
            }
          />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
