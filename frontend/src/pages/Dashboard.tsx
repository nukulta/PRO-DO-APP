import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { Plus, Layout, Calendar, Settings, MessageSquare, LogOut, CheckCircle2, Circle, Clock, Loader2, Copy, Users } from 'lucide-react';
import { toast } from "sonner";
import { motion, AnimatePresence } from 'framer-motion';
import { CreateTaskDialog } from '@/components/CreateTaskDialog';
import { ChatView } from '@/components/ChatView';
import { TimelineView } from '@/components/TimelineView';
import { WorkspaceSetup } from '@/components/WorkspaceSetup';

// Types
type Task = {
    id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in-progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    due_date?: string;
    project_id?: string;
};

type Workspace = {
    id: string;
    name: string;
    join_code?: string;
    owner_id: string;
};

type Project = {
    id: string;
    name: string;
    workspace_id: string;
};

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'board' | 'list' | 'timeline' | 'chat'>('board');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [session, setSession] = useState<any>(null);

    // Workspace State
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
    const [showWorkspaceSetup, setShowWorkspaceSetup] = useState(false);

    // Project State
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeProject, setActiveProject] = useState<Project | null>(null); // null means "All Tasks"
    const [isCreatingProject, setIsCreatingProject] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");

    // Initial Data Fetch & Subscription
    useEffect(() => {
        let channel: ReturnType<typeof supabase.channel>;

        const init = async () => {
            try {
                setLoading(true);
                // 1. Check Session
                const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError || !currentSession) {
                    navigate('/login');
                    return;
                }

                setSession(currentSession);
                if (currentSession.user.email) {
                    setUserName(currentSession.user.email.split('@')[0]);
                }

                // 2. Fetch Workspaces
                const { data: wsMembers, error: wsError } = await (supabase as any)
                    .from('workspace_members')
                    .select('workspace_id, workspaces(id, name, join_code, owner_id)')
                    .eq('user_id', currentSession.user.id);

                if (wsError) throw wsError;

                const validWorkspaces = wsMembers?.map((wm: any) => wm.workspaces).filter(Boolean) || [];
                setWorkspaces(validWorkspaces);

                if (validWorkspaces.length === 0) {
                    setShowWorkspaceSetup(true);
                    setLoading(false);
                    return; // Stop here, wait for setup
                }

                const activeWs = validWorkspaces[0]; // Default to first for now
                setCurrentWorkspace(activeWs);

                // 3. Fetch Projects for this Workspace
                fetchProjects(activeWs.id);

                // 4. Fetch Tasks (initially all for workspace)
                fetchTasks(activeWs.id, null);

                // 5. Realtime Subscription
                setupRealtime(activeWs.id);

            } catch (error) {
                console.error('Dashboard init error:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchProjects = async (workspaceId: string) => {
            const { data, error } = await (supabase as any)
                .from('projects')
                .select('*')
                .eq('workspace_id', workspaceId)
                .order('created_at', { ascending: true });

            if (!error && data) {
                setProjects(data);
            }
        };

        const fetchTasks = async (workspaceId: string, projectId: string | null) => {
            let query = (supabase.from('tasks') as any)
                .select('*')
                .eq('workspace_id', workspaceId)
                .order('created_at', { ascending: false });

            if (projectId) {
                query = query.eq('project_id', projectId);
            }

            const { data: tasksData, error: tasksError } = await query;

            if (!tasksError) {
                setTasks((tasksData as any[])?.map(t => ({
                    id: t.id,
                    title: t.title,
                    status: t.status,
                    priority: t.priority,
                    description: t.description,
                    due_date: t.due_date,
                    project_id: t.project_id
                })) || []);
            }
        };

        const setupRealtime = (workspaceId: string) => {
            channel = supabase
                .channel(`workspace-${workspaceId}`)
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'tasks',
                        filter: `workspace_id=eq.${workspaceId}`
                    },
                    (payload) => {
                        if (payload.eventType === 'INSERT') {
                            const newTask = payload.new as any;
                            setTasks((prev) => [{
                                id: newTask.id,
                                title: newTask.title,
                                status: newTask.status,
                                priority: newTask.priority,
                                description: newTask.description,
                                due_date: newTask.due_date
                            }, ...prev]);
                            toast("New task added by teammate 🚀");
                        } else if (payload.eventType === 'UPDATE') {
                            const updatedTask = payload.new as any;
                            setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? {
                                ...t,
                                title: updatedTask.title,
                                status: updatedTask.status,
                                priority: updatedTask.priority,
                                description: updatedTask.description,
                                due_date: updatedTask.due_date
                            } : t)));
                        } else if (payload.eventType === 'DELETE') {
                            setTasks((prev) => prev.filter((t) => t.id !== payload.old.id));
                        }
                    }
                )
                .subscribe();
        };

        init();

        return () => {
            if (channel) supabase.removeChannel(channel);
        };
    }, [navigate]);

    const handleWorkspaceJoined = () => {
        setShowWorkspaceSetup(false);
        // Reload dashboard to fetch new workspace
        window.location.reload();
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const copyInviteCode = () => {
        if (currentWorkspace?.join_code) {
            navigator.clipboard.writeText(currentWorkspace.join_code);
            toast.success("Invite code copied to clipboard!");
        }
    };

    const updateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
        // Optimistic update
        setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

        try {
            const { error } = await supabase
                .from('tasks')
                .update({ status: newStatus })
                .eq('id', taskId);

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Error updating task:', error);
            toast.error("Failed to sync update");
        }
    };

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProjectName.trim() || !currentWorkspace) return;

        try {
            const { data, error } = await (supabase as any)
                .from('projects')
                .insert({
                    name: newProjectName,
                    workspace_id: currentWorkspace.id
                })
                .select()
                .single();

            if (error) throw error;

            setProjects(prev => [...prev, data]);
            setNewProjectName("");
            setIsCreatingProject(false);
            toast.success("Project created");
        } catch (error: any) {
            console.error('Error creating project:', error);
            toast.error(error.message);
        }
    };

    const handleCreateTask = async (taskData: { title: string; description: string; priority: 'low' | 'medium' | 'high'; status: 'todo' | 'in-progress' | 'done', due_date?: string }) => {
        if (!session?.user?.id || !currentWorkspace) return;

        try {
            const { data, error } = await (supabase.from('tasks') as any).insert({
                title: taskData.title,
                description: taskData.description,
                priority: taskData.priority,
                status: taskData.status,
                due_date: taskData.due_date,
                user_id: session.user.id,
                workspace_id: currentWorkspace.id,
                project_id: activeProject?.id
            })
                .select()
                .single();

            if (error) throw error;

            setTasks(prev => [data, ...prev]);
            toast.success("Task created successfully");
        } catch (error: any) {
            console.error('Error creating task:', error);
            toast.error(error.message || "Failed to create task");
        }
    };

    if (loading && !showWorkspaceSetup) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                    <p className="text-zinc-500 text-sm">Loading workspace...</p>
                </div>
            </div>
        );
    }

    if (showWorkspaceSetup && session) {
        return <WorkspaceSetup onWorkspaceJoined={handleWorkspaceJoined} userId={session.user.id} />
    }

    return (
        <div className="min-h-screen bg-black text-white flex font-sans selection:bg-indigo-500/30">
            {/* Sidebar */}
            <aside className="w-64 border-r border-[#222] hidden md:flex flex-col bg-[#050505]">
                <div className="p-6 border-b border-[#222]">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <div className="w-6 h-6 bg-gradient-to-br from-white to-zinc-400 rounded-md shadow-[0_0_15px_rgba(255,255,255,0.1)]"></div>
                        Prodo
                    </div>
                </div>

                <div className="p-4 space-y-8 flex-1 overflow-y-auto">
                    <div>
                        <div className="flex items-center justify-between px-2 mb-3">
                            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Workspace</div>
                        </div>

                        <div className="mb-6 px-3 py-3 bg-[#111] rounded-xl border border-[#222] shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                                    {currentWorkspace?.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="text-sm font-bold truncate">{currentWorkspace?.name}</div>
                                    <div className="text-[10px] text-zinc-500">Free Plan</div>
                                </div>
                            </div>
                            <button
                                onClick={copyInviteCode}
                                className="w-full mt-1 flex items-center justify-center gap-2 text-[10px] bg-white text-black py-1.5 rounded font-bold hover:bg-zinc-200 transition-colors"
                            >
                                <Users className="w-3 h-3" /> Invite Team
                            </button>
                        </div>

                        <nav className="space-y-1">
                            <button onClick={() => { setActiveTab('board'); setActiveProject(null); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'board' && !activeProject ? 'bg-white/5 text-white' : 'text-zinc-400 hover:text-white'}`}>
                                <Layout className="w-4 h-4" /> All Tasks
                            </button>
                            <button
                                onClick={() => setActiveTab('timeline')}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group ${activeTab === 'timeline'
                                    ? 'bg-white/5 text-white shadow-sm border border-white/5'
                                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Calendar className="w-4 h-4 opacity-70" /> Timeline
                            </button>
                            <button
                                onClick={() => setActiveTab('chat')}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group ${activeTab === 'chat'
                                    ? 'bg-white/5 text-white shadow-sm border border-white/5'
                                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <MessageSquare className="w-4 h-4 opacity-70" /> Chat
                            </button>
                        </nav>
                    </div>

                    <div>
                        <div className="flex items-center justify-between px-2 mb-3">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Projects</span>
                            <Plus
                                onClick={() => setIsCreatingProject(true)}
                                className="w-3 h-3 text-zinc-500 cursor-pointer hover:text-white transition-colors"
                            />
                        </div>

                        {/* Project Creation Input */}
                        {isCreatingProject && (
                            <form onSubmit={handleCreateProject} className="px-2 mb-2">
                                <input
                                    autoFocus
                                    className="w-full bg-[#111] border border-[#333] rounded px-2 py-1 text-xs text-white focus:border-indigo-500 outline-none"
                                    placeholder="Project Name..."
                                    value={newProjectName}
                                    onChange={e => setNewProjectName(e.target.value)}
                                    onBlur={() => !newProjectName && setIsCreatingProject(false)}
                                />
                            </form>
                        )}

                        <div className="space-y-1">
                            {projects.map(p => (
                                <div
                                    key={p.id}
                                    onClick={() => { setActiveProject(p); setActiveTab('board'); }}
                                    className={`px-3 py-2 text-xs font-medium cursor-pointer rounded-lg truncate transition-all flex items-center gap-2 ${activeProject?.id === p.id ? 'bg-white/5 text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'}`}
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div> {p.name}
                                </div>
                            ))}
                            {projects.length === 0 && !isCreatingProject && (
                                <div className="px-3 py-2 text-xs text-zinc-600 italic">No projects yet</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-[#222] bg-[#050505]">
                    <div className="flex items-center gap-3 mb-4 px-2 py-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-[10px] ring-2 ring-black group-hover:ring-white/10 transition-all">
                            {userName ? userName.slice(0, 2).toUpperCase() : 'ME'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="text-xs font-medium truncate">{userName || 'User'}</div>
                            <div className="text-[10px] text-zinc-500">Pro Plan</div>
                        </div>
                        <Settings className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-lg transition-colors border border-transparent hover:border-red-900/30"
                    >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#000000]">
                {/* Header */}
                <header className="h-14 border-b border-[#222] flex items-center justify-between px-6 bg-[#000000]/80 backdrop-blur-xl sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <h1 className="text-sm font-semibold text-zinc-100">
                            {activeProject ? activeProject.name : (activeTab === 'chat' ? 'Team Chat' : activeTab === 'timeline' ? 'Timeline' : 'All Tasks')}
                        </h1>
                        {activeProject && <span className="text-xs text-zinc-500 px-2 py-0.5 border border-[#333] rounded">Project</span>}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2 mr-2">
                            {/* Mock online users */}
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-7 h-7 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center text-[9px] text-zinc-400">U{i}</div>
                            ))}
                        </div>
                        <button onClick={copyInviteCode} className="bg-white text-black px-4 py-1.5 rounded-md text-xs font-semibold hover:bg-zinc-200 transition-colors shadow-[0_0_10px_rgba(255,255,255,0.1)] flex items-center gap-2">
                            <Copy className="w-3 h-3" /> Copy Invite Code
                        </button>
                    </div>
                </header>

                {/* Filters/Toolbar - View Dependent */}
                {activeTab !== 'chat' && (
                    <div className="h-12 border-b border-[#222] flex items-center px-6 gap-6 bg-[#000000]">
                        <div className="flex gap-6 text-sm font-medium h-full">
                            <button
                                onClick={() => setActiveTab('board')}
                                className={`h-full border-b-2 transition-all text-xs uppercase tracking-wide px-1 ${activeTab === 'board' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                            >
                                Kanban
                            </button>
                            <button
                                onClick={() => setActiveTab('list')}
                                className={`h-full border-b-2 transition-all text-xs uppercase tracking-wide px-1 ${activeTab === 'list' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                            >
                                List View
                            </button>
                            <button
                                onClick={() => setActiveTab('timeline')}
                                className={`h-full border-b-2 transition-all text-xs uppercase tracking-wide px-1 ${activeTab === 'timeline' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                            >
                                Timeline
                            </button>
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                            <CreateTaskDialog
                                onCreate={handleCreateTask}
                                trigger={
                                    <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                                        <Plus className="w-3.5 h-3.5" /> New Issue
                                    </button>
                                }
                            />
                        </div>
                    </div>
                )}

                {/* Content Area */}
                <div className="flex-1 overflow-hidden relative">
                    {activeTab === 'timeline' ? (
                        <div className="h-full overflow-hidden">
                            <TimelineView tasks={tasks} />
                        </div>
                    ) : activeTab === 'chat' && currentWorkspace ? (
                        <div className="h-full p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black">
                            <ChatView workspaceId={currentWorkspace.id} />
                        </div>
                    ) : (
                        // Board View (Kanban)
                        <div className="h-full overflow-x-auto p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black">
                            <div className="flex gap-6 h-full min-w-max">
                                {['todo', 'in-progress', 'done'].map(status => (
                                    <div key={status} className="w-80 flex flex-col gap-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${status === 'todo' ? 'bg-zinc-500' :
                                                    status === 'in-progress' ? 'bg-yellow-500' : 'bg-green-500'
                                                    }`} />
                                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                                    {status.replace('-', ' ')}
                                                </h3>
                                                <span className="ml-1 text-zinc-600 text-[10px] font-mono">{tasks.filter(t => t.status === status).length}</span>
                                            </div>
                                            <div className="flex gap-1">
                                                <Plus className="w-4 h-4 text-zinc-600 hover:text-white cursor-pointer transition-colors p-0.5" />
                                            </div>
                                        </div>

                                        <div className="space-y-3 flex-1">
                                            <AnimatePresence mode='popLayout'>
                                                {tasks.filter(t => t.status === status).map(task => (
                                                    <motion.div
                                                        key={task.id}
                                                        layoutId={task.id}
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        className="group bg-[#080808] p-4 rounded-xl border border-[#222] hover:border-[#444] hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-grab active:cursor-grabbing transition-all relative overflow-hidden"
                                                    >
                                                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                                        <div className="flex justify-between items-start mb-3">
                                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${task.priority === 'high' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                                                                task.priority === 'medium' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
                                                                    'bg-blue-500/10 border-blue-500/20 text-blue-500'
                                                                }`}>
                                                                {task.priority}
                                                            </span>
                                                        </div>

                                                        <h4 className="text-sm font-medium text-zinc-200 mb-2 leading-snug group-hover:text-white transition-colors">
                                                            {task.title}
                                                        </h4>
                                                        {task.description && (
                                                            <p className="text-xs text-zinc-500 mb-4 line-clamp-2">{task.description}</p>
                                                        )}

                                                        <div className="flex items-center justify-between pt-2 border-t border-[#1a1a1a]">
                                                            <div className="flex -space-x-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
                                                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-[#222]"></div>
                                                            </div>
                                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-200">
                                                                {status !== 'todo' && (
                                                                    <button title="Move to Todo" onClick={() => updateTaskStatus(task.id, 'todo')} className="p-1.5 hover:bg-zinc-800 rounded text-zinc-500 hover:text-zinc-300">
                                                                        <Circle className="w-3.5 h-3.5" />
                                                                    </button>
                                                                )}
                                                                {status !== 'in-progress' && (
                                                                    <button title="Move to In Progress" onClick={() => updateTaskStatus(task.id, 'in-progress')} className="p-1.5 hover:bg-zinc-800 rounded text-zinc-500 hover:text-yellow-500">
                                                                        <Clock className="w-3.5 h-3.5" />
                                                                    </button>
                                                                )}
                                                                {status !== 'done' && (
                                                                    <button title="Move to Done" onClick={() => updateTaskStatus(task.id, 'done')} className="p-1.5 hover:bg-zinc-800 rounded text-zinc-500 hover:text-green-500">
                                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>

                                            <CreateTaskDialog
                                                onCreate={handleCreateTask}
                                                trigger={
                                                    <button className="w-full py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50 rounded-lg border border-dashed border-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-center gap-2 group">
                                                        <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Add Task
                                                    </button>
                                                }
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
