"use client";

// hooks/useAdminAuth.tsx
import { useState, useEffect, useContext, createContext } from "react";
import { auth } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

// Define admin users (you could move this to environment variables)
const ADMIN_EMAILS = [
  "admin@amartconsult.com", // Replace with your actual admin email
  // Add other admin emails as needed
];

interface AdminAuthContext {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContext | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { session } = await auth.getSession();
      if (session?.user && isAdminUser(session.user.email)) {
        setUser(session.user);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = auth.onAuthStateChange(async (event, session) => {
      if (session?.user && isAdminUser(session.user.email)) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isAdminUser = (email: string | undefined): boolean => {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.toLowerCase());
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);

      // First check if this is an admin email
      if (!isAdminUser(email)) {
        return {
          success: false,
          error: "Access denied. This portal is for administrators only.",
        };
      }

      const { data, error } = await auth.signIn(email, password);

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.user) {
        setUser(data.user);
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Admin sign out error:", error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    isAdmin: !!user && isAdminUser(user.email),
    signIn,
    signOut,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}

// Route protection hook for admin
export function useRequireAdminAuth() {
  const { user, loading, isAdmin } = useAdminAuth();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      setRedirecting(true);
      window.location.href = "/admin/login";
    }
  }, [user, loading, isAdmin]);

  return {
    user,
    loading: loading || redirecting,
    isAuthenticated: isAdmin,
  };
}
