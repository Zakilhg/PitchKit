import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./Home";
import Login from "./components/Login";
import ProductDetail from "./components/ProductDetail";
import NotFound from "./components/NotFound";
import Profile from "./components/Profile";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route index path="" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Login />} />
          <Route path="/p/:id" element={<ProductDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
