import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedEmployeeRoute = ({ children }) => {
  const token = localStorage.getItem("employeeToken");

  if (!token) {
    return <Navigate to="/employeeLogin" replace />;
  }

  return children;
};

export default ProtectedEmployeeRoute;
