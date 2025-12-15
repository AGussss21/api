import { Routes, Route } from "react-router-dom";
import RequireAdmin from "../components/RequireAdmin";
import AdminLayout from "../Admin/components/AdminLayout";
import AdminLogin from "./AdminLogin";
import Dashboard from "./Dashboard";
import ProductForm from "./Product";
import BusinessInfo from "./BusinessInfo";
import TestimonialManager from "./Testimonials";
import OrderManagement from "./OrderManagement";


export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route element={
        <RequireAdmin>
          <AdminLayout /> 
        </RequireAdmin>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/product" element={<ProductForm />} />
        <Route path="/edit-product/:id" element={<ProductForm />} /> 
        <Route path="/businessinfo" element={<BusinessInfo />} />
        <Route path="/testimonials" element={<TestimonialManager />} />
        <Route path="/ordermanagement" element={<OrderManagement />} />
      </Route>
    </Routes>
  );
}