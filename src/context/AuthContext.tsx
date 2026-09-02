"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dynamic import to avoid server-side execution
    import("@/lib/firebase").then(({ auth }) => {
      if (auth) {
        // Sign out on every fresh page load (no persistent sessions)
        const isNewSession = !sessionStorage.getItem("session_active");
        if (isNewSession) {
          signOut(auth).then(() => {
            sessionStorage.setItem("session_active", "true");
          });
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
          setLoading(false);
        });
        return () => unsubscribe();
      } else {
        setLoading(false);
      }
    });
  }, []);

  const logout = async () => {
    const { auth } = await import("@/lib/firebase");
    if (auth) {
      await signOut(auth);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
