import { Children, createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogging, setIsLogging] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [users, setUsers] = useState(null);
  const [jobs, setJobs] = useState([]);

  return (
    <AuthContext.Provider
      value={{
        isLogging,
        setIsLogging,
        isLogout,
        setIsLogout,
        setUsers,
        users,
        jobs,
        setJobs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
