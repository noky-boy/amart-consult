// hooks/useClientAuth.ts
"use client";

import { useState, useEffect, useContext, createContext } from "react";
import { auth, clientService, supabase } from "@/lib/supabase";
import type { Client } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface ClientAuthContext {
  user: User | null;
  client: Client | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (
    email: string
  ) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (
    newPassword: string
  ) => Promise<{ success: boolean; error?: string }>;
}

const ClientAuthContext = createContext<ClientAuthContext | undefined>(
  undefined
);

export function ClientAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { session } = await auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await loadClientData(session.user.id);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await loadClientData(session.user.id);
      } else {
        setUser(null);
        setClient(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadClientData = async (authUserId: string) => {
    try {
      const clientData = await clientService.getByAuthUserId(authUserId);
      if (clientData) {
        setClient(clientData);
      } else {
        // If no client found by auth_user_id, try to link by email
        const { user: authUser } = await auth.getUser();
        if (authUser?.email) {
          const clientByEmail = await clientService.getByEmail(authUser.email);
          if (clientByEmail) {
            // Link the client to this auth user
            await clientService.update(clientByEmail.id, {
              auth_user_id: authUserId,
              has_portal_access: true,
            });
            setClient(clientByEmail);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load client data:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await auth.signIn(email, password);

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.user) {
        setUser(data.user);
        await loadClientData(data.user.id);
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
      setClient(null);
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await auth.resetPassword(email);
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    client,
    loading,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };

  return (
    <ClientAuthContext.Provider value={value}>
      {children}
    </ClientAuthContext.Provider>
  );
}

export function useClientAuth() {
  const context = useContext(ClientAuthContext);
  if (context === undefined) {
    throw new Error("useClientAuth must be used within a ClientAuthProvider");
  }
  return context;
}

// Route protection hook
export function useRequireAuth() {
  const { user, client, loading } = useClientAuth();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setRedirecting(true);
      window.location.href = "/portal/login";
    }
  }, [user, loading]);

  return {
    user,
    client,
    loading: loading || redirecting,
    isAuthenticated: !!user && !!client,
  };
}
