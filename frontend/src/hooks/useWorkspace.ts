import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type Workspace = Tables<'workspaces'>;
type Page = Tables<'pages'>;
type Task = Tables<'tasks'>;
type TeamMember = Tables<'team_members'>;

export function useWorkspace() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch workspaces
  useEffect(() => {
    fetchWorkspaces();
  }, []);

  // Fetch workspace data when current workspace changes
  useEffect(() => {
    if (currentWorkspace) {
      fetchPages();
      fetchTasks();
      fetchTeamMembers();
    }
  }, [currentWorkspace?.id]);

  async function fetchWorkspaces() {
    setLoading(true);
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data && data.length > 0) {
      setWorkspaces(data);
      setCurrentWorkspace(data[0]);
    } else if (!error) {
      // Create default workspace if none exists
      const { data: newWorkspace } = await supabase
        .from('workspaces')
        .insert({ name: 'My Workspace', icon: '🏢', description: 'Default workspace' })
        .select()
        .single();
      
      if (newWorkspace) {
        setWorkspaces([newWorkspace]);
        setCurrentWorkspace(newWorkspace);
      }
    }
    setLoading(false);
  }

  async function fetchPages() {
    if (!currentWorkspace) return;
    const { data } = await supabase
      .from('pages')
      .select('*')
      .eq('workspace_id', currentWorkspace.id)
      .order('created_at', { ascending: false });
    
    if (data) setPages(data);
  }

  async function fetchTasks() {
    if (!currentWorkspace) return;
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('workspace_id', currentWorkspace.id)
      .order('created_at', { ascending: false });
    
    if (data) setTasks(data);
  }

  async function fetchTeamMembers() {
    if (!currentWorkspace) return;
    const { data } = await supabase
      .from('team_members')
      .select('*')
      .eq('workspace_id', currentWorkspace.id)
      .order('created_at', { ascending: false });
    
    if (data) setTeamMembers(data);
  }

  async function createPage(title: string, icon?: string) {
    if (!currentWorkspace) return null;
    const { data, error } = await supabase
      .from('pages')
      .insert({ 
        title, 
        icon: icon || '📄', 
        workspace_id: currentWorkspace.id,
        content: ''
      })
      .select()
      .single();
    
    if (data) {
      setPages(prev => [data, ...prev]);
    }
    return data;
  }

  async function updatePage(id: string, updates: Partial<Page>) {
    const { data, error } = await supabase
      .from('pages')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (data) {
      setPages(prev => prev.map(p => p.id === id ? data : p));
    }
    return data;
  }

  async function deletePage(id: string) {
    await supabase.from('pages').delete().eq('id', id);
    setPages(prev => prev.filter(p => p.id !== id));
  }

  async function createTask(title: string, status?: string, priority?: string) {
    if (!currentWorkspace) return null;
    const { data } = await supabase
      .from('tasks')
      .insert({ 
        title, 
        status: status || 'todo',
        priority: priority || 'medium',
        workspace_id: currentWorkspace.id 
      })
      .select()
      .single();
    
    if (data) {
      setTasks(prev => [data, ...prev]);
    }
    return data;
  }

  async function updateTask(id: string, updates: Partial<Task>) {
    const { data } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (data) {
      setTasks(prev => prev.map(t => t.id === id ? data : t));
    }
    return data;
  }

  async function deleteTask(id: string) {
    await supabase.from('tasks').delete().eq('id', id);
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  async function createTeamMember(name: string, email?: string, role?: string) {
    if (!currentWorkspace) return null;
    const { data } = await supabase
      .from('team_members')
      .insert({ 
        name, 
        email,
        role: role || 'member',
        status: 'offline',
        workspace_id: currentWorkspace.id 
      })
      .select()
      .single();
    
    if (data) {
      setTeamMembers(prev => [data, ...prev]);
    }
    return data;
  }

  async function deleteTeamMember(id: string) {
    await supabase.from('team_members').delete().eq('id', id);
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  }

  return {
    workspaces,
    currentWorkspace,
    setCurrentWorkspace,
    pages,
    tasks,
    teamMembers,
    loading,
    createPage,
    updatePage,
    deletePage,
    createTask,
    updateTask,
    deleteTask,
    createTeamMember,
    deleteTeamMember,
    refetch: {
      pages: fetchPages,
      tasks: fetchTasks,
      teamMembers: fetchTeamMembers,
    }
  };
}
