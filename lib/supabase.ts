import { createClient } from "@supabase/supabase-js";

console.log("Supabase URL Loaded:", process.env.NEXT_PUBLIC_SUPABASE_URL);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Your existing functions
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

// Types for client management
export interface Client {
  id: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  project_title: string;
  project_type: "residential" | "commercial" | "renovation" | "interior";
  project_description?: string;
  budget_range?: "50000-100000" | "100000-250000" | "250000-500000" | "500000+";
  timeline?: string;
  tier: "Tier 1" | "Tier 2" | "Tier 3";
  status:
    | "Planning"
    | "In Progress"
    | "Review"
    | "Completed"
    | "On Hold"
    | "Cancelled";
  client_status: "Active" | "Inactive" | "Archived";
  project_start_date?: string;
  project_end_date?: string;
  notes?: string;
  last_contact_date?: string;
  next_followup_date?: string;
}

export interface ProjectMilestone {
  id: string;
  client_id: string;
  created_at: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  due_date?: string;
  completed_date?: string;
  order_index: number;
}

export interface ClientDocument {
  id: string;
  client_id: string;
  created_at: string;
  title: string;
  description?: string;
  file_name: string;
  file_path: string;
  file_size?: number;
  file_type?: string;
  category?: string;
  tags?: string[];
}

export interface ClientMessage {
  id: string;
  client_id: string;
  created_at: string;
  sender_type: "admin" | "client";
  sender_name: string;
  message: string;
  is_read: boolean;
}

// Client management operations
export const clientService = {
  // Create a new client
  async create(
    clientData: Omit<Client, "id" | "created_at" | "updated_at">
  ): Promise<Client> {
    const { data, error } = await supabase
      .from("clients")
      .insert([clientData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all clients
  async getAll(): Promise<Client[]> {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get client by ID
  async getById(id: string): Promise<Client> {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Update client
  async update(id: string, updates: Partial<Client>): Promise<Client> {
    const { data, error } = await supabase
      .from("clients")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete client
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("clients").delete().eq("id", id);

    if (error) throw error;
  },

  // Get dashboard stats
  async getDashboardStats(): Promise<{
    totalClients: number;
    activeProjects: number;
    statusCounts: Record<string, number>;
    recentClients: Client[];
  }> {
    const [clientsResult, activeProjectsResult, recentClientsResult] =
      await Promise.all([
        supabase
          .from("clients")
          .select("id, status")
          .eq("client_status", "Active"),
        supabase
          .from("clients")
          .select("id")
          .in("status", ["Planning", "In Progress", "Review"]),
        supabase
          .from("clients")
          .select("*")
          .eq("client_status", "Active")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

    if (clientsResult.error) throw clientsResult.error;
    if (activeProjectsResult.error) throw activeProjectsResult.error;
    if (recentClientsResult.error) throw recentClientsResult.error;

    const statusCounts = clientsResult.data.reduce((acc, client) => {
      acc[client.status] = (acc[client.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalClients: clientsResult.data.length,
      activeProjects: activeProjectsResult.data.length,
      statusCounts,
      recentClients: recentClientsResult.data,
    };
  },
};

// Milestone operations
export const milestoneService = {
  async getByClientId(clientId: string): Promise<ProjectMilestone[]> {
    const { data, error } = await supabase
      .from("project_milestones")
      .select("*")
      .eq("client_id", clientId)
      .order("order_index");

    if (error) throw error;
    return data;
  },

  async create(
    milestoneData: Omit<ProjectMilestone, "id" | "created_at">
  ): Promise<ProjectMilestone> {
    const { data, error } = await supabase
      .from("project_milestones")
      .insert([milestoneData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(
    id: string,
    updates: Partial<ProjectMilestone>
  ): Promise<ProjectMilestone> {
    const { data, error } = await supabase
      .from("project_milestones")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Document operations
export const documentService = {
  async getByClientId(clientId: string): Promise<ClientDocument[]> {
    const { data, error } = await supabase
      .from("client_documents")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async upload(
    file: File,
    clientId: string,
    metadata: {
      title: string;
      description?: string;
      category?: string;
      tags?: string[];
    }
  ): Promise<ClientDocument> {
    // Upload file to Supabase Storage
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `client-documents/${clientId}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("client-files")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Save document record to database
    const { data, error } = await supabase
      .from("client_documents")
      .insert([
        {
          client_id: clientId,
          title: metadata.title,
          description: metadata.description,
          file_name: file.name,
          file_path: uploadData.path,
          file_size: file.size,
          file_type: file.type,
          category: metadata.category,
          tags: metadata.tags,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getDownloadUrl(filePath: string): Promise<string | undefined> {
    const { data } = await supabase.storage
      .from("client-files")
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    return data?.signedUrl;
  },

  async delete(docId: string): Promise<void> {
    const { error } = await supabase
      .from("client_documents")
      .delete()
      .eq("id", docId);

    if (error) throw error;
  },
};

// Message operations
export const messageService = {
  async getByClientId(clientId: string): Promise<ClientMessage[]> {
    const { data, error } = await supabase
      .from("client_messages")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at");

    if (error) throw error;
    return data;
  },

  async create(
    messageData: Omit<ClientMessage, "id" | "created_at">
  ): Promise<ClientMessage> {
    const { data, error } = await supabase
      .from("client_messages")
      .insert([messageData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
