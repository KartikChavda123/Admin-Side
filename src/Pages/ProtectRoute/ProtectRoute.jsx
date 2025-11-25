// src/Pages/ProtectRoute/ProtectRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  // Not logged in
  if (!parsedUser) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin (if required)
  if (adminOnly && parsedUser.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  // Authorized
  return children;
}
