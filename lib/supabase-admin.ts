// lib/supabase-admin.ts (server-side only)
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseServiceKey) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is required for server-side operations"
  );
}

// Service role client (server-side only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Admin version of saveContactSubmission that bypasses RLS
export const saveContactSubmissionAdmin = async (data: {
  name: string;
  email: string;
  phone: string;
  project_type: string;
  location: string;
  budget_range?: string | null;
  service_interest: string[];
  message: string;
}) => {
  const { data: result, error } = await supabaseAdmin
    .from("contact_submissions")
    .insert([data])
    .select();

  if (error) {
    console.error("Database error saving contact submission:", error);
    return { success: false, error };
  }

  return { success: true, data: result };
};
