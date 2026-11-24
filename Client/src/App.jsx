import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Home from "@/Home";
import RouteLoader from "@/components/RouteLoader";
import { gsap, useMotion } from "@/lib/motion";

// The home page ships in the main bundle; other pages load when visited.
const Shop = lazy(() => import("@/components/Shop"));
const Bag = lazy(() => import("@/components/Bag"));
const Login = lazy(() => import("@/components/Login"));
const ProductDetail = lazy(() => import("@/components/ProductDetail"));
const NotFound = lazy(() => import("@/components/NotFound"));
const AdminRedirect = lazy(() => import("@/components/AdminRedirect"));
const Account = lazy(() => import("@/components/Account"));
const Checkout = lazy(() => import("@/components/Checkout"));
const TestPayment = lazy(() => import("@/components/TestPayment"));
const OrderStatus = lazy(() => import("@/components/OrderStatus"));

// Start each page at the top instead of keeping the previous page's scroll,
// unless the link points at a section (#new).
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

// Each new page eases in rather than snapping into place.
const RouteTransition = () => {
  const { pathname } = useLocation();
  useMotion(
    () => {
      gsap.fromTo(
        "#main",
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out", clearProps: "all" },
      );
    },
    { dependencies: [pathname] },
  );
  return null;
};

const App = () => (
  <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "") || "/"}>
    <>
      <ScrollToTop />
      <RouteTransition />
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <div className="flex min-h-svh flex-col">
        <Nav />
        <div id="main" tabIndex={-1} className="flex-1 outline-none">
          <Suspense fallback={<RouteLoader />}>
            <Routes>
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="bag" element={<Bag />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Login />} />
              <Route path="p/:id" element={<ProductDetail />} />
              <Route path="account" element={<Account />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="checkout/pay/:token" element={<TestPayment />} />
              <Route path="order/:token" element={<OrderStatus />} />
              <Route path="admin/*" element={<AdminRedirect />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
        <Footer />
      </div>
      <Toaster position="bottom-right" />
    </>
  </BrowserRouter>
);

export default App;
