import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./Home";
import Shop from "./components/Shop";
import Bag from "./components/Bag";
import Login from "./components/Login";
import ProductDetail from "./components/ProductDetail";
import NotFound from "./components/NotFound";

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

const App = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "") || "/"}>
      <ScrollToTop />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <div id="main" tabIndex={-1} className="page-root">
        <Routes>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="bag" element={<Bag />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Login />} />
          <Route path="p/:id" element={<ProductDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
