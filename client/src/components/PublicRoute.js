import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loader from "./Loader/Loader";

const PublicRoute = () => {
  const { isAuthenticated, isAuthenticating } = useContext(AuthContext);

  if (isAuthenticating) {
    return <Loader />;
  }

  return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
