import React, { createContext, useState, useEffect } from "react";
import { apiFetch } from "../utils/api.js";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/check-session")
      .then((data) => {
        if (data.loggedIn) setUserId(data.userId);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ userId, setUserId, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
