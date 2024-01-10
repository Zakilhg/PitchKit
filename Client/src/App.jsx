import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./Home";
import Login from "./components/Login";
import ProductDetail from "./components/ProductDetail";
import NotFound from "./components/NotFound";
import { useState } from "react";
import Profile from "./components/Profile";
import Register from "./components/Register";

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
          <Route path="login" element={<Login handleAuthentication={handleAuthentication}/>} />
          <Route path="register" element={<Register />} />
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

// import { BrowserRouter, Routes, Route, Navigate, Outlet,  } from "react-router-dom";
// import Nav from "./components/Nav";
// import Footer from "./components/Footer";
// import Home from "./Home";
// import Login from "./components/Login";
// import ProductDetail from "./components/ProductDetail";
// import NotFound from "./components/NotFound";
// import { useState } from "react";
// import Profile from "./components/Profile";

// const App = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const handleAuthentication = (authenticated) => {
//     setIsAuthenticated(authenticated);

//     // Use Navigate only if inside the BrowserRouter context
    
//   };


//   // Function to render the login/register component only if not authenticated
//   const renderLoginRegister = () => {
//     if (!isAuthenticated) {
//       return <Login handleAuthentication={handleAuthentication} />;
//     } else {
//       // Redirect to the home page if already authenticated
//       return <Navigate to="/" replace />;
//     }
//   };

//   return (
//     <BrowserRouter>
//       <Nav isAuthenticated={isAuthenticated} />
//       <Routes>
//         <Route path="/" element={<Outlet />}>
//           <Route index element={<Home />} />
//           {/* Render the login/register component only if not authenticated */}
//           <Route path="login" element={renderLoginRegister} />
//           <Route path="register" element={renderLoginRegister} />
//           {/* Protect the profile route */}
//           {isAuthenticated ? (
//             <Route path="profile" element={<Profile />} />
//           ) : (
//             <Navigate to="/login" replace />
//           )}
//           <Route path="p/:id" element={<ProductDetail />} />
//           <Route path="*" element={<NotFound />} />
//         </Route>
//       </Routes>
//       <Footer />
//     </BrowserRouter>
//   );
// };

// export default App;

