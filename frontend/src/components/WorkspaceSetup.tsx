import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Users, Plus, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface WorkspaceSetupProps {
    onWorkspaceJoined: () => void;
    userId: string;
}

export function WorkspaceSetup({ onWorkspaceJoined, userId }: WorkspaceSetupProps) {
    const [isCreating, setIsCreating] = useState(true);
    const [name, setName] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Create Workspace
            const { data: ws, error: wsError } = await (supabase as any)
                .from('workspaces')
                .insert({ name, owner_id: userId })
                .select()
                .single();

            if (wsError) throw wsError;

            // 2. Add as Member
            const { error: memError } = await (supabase as any)
                .from('workspace_members')
                .insert({ workspace_id: ws.id, user_id: userId });

            if (memError) throw memError;

            toast.success("Workspace created!");
            onWorkspaceJoined();
        } catch (error: any) {
            console.error('Create error:', error);
            toast.error(error.message || "Failed to create workspace");
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Find Workspace by Code
            const { data: wsData, error: wsError } = await (supabase as any)
                .from('workspaces')
                .select('id')
                .eq('join_code', joinCode)
                .single();

            if (wsError || !wsData) {
                toast.error("Invalid join code");
                setLoading(false);
                return;
            }

            // 2. Add as Member
            const { error: memError } = await (supabase as any)
                .from('workspace_members')
                .insert({ workspace_id: wsData.id, user_id: userId });

            if (memError) {
                if (memError.code === '23505') { // Unique violation
                    toast.info("You are already a member of this workspace");
                    onWorkspaceJoined();
                } else {
                    throw memError;
                }
            } else {
                toast.success("Joined workspace successfully!");
                onWorkspaceJoined();
            }
        } catch (error: any) {
            console.error('Join error:', error);
            toast.error(error.message || "Failed to join workspace");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={true}>
            <DialogContent className="sm:max-w-md bg-[#0a0a0a] border-[#222] text-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center mb-2">
                        {isCreating ? "Welcome to Armin" : "Join Your Team"}
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-400">
                        {isCreating
                            ? "Create a new workspace to start collaborating with your team."
                            : "Enter the code shared by your admin to join existing projects."}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-6 py-4">
                    <div className="flex bg-[#111] p-1 rounded-lg border border-[#222]">
                        <button
                            onClick={() => setIsCreating(true)}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isCreating ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}
                        >
                            Create Workspace
                        </button>
                        <button
                            onClick={() => setIsCreating(false)}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isCreating ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}
                        >
                            Join Existing
                        </button>
                    </div>

                    {isCreating ? (
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="ws-name" className="text-zinc-300">Workspace Name</Label>
                                <Input
                                    id="ws-name"
                                    placeholder="e.g. Acme Corp, Design Team"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="bg-[#1a1a1a] border-[#333] text-white focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={loading} className="w-full bg-white text-black hover:bg-zinc-200">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create & Continue <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleJoin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="join-code" className="text-zinc-300">Join Code</Label>
                                <div className="relative">
                                    <Input
                                        id="join-code"
                                        placeholder="e.g. a7b2c9"
                                        value={joinCode}
                                        onChange={e => setJoinCode(e.target.value)}
                                        className="bg-[#1a1a1a] border-[#333] text-white focus:ring-indigo-500 pl-10"
                                        required
                                    />
                                    <Users className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                </div>
                            </div>
                            <Button type="submit" disabled={loading} className="w-full bg-white text-black hover:bg-zinc-200">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Join Workspace <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
