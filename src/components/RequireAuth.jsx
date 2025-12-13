import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "../lib/api";

function readUser() {
  try { return JSON.parse(localStorage.getItem("user")) || null; }
  catch { return null; }
}

export default function RequireAuth({ children }) {
  const user = readUser();
  const token = getToken();
  const loc = useLocation();
  if (!user && !token) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  return children;
}
