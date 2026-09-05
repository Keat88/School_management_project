import { createContext, useContext } from "react";

// Named export kept for compatibility with components that do:
//   import { AuthContext } from "../../context/AuthContext";
//   const { currentUser } = useContext(AuthContext);
export const AuthContext = createContext(null);

const currentUser = JSON.parse(localStorage.getItem("user"));

export function AuthProvider({ children }) {
  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Convenience hook — components can use either:
//   const { currentUser } = useAuth();
// or the raw context via useContext(AuthContext) directly.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
