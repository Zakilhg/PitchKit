import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./Home";
import Login from "./components/Login";
import ProductDetail from "./components/ProductDetail";
import NotFound from "./components/NotFound";
import { useState } from "react";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthentication = (authenticated) => {
    setIsAuthenticated(authenticated);
  };

  return (
    <>
      <BrowserRouter>
        <Nav isAuthenticated={isAuthenticated}/>
        <Routes>
          <Route index path="" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Login handleAuthentication={handleAuthentication}/>} />
          <Route path="/p/:id" element={<ProductDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
