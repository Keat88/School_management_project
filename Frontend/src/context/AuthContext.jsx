import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setCurrentUser(userData);
  };
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setCurrentUser(null);
  };
  return (
    <AuthContext.Provider
      value={{ currentUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook សម្រាប់ហៅប្រើ
export const useAuth = () => {
  return useContext(AuthContext);
};
