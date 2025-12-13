import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState, createContext, useContext } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home";
import Product from "./pages/Product/Product";
import ProductList from "./pages/Product/ProductList";
import ProductPaket from "./pages/Product/ProductPaket";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyAccount from "./pages/auth/VerifyAccount";
import SetNewPassword from "./pages/auth/SetNewPassword";
import ProductDetail from "./pages/Product/ProductDetail";
import CartPage from "./pages/cart/CartPage";
import OrderInfo from "./pages/checkout/OrderInfo";
import PaymentNow from "./pages/checkout/PaymentNow.jsx";
import PaymentCOD from "./pages/checkout/PaymentCOD";
import PaymentWaiting from "./pages/checkout/PaymentWaiting";
import AccountPage from "./pages/account/AccountPage";
import Search from "./pages/search/Search";
import { CartProvider } from "./context/CartContext";
import RequireAuth from "./components/RequireAuth";
import OrderStatus from "./pages/orders/OrderStatus.jsx";
import AdminRoutes from "./Admin/AdminRoutes.jsx";
import { api } from "./lib/api";

// ======================
// CONTEXT BUSINESS INFO
// ======================
export const BusinessInfoContext = createContext(null);

export function useBusinessInfo() {
  return useContext(BusinessInfoContext);
}

// ======================
// MAIN LAYOUT
// ======================
function MainLayout({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
}

// ======================
// APP COMPONENT
// ======================
export default function App() {
  const [businessInfo, setBusinessInfo] = useState(null);

  // Fetch business info dari backend
  useEffect(() => {
    api.getNoAuth("/business-info")
      .then(res => setBusinessInfo(res))
      .catch(console.error);
  }, []);

  return (
    <CartProvider>
      <BusinessInfoContext.Provider value={{ businessInfo, setBusinessInfo }}>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/product" element={<Product />} />
              <Route path="/product/satuan" element={<ProductList />} />
              <Route path="/product/paketan" element={<ProductPaket />} />
              <Route path="/product/satuan/:slug" element={<ProductDetail type="satuan" />} />
              <Route path="/product/paketan/:slug" element={<ProductDetail type="paketan" />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/auth/forgot" element={<ForgotPassword />} />
              <Route path="/auth/verify" element={<VerifyAccount />} />
              <Route path="/auth/set-password" element={<SetNewPassword />} />
              <Route path="/keranjang" element={<RequireAuth><CartPage /></RequireAuth>} />
              <Route path="/checkout/order-info" element={<RequireAuth><OrderInfo /></RequireAuth>} />
              <Route path="/checkout/payment" element={<RequireAuth><PaymentNow /></RequireAuth>} />
              <Route path="/checkout/payment-waiting" element={<RequireAuth><PaymentWaiting /></RequireAuth>} />
              <Route path="/checkout/payment-cod" element={<RequireAuth><PaymentCOD /></RequireAuth>} />
              <Route path="/orders/:transCode" element={<RequireAuth><OrderStatus /></RequireAuth>} />
              <Route path="/profile/*" element={<RequireAuth><AccountPage /></RequireAuth>} />
              <Route path="/admin/*" element={<AdminRoutes />} />
            </Routes>
          </MainLayout>
        </Router>
      </BusinessInfoContext.Provider>
    </CartProvider>
  );
}
