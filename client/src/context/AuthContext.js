import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

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

  const handleLogIn = async (token) => {
    localStorage.setItem("token", token);
    await verifyToken(token);
  };

  const handleLogOut = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        setUser,
        isAuthenticating,
        setIsAuthenticating,
        handleLogIn,
        handleLogOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
