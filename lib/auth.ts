// lib/auth.ts
import { supabase } from "./supabase";

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}

export const authService = {
  // Sign in admin user
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current session
  async getSession() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  // Check if user is admin (you can customize this logic)
  async isAdmin(email?: string) {
    // For now, we'll allow any authenticated user to be admin
    // In production, you might want to check against a specific list or role
    return true;
  },
};
