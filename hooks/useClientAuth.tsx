// hooks/useClientAuth.ts
"use client";

import { useState, useEffect, useContext, createContext, useRef } from "react";
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
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const isUpdatingPasswordRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    // Delay initial session check to avoid race conditions
    const timeoutId = setTimeout(async () => {
      if (!mounted) return;

      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Initial session error:", error);
        }

        if (mounted) {
          if (session?.user) {
            console.log("Initial session found:", session.user.id);
            setUser(session.user);
            await loadClientData(session.user.id);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to get initial session:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    }, 100); // Small delay

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, !!session, session?.user?.id);

      // Completely skip USER_UPDATED events - they cause database connection issues
      if (event === "USER_UPDATED") {
        console.log("Skipping USER_UPDATED event entirely");
        return; // Exit early, don't process anything
      }

      if (mounted) {
        if (session?.user) {
          setUser(session.user);
          await loadClientData(session.user.id);
        } else {
          setUser(null);
          setClient(null);
        }
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [isUpdatingPassword]); // Add isUpdatingPassword to dependency array

  const loadClientData = async (authUserId: string) => {
    try {
      console.log("=== LOADING CLIENT DATA ===");
      console.log("Auth user ID:", authUserId);

      // Add delay to prevent race conditions
      await new Promise((resolve) => setTimeout(resolve, 100));

      console.log("About to call clientService.getByAuthUserId...");
      const clientData = await clientService.getByAuthUserId(authUserId);
      console.log("clientService.getByAuthUserId result:", clientData);

      if (clientData) {
        console.log("Setting client data...");
        setClient(clientData);
        console.log("Client set successfully - session should persist");
      } else {
        console.log("No client found by auth_user_id, trying by email...");

        const { user: authUser } = await auth.getUser();
        console.log("Auth user for email lookup:", authUser);

        if (authUser?.email) {
          console.log("Looking up client by email:", authUser.email);
          const clientByEmail = await clientService.getByEmail(authUser.email);
          console.log("Client found by email:", clientByEmail);

          if (clientByEmail) {
            console.log("Linking client to auth user...");
            await clientService.update(clientByEmail.id, {
              auth_user_id: authUserId,
              has_portal_access: true,
            });
            setClient(clientByEmail);
            console.log("Client linked and set successfully");
          } else {
            console.log("No client found by email - this will cause logout");
          }
        } else {
          console.log("No auth user email found - this will cause logout");
        }
      }
      console.log("=== END CLIENT DATA LOADING ===");
    } catch (error) {
      console.error("CRITICAL: Failed to load client data:", error);
      console.error("This error will cause immediate logout");
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("SignIn error:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error("SignIn catch error:", error);
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
      setIsUpdatingPassword(true); // Set flag before update
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsUpdatingPassword(false); // Clear flag after update
    }
  };

  // Listen for auth changes

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
