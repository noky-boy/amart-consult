import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database helper functions
export const saveSubscriber = async (data: {
  email: string;
  name?: string;
  source?: string;
}) => {
  const { data: result, error } = await supabase
    .from("subscribers")
    .insert([
      {
        email: data.email,
        name: data.name,
        source: data.source || "website",
      },
    ])
    .select();

  if (error) {
    console.error("Database error saving subscriber:", error);
    return { success: false, error };
  }

  return { success: true, data: result };
};

export const saveContactSubmission = async (data: {
  name: string;
  email: string;
  phone: string;
  project_type: string;
  location: string;
  budget_range?: string | null;
  service_interest: string[];
  message: string;
}) => {
  const { data: result, error } = await supabase
    .from("contact_submissions")
    .insert([data])
    .select();

  if (error) {
    console.error("Database error saving contact submission:", error);
    return { success: false, error };
  }

  return { success: true, data: result };
};
