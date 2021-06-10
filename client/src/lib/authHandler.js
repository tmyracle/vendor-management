import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

export const AuthContext = React.createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await axios.get(
          "/api/v1/user/is_authenticated",
          withToken()
        );
        const isAuthenticatedStatus = res.data.isAuthenticated;
        setIsAuthenticated(isAuthenticatedStatus);
        if (isAuthenticatedStatus === true) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.log(error);
      }
    };
    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const withToken = () => {
  return {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
};
