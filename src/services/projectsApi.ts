import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Project = Database['public']['Tables']['collaboration_projects']['Row'];
type ProjectInsert = Database['public']['Tables']['collaboration_projects']['Insert'];
type ProjectUpdate = Database['public']['Tables']['collaboration_projects']['Update'];

export interface ProjectFilters {
  sdg_alignment?: string[];
  search?: string;
  created_by?: string;
}

export interface ProjectWithCreator extends Project {
  creator?: {
    username: string;
    email: string;
  };
}

export const projectsApi = {
  // Get all projects with optional filters
  async getProjects(filters?: ProjectFilters): Promise<ProjectWithCreator[]> {
    let query = supabase
      .from('collaboration_projects')
      .select(`
        *,
        creator:users!collaboration_projects_created_by_fkey(username, email)
      `)
      .order('created_at', { ascending: false });

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters?.created_by) {
      query = query.eq('created_by', filters.created_by);
    }

    if (filters?.sdg_alignment && filters.sdg_alignment.length > 0) {
      query = query.contains('sdg_alignment', filters.sdg_alignment);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Get a single project by ID
  async getProject(projectId: string): Promise<ProjectWithCreator | null> {
    const { data, error } = await supabase
      .from('collaboration_projects')
      .select(`
        *,
        creator:users!collaboration_projects_created_by_fkey(username, email)
      `)
      .eq('project_id', projectId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      throw error;
    }
    return data;
  },

  // Create a new project
  async createProject(project: ProjectInsert): Promise<Project> {
    const { data, error } = await supabase
      .from('collaboration_projects')
      .insert(project)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update an existing project
  async updateProject(projectId: string, updates: ProjectUpdate): Promise<Project> {
    const { data, error } = await supabase
      .from('collaboration_projects')
      .update(updates)
      .eq('project_id', projectId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a project
  async deleteProject(projectId: string): Promise<void> {
    const { error } = await supabase
      .from('collaboration_projects')
      .delete()
      .eq('project_id', projectId);

    if (error) throw error;
  },

  // Join a project (add user to team_members)
  async joinProject(projectId: string, userId: string): Promise<void> {
    const { data: project, error: fetchError } = await supabase
      .from('collaboration_projects')
      .select('team_members')
      .eq('project_id', projectId)
      .single();

    if (fetchError) throw fetchError;

    const currentMembers = (project.team_members as string[]) || [];
    if (currentMembers.includes(userId)) {
      throw new Error('User is already a member of this project');
    }

    const updatedMembers = [...currentMembers, userId];

    const { error: updateError } = await supabase
      .from('collaboration_projects')
      .update({ team_members: updatedMembers })
      .eq('project_id', projectId);

    if (updateError) throw updateError;
  },

  // Leave a project (remove user from team_members)
  async leaveProject(projectId: string, userId: string): Promise<void> {
    const { data: project, error: fetchError } = await supabase
      .from('collaboration_projects')
      .select('team_members')
      .eq('project_id', projectId)
      .single();

    if (fetchError) throw fetchError;

    const currentMembers = (project.team_members as string[]) || [];
    const updatedMembers = currentMembers.filter(id => id !== userId);

    const { error: updateError } = await supabase
      .from('collaboration_projects')
      .update({ team_members: updatedMembers })
      .eq('project_id', projectId);

    if (updateError) throw updateError;
  },

  // Get user's projects
  async getUserProjects(userId: string): Promise<ProjectWithCreator[]> {
    const { data, error } = await supabase
      .from('collaboration_projects')
      .select(`
        *,
        creator:users!collaboration_projects_created_by_fkey(username, email)
      `)
      .or(`created_by.eq.${userId},team_members.cs.{${userId}}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};
