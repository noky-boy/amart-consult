import { createClient, type User } from "@supabase/supabase-js";
export type { User };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication helpers
export const auth = {
  // Sign up new client with email/password
  signUp: async (email: string, password: string, clientData?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: clientData, // Store additional client info in user metadata
      },
    });
    return { data, error };
  },

  // Sign in client
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Return the user from the session for consistency with your hook
    return {
      data: {
        user: data.session?.user || null,
        session: data.session,
      },
      error,
    };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current session
  getSession: async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    return { session, error };
  },

  // Get current user
  getUser: async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return { user, error };
  },

  // Listen to auth changes
  onAuthStateChange: (callback: (event: any, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Reset password
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/portal/reset-password`,
    });
    return { data, error };
  },
};

// Generate random password for new clients
export const generateRandomPassword = () => {
  const length = 12;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// Your existing newsletter functions
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

// Updated Types
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
  tier: "Tier 1" | "Tier 2" | "Tier 3";
  client_status: "Active" | "Inactive" | "Archived";
  last_contact_date?: string;
  next_followup_date?: string;
  auth_user_id?: string;
  has_portal_access?: boolean;
  temp_password?: string;
  notes?: string; // Client-level notes
}

export interface Project {
  id: string;
  client_id: string;
  created_at: string;
  updated_at: string;
  project_title: string;
  project_type: "residential" | "commercial" | "renovation" | "interior";
  project_description?: string;
  budget_range?: "50000-100000" | "100000-250000" | "250000-500000" | "500000+";
  timeline?: string;
  status:
    | "Planning"
    | "In Progress"
    | "Review"
    | "Completed"
    | "On Hold"
    | "Cancelled";
  project_start_date?: string;
  project_end_date?: string;
  notes?: string; // Project-specific notes
  // New financial fields
  contract_sum?: number;
  cash_received?: number;
  balance?: number;
}

export interface ProjectPhase {
  id: string;
  project_id: string;
  created_at: string;
  updated_at: string;
  phase_name: string;
  phase_description: string | null;
  phase_order: number;
  is_completed: boolean;
  completed_date: string | null;
  estimated_duration: string | null;
  parent_phase_id: string | null; // NEW
  phase_weight: number; // NEW
}

// Helper type for nested phase structure
export interface PhaseWithChildren extends ProjectPhase {
  children?: ProjectPhase[];
  progress?: number; // Calculated progress for parent phases
}

// Template structure for phase creation
export interface PhaseTemplate {
  phase_name: string;
  description?: string;
  estimated_duration?: string;
  phase_weight: number;
  sub_tasks?: SubTaskTemplate[];
}

export interface SubTaskTemplate {
  phase_name: string;
  description?: string;
  estimated_duration?: string;
  phase_weight: number;
}

// For creating phases in the database
export interface CreatePhaseInput {
  project_id: string;
  phase_name: string;
  phase_description?: string | null;
  estimated_duration?: string | null;
  phase_order: number;
  is_completed: boolean;
  parent_phase_id?: string | null;
  phase_weight: number;
}

// Project with progress calculation
export interface ProjectWithProgress extends Project {
  progress_percentage?: number;
  total_phases?: number;
  completed_phases?: number;
}

export interface ClientDocument {
  id: string;
  client_id: string;
  project_id?: string; // Optional for backward compatibility
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
  project_id?: string; // Optional for backward compatibility
  created_at: string;
  sender_type: "admin" | "client";
  sender_name: string;
  message: string;
  is_read: boolean;
}

// New Project Service
export const projectService = {
  // Get all projects for a client
  async getByClientId(clientId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get project by ID
  async getById(id: string): Promise<Project> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Get project with client info
  async getWithClient(id: string): Promise<Project & { client: Client }> {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        client:clients(*)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new project
  async create(
    projectData: Omit<Project, "id" | "created_at" | "updated_at">
  ): Promise<Project> {
    const { data, error } = await supabase
      .from("projects")
      .insert([projectData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update project
  async update(id: string, updates: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get project with progress calculation
  async getWithProgress(id: string): Promise<ProjectWithProgress> {
    const [project, progressResult] = await Promise.all([
      this.getById(id),
      supabase.rpc("get_project_progress", { project_uuid: id }),
    ]);

    const phases = await phaseService.getByProjectId(id);

    return {
      ...project,
      progress_percentage: progressResult.data || 0,
      total_phases: phases.length,
      completed_phases: phases.filter((p) => p.is_completed).length,
    };
  },

  // Get project with client and progress
  async getWithClientAndProgress(
    id: string
  ): Promise<ProjectWithProgress & { client: Client }> {
    const [projectWithClient, progressResult] = await Promise.all([
      this.getWithClient(id),
      supabase.rpc("get_project_progress", { project_uuid: id }),
    ]);

    const phases = await phaseService.getByProjectId(id);

    return {
      ...projectWithClient,
      progress_percentage: progressResult.data || 0,
      total_phases: phases.length,
      completed_phases: phases.filter((p) => p.is_completed).length,
    };
  },

  // A new getAll method is needed for getAllWithProgress
  async getAll(): Promise<Project[]> {
    const { data, error } = await supabase.from("projects").select("*");
    if (error) throw error;
    return data;
  },

  // Delete project
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw error;
  },

  // Get all projects with client info (for admin dashboard)
  async getAllWithClients(): Promise<(Project & { client: Client })[]> {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
      *,
      client:clients(*)
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get dashboard stats for projects
  async getDashboardStats(): Promise<{
    totalProjects: number;
    activeProjects: number;
    statusCounts: Record<string, number>;
    recentProjects: (Project & { client: Client })[];
  }> {
    const [projectsResult, activeProjectsResult, recentProjectsResult] =
      await Promise.all([
        supabase.from("projects").select("id, status"),
        supabase
          .from("projects")
          .select("id")
          .in("status", ["Planning", "In Progress", "Review"]),
        supabase
          .from("projects")
          .select(
            `
        *,
        client:clients(*)
        `
          )
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

    if (projectsResult.error) throw projectsResult.error;
    if (activeProjectsResult.error) throw activeProjectsResult.error;
    if (recentProjectsResult.error) throw recentProjectsResult.error;

    const statusCounts = projectsResult.data.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalProjects: projectsResult.data.length,
      activeProjects: activeProjectsResult.data.length,
      statusCounts,
      recentProjects: recentProjectsResult.data,
    };
  },

  // Get all projects with progress for dashboard
  async getAllWithProgress(): Promise<ProjectWithProgress[]> {
    const projects = await this.getAll();

    // Corrected code - type is inferred automatically
    const projectsWithProgress = await Promise.all(
      projects.map(async (project) => {
        // No need to specify the type here
        const [progressResult, phases] = await Promise.all([
          supabase.rpc("get_project_progress", { project_uuid: project.id }),
          phaseService.getByProjectId(project.id),
        ]);

        return {
          ...project, // Now this correctly spreads the full 'Project' object
          progress_percentage: progressResult.data || 0,
          total_phases: phases.length,
          completed_phases: phases.filter((p) => p.is_completed).length,
        };
      })
    );

    return projectsWithProgress;
  },

  // Update project with financial data
  // async updateFinancials(
  //   id: string,
  //   financials: {
  //     contract_sum?: number;
  //     cash_received?: number;
  //   }
  // ): Promise<Project> {
  //   const { data, error } = await supabase
  //     .from("projects")
  //     .update({
  //       contract_sum: financials.contract_sum,
  //       cash_received: financials.cash_received,
  //       // balance will be calculated automatically by the database trigger
  //     })
  //     .eq("id", id)
  //     .select()
  //     .single();

  //   if (error) throw error;
  //   return data;
  // },
};

// Updated Client Service (no more embedded project data)
export const clientService = {
  // Create a new client (without project data)
  async create(
    clientData: Omit<Client, "id" | "created_at" | "updated_at">,
    createPortalAccess: boolean = true
  ): Promise<{ client: Client; temporaryPassword?: string }> {
    let temporaryPassword: string | undefined;
    let authUserId: string | undefined;

    // Create auth account if portal access requested
    if (createPortalAccess) {
      temporaryPassword = generateRandomPassword();

      const { data: authData, error: authError } = await auth.signUp(
        clientData.email,
        temporaryPassword,
        {
          first_name: clientData.first_name,
          last_name: clientData.last_name,
          client_type: "portal_user",
        }
      );

      if (authError) {
        console.error("Failed to create auth user:", authError);
        // Continue without portal access if auth creation fails
      } else if (authData.user) {
        authUserId = authData.user.id;
      }
    }

    // Create client record
    const { data, error } = await supabase
      .from("clients")
      .insert([
        {
          ...clientData,
          auth_user_id: authUserId,
          has_portal_access: !!authUserId,
          temp_password: temporaryPassword,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return {
      client: data,
      temporaryPassword: createPortalAccess ? temporaryPassword : undefined,
    };
  },

  // Get client with their projects
  async getWithProjects(id: string): Promise<Client & { projects: Project[] }> {
    const { data, error } = await supabase
      .from("clients")
      .select(
        `
      *,
      projects(*)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Get client by auth user ID (for portal access)
  async getByAuthUserId(authUserId: string): Promise<Client | null> {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("auth_user_id", authUserId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null; // No rows found
        }
        console.error("Database error in getByAuthUserId:", error);
        throw error;
      }

      return data;
    } catch (err) {
      console.error("Exception in getByAuthUserId:", err);
      throw err;
    }
  },

  // Get client by email (for linking auth users)
  async getByEmail(email: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // No rows found
      throw error;
    }
    return data;
  },

  // Enable portal access for existing client
  async enablePortalAccess(
    clientId: string
  ): Promise<{ temporaryPassword: string }> {
    const client = await this.getById(clientId);
    if (!client) throw new Error("Client not found");

    const temporaryPassword = generateRandomPassword();

    const { data: authData, error: authError } = await auth.signUp(
      client.email,
      temporaryPassword,
      {
        first_name: client.first_name,
        last_name: client.last_name,
        client_type: "portal_user",
      }
    );

    if (authError) throw authError;

    // Update client with auth user ID
    await this.update(clientId, {
      auth_user_id: authData.user?.id,
      has_portal_access: true,
      temp_password: temporaryPassword,
    });

    return { temporaryPassword };
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

  // Updated dashboard stats (combined client and project data)
  async getDashboardStats(): Promise<{
    totalClients: number;
    totalProjects: number;
    activeProjects: number;
    statusCounts: Record<string, number>;
    recentClients: Client[];
    recentProjects: (Project & { client: Client })[];
  }> {
    const [clientsResult, projectStats] = await Promise.all([
      supabase
        .from("clients")
        .select("*")
        .eq("client_status", "Active")
        .order("created_at", { ascending: false })
        .limit(5),
      projectService.getDashboardStats(),
    ]);

    if (clientsResult.error) throw clientsResult.error;

    return {
      totalClients: clientsResult.data.length,
      totalProjects: projectStats.totalProjects,
      activeProjects: projectStats.activeProjects,
      statusCounts: projectStats.statusCounts,
      recentClients: clientsResult.data,
      recentProjects: projectStats.recentProjects,
    };
  },
};

export const phaseService = {
  // Get all phases for a project
  async getByProjectId(projectId: string): Promise<ProjectPhase[]> {
    const { data, error } = await supabase
      .from("project_phases")
      .select("*")
      .eq("project_id", projectId)
      .order("phase_order");

    if (error) throw error;
    return data;
  },

  // Create a new phase
  async create(
    phaseData: Omit<ProjectPhase, "id" | "created_at" | "updated_at">
  ): Promise<ProjectPhase> {
    const { data, error } = await supabase
      .from("project_phases")
      .insert([phaseData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Create multiple phases at once
  async createMultiple(
    phases: Omit<ProjectPhase, "id" | "created_at" | "updated_at">[]
  ): Promise<ProjectPhase[]> {
    const { data, error } = await supabase
      .from("project_phases")
      .insert(phases)
      .select()
      .order("phase_order");

    if (error) throw error;
    return data;
  },

  // Update phase
  async update(
    id: string,
    updates: Partial<ProjectPhase>
  ): Promise<ProjectPhase> {
    const { data, error } = await supabase
      .from("project_phases")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ADD THESE METHODS TO YOUR EXISTING phaseService OBJECT
  // (Keep all your existing methods, just add these new ones)

  // Get all phases with parent-child structure
  async getByProjectIdHierarchical(
    projectId: string
  ): Promise<PhaseWithChildren[]> {
    const { data, error } = await supabase
      .from("project_phases")
      .select("*")
      .eq("project_id", projectId)
      .order("phase_order", { ascending: true });

    if (error) throw error;

    const phases = data as ProjectPhase[];
    const parentPhases = phases.filter((p) => !p.parent_phase_id);

    return parentPhases.map((parent) => {
      const children = phases.filter((p) => p.parent_phase_id === parent.id);
      const completedChildren = children.filter((c) => c.is_completed).length;
      const progress =
        children.length > 0
          ? Math.round((completedChildren / children.length) * 100)
          : 0;

      return {
        ...parent,
        children,
        progress,
      };
    });
  },

  // Create multiple phases with hierarchy
  async createMultipleHierarchical(
    phases: CreatePhaseInput[]
  ): Promise<ProjectPhase[]> {
    const { data, error } = await supabase
      .from("project_phases")
      .insert(phases)
      .select();

    if (error) throw error;
    return data as ProjectPhase[];
  },

  // Toggle parent phase (affects all children)
  async toggleParentPhase(
    phaseId: string,
    isCompleted: boolean
  ): Promise<ProjectPhase[]> {
    const { data: children } = await supabase
      .from("project_phases")
      .select("id")
      .eq("parent_phase_id", phaseId);

    const childIds = children?.map((c) => c.id) || [];

    const { error: parentError } = await supabase
      .from("project_phases")
      .update({
        is_completed: isCompleted,
        completed_date: isCompleted ? new Date().toISOString() : null,
      })
      .eq("id", phaseId);

    if (parentError) throw parentError;

    if (childIds.length > 0) {
      const { error: childError } = await supabase
        .from("project_phases")
        .update({
          is_completed: isCompleted,
          completed_date: isCompleted ? new Date().toISOString() : null,
        })
        .in("id", childIds);

      if (childError) throw childError;
    }

    const { data, error } = await supabase
      .from("project_phases")
      .select("*")
      .or(`id.eq.${phaseId},parent_phase_id.eq.${phaseId}`);

    if (error) throw error;
    return data as ProjectPhase[];
  },

  // Toggle child phase (may affect parent)
  async toggleChildPhase(
    phaseId: string,
    isCompleted: boolean,
    parentPhaseId: string
  ): Promise<ProjectPhase[]> {
    const { error: childError } = await supabase
      .from("project_phases")
      .update({
        is_completed: isCompleted,
        completed_date: isCompleted ? new Date().toISOString() : null,
      })
      .eq("id", phaseId);

    if (childError) throw childError;

    const { data: siblings } = await supabase
      .from("project_phases")
      .select("is_completed")
      .eq("parent_phase_id", parentPhaseId);

    const allCompleted = siblings?.every((s) => s.is_completed) || false;

    if (allCompleted) {
      const { error: parentError } = await supabase
        .from("project_phases")
        .update({
          is_completed: true,
          completed_date: new Date().toISOString(),
        })
        .eq("id", parentPhaseId);

      if (parentError) throw parentError;
    } else {
      const { error: parentError } = await supabase
        .from("project_phases")
        .update({
          is_completed: false,
          completed_date: null,
        })
        .eq("id", parentPhaseId);

      if (parentError) throw parentError;
    }

    const { data, error } = await supabase
      .from("project_phases")
      .select("*")
      .or(
        `id.eq.${phaseId},id.eq.${parentPhaseId},parent_phase_id.eq.${parentPhaseId}`
      );

    if (error) throw error;
    return data as ProjectPhase[];
  },

  // Duplicate a parent phase with all its children (for repeating floors)
  async duplicatePhase(
    phaseId: string,
    newPhaseName: string,
    newOrder: number
  ): Promise<ProjectPhase[]> {
    const { data: parent, error: parentError } = await supabase
      .from("project_phases")
      .select("*")
      .eq("id", phaseId)
      .single();

    if (parentError) throw parentError;

    const { data: children, error: childrenError } = await supabase
      .from("project_phases")
      .select("*")
      .eq("parent_phase_id", phaseId)
      .order("phase_order");

    if (childrenError) throw childrenError;

    const { data: newParent, error: newParentError } = await supabase
      .from("project_phases")
      .insert({
        project_id: parent.project_id,
        phase_name: newPhaseName,
        phase_description: parent.phase_description,
        estimated_duration: parent.estimated_duration,
        phase_order: newOrder,
        phase_weight: parent.phase_weight,
        is_completed: false,
        parent_phase_id: null,
      })
      .select()
      .single();

    if (newParentError) throw newParentError;

    if (children && children.length > 0) {
      const newChildren = children.map((child, index) => ({
        project_id: child.project_id,
        phase_name: child.phase_name,
        phase_description: child.phase_description,
        estimated_duration: child.estimated_duration,
        phase_order: newOrder + index + 1,
        phase_weight: child.phase_weight,
        is_completed: false,
        parent_phase_id: newParent.id,
      }));

      const { error: childrenInsertError } = await supabase
        .from("project_phases")
        .insert(newChildren);

      if (childrenInsertError) throw childrenInsertError;
    }

    const { data: allNew, error: allNewError } = await supabase
      .from("project_phases")
      .select("*")
      .or(`id.eq.${newParent.id},parent_phase_id.eq.${newParent.id}`);

    if (allNewError) throw allNewError;
    return allNew as ProjectPhase[];
  },

  // Mark phase as completed
  async markCompleted(id: string): Promise<ProjectPhase> {
    return this.update(id, {
      is_completed: true,
      completed_date: new Date().toISOString(),
    });
  },

  // Mark phase as not completed
  async markIncomplete(id: string): Promise<ProjectPhase> {
    return this.update(id, {
      is_completed: false,
      completed_date: undefined,
    });
  },

  // Delete phase
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("project_phases")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  // Reorder phases
  async reorder(
    projectId: string,
    phaseIds: string[]
  ): Promise<ProjectPhase[]> {
    const updates = phaseIds.map((id, index) => ({
      id,
      phase_order: index + 1,
    }));

    const updatePromises = updates.map(({ id, phase_order }) =>
      this.update(id, { phase_order })
    );

    return Promise.all(updatePromises);
  },

  // Get project progress summary
  async getProgressSummary(projectId: string): Promise<{
    total_phases: number;
    completed_phases: number;
    progress_percentage: number;
    current_phase?: ProjectPhase;
    next_phase?: ProjectPhase;
  }> {
    const phases = await this.getByProjectId(projectId);
    const completed_phases = phases.filter((p) => p.is_completed).length;
    const total_phases = phases.length;
    const progress_percentage =
      total_phases > 0
        ? Math.round((completed_phases / total_phases) * 100)
        : 0;

    // Find current phase (first incomplete phase)
    const current_phase = phases.find((p) => !p.is_completed);

    // Find next phase (phase after current)
    const current_index = current_phase
      ? phases.findIndex((p) => p.id === current_phase.id)
      : -1;
    const next_phase =
      current_index >= 0 && current_index < phases.length - 1
        ? phases[current_index + 1]
        : undefined;

    return {
      total_phases,
      completed_phases,
      progress_percentage,
      current_phase,
      next_phase,
    };
  },
};

// Financial summary helper
export const getFinancialSummary = (project: Project) => {
  const contract_sum = project.contract_sum || 0;
  const cash_received = project.cash_received || 0;
  const balance = project.balance || contract_sum - cash_received;

  const progress_percentage =
    contract_sum > 0 ? Math.round((cash_received / contract_sum) * 100) : 0;

  return {
    contract_sum,
    cash_received,
    balance,
    progress_percentage,
    is_fully_paid: balance <= 0,
    formatted: {
      contract_sum: `GHS ${contract_sum.toLocaleString()}`,
      cash_received: `GHS ${cash_received.toLocaleString()}`,
      balance: `GHS ${balance.toLocaleString()}`,
    },
  };
};

// Updated document operations with project_id support (backward compatible)
export const documentService = {
  // Get documents by project ID (new preferred method)
  async getByProjectId(projectId: string): Promise<ClientDocument[]> {
    const { data, error } = await supabase
      .from("client_documents")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get documents by client ID (for backward compatibility)
  async getByClientId(clientId: string): Promise<ClientDocument[]> {
    const { data, error } = await supabase
      .from("client_documents")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Updated upload method with project support
  async upload(
    file: File,
    clientId: string,
    metadata: {
      title: string;
      description?: string;
      category?: string;
      tags?: string[];
      projectId?: string; // Optional project association
    }
  ): Promise<ClientDocument> {
    // Upload file to Supabase Storage
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const projectPath = metadata.projectId ? `/${metadata.projectId}` : "";
    const filePath = `client-documents/${clientId}${projectPath}/${fileName}`;

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
          project_id: metadata.projectId,
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

// Updated message operations with project_id support (backward compatible)
export const messageService = {
  // Get messages by project ID (new preferred method)
  async getByProjectId(projectId: string): Promise<ClientMessage[]> {
    const { data, error } = await supabase
      .from("client_messages")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at");

    if (error) throw error;
    return data;
  },

  // Get messages by client ID (for backward compatibility)
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

  // Mark messages as read
  async markAsRead(messageIds: string[]): Promise<void> {
    const { error } = await supabase
      .from("client_messages")
      .update({ is_read: true })
      .in("id", messageIds);

    if (error) throw error;
  },
};
