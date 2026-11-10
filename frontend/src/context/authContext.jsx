import React, { createContext, useState, useEffect, useCallback } from "react";

import { getLoggedUser, userLogout } from "../services/authServices";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(null);
  const [jobs, setJobs] = useState([]);

  const [isLogging, setIsLogging] = useState(false);
  const [isLogout, setIsLogout] = useState(false);

  // Initially true because we need to check the cookie
  const [authLoading, setAuthLoading] = useState(true);

  // Check existing login session
  const checkAuth = useCallback(async () => {
    try {
      const response = await getLoggedUser();

      setUsers(response.data.user);
      setIsLogging(true);
    } catch (error) {
      setUsers(null);
      setIsLogging(false);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // Automatically check login when application starts
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Logout user
  const logout = async () => {
    try {
      await userLogout();

      setUsers(null);
      setIsLogging(false);
      setIsLogout(true);

      return true;
    } catch (error) {
      console.error("Logout failed:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        users,
        setUsers,

        jobs,
        setJobs,

        isLogging,
        setIsLogging,

        isLogout,
        setIsLogout,

        authLoading,
        checkAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
