import React from "react";
import { Routes, Route } from "react-router-dom";
import RegistrationPage from "./RegistrationPage";
import LoginPage from "./LoginPage";
import CustomerHomePage from "./CustomerHomePage";
import  CartPage  from './CartPage';
import OrdersPage from './OrderPage'; // ✅ Correct default import
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/CustomerHomePage" element={<CustomerHomePage />} /> {/* ✅ Add this */}
      <Route path="/UserCartPage" element={<CartPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admindashboard" element={<AdminDashboard />} />

    </Routes>
  );
};

export default AppRoutes;
