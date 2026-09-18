"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

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
    import("@/lib/firebase").then(async ({ auth }) => {
      if (auth) {
        // Keep the user logged in across page reloads and browser restarts.
        // Firebase local persistence stores the session so reopening the site
        // takes them straight to home with their previous credentials.
        try {
          await setPersistence(auth, browserLocalPersistence);
        } catch {
          // Persistence may fail in some privacy modes; auth still works for the session.
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
