import { createContext, useState, useContext, useEffect } from "react";
import { api } from "../data/api";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [SchoolName, setSchoolName] = useState([]);
  const [userData, setUserData] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (savedUser && token) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        return null;
      }
    }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userAvatar");
    return null;
  });
  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setCurrentUser(userData);
  };
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userAvatar");
    setCurrentUser(null);
  };
  useEffect(() => {
    const fetchSchoolName = async () => {
      try {
        const res = await api.get("/settings");
        setSchoolName(res?.data?.settings || {});
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchSchoolName();
  }, []);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.get("/teacher/setting");
        setUserData(res?.data?.data);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchUserData();
  }, []);
  return (
    <AuthContext.Provider
      value={{ SchoolName, userData, currentUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook សម្រាប់ហៅប្រើ
export const useAuth = () => {
  return useContext(AuthContext);
};
