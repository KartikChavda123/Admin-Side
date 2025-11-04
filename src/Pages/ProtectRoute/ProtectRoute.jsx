// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import * as jwt_decode from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const isTokenValid = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const decoded = jwt_decode.default(token);
      const currentTime = Date.now() / 1000000; // in seconds
      return decoded.exp > currentTime; // true if token not expired
    } catch (err) {
      return false;
    }
  };

  if (!isTokenValid()) {
    // remove expired token
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // redirect to login
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
