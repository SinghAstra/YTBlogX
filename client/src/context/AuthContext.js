import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [user, setUser] = useState(null);

  console.log("user is ", user);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      verifyToken(token);
    } else {
      setIsAuthenticating(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      setIsAuthenticating(true);
      const response = await axios.get("http://localhost:5000/api/auth/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response is ", response);
      setIsAuthenticated(true);
      setUser(response.data.user);
    } catch (error) {
      console.log("error is ", error);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const saveJWTToken = async (token) => {
    localStorage.setItem("token", token);
    await verifyToken(token);
  };

  const handleLogOut = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("token");
  };

  const handleSendOTP = async (email) => {
    const toastId = toast.loading("Sending email...");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/sendOTP",
        {
          email,
        }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("error is ", error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        setUser,
        isAuthenticating,
        setIsAuthenticating,
        saveJWTToken,
        handleLogOut,
        handleSendOTP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
