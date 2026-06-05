import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { Plus, Loader2 } from "lucide-react"

interface CreateTaskDialogProps {
    onCreate: (task: { title: string; description: string; priority: 'low' | 'medium' | 'high'; status: 'todo' | 'in-progress' | 'done'; due_date?: string }) => Promise<void>;
    trigger?: React.ReactNode;
}

export function CreateTaskDialog({ onCreate, trigger }: CreateTaskDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>("medium");
    const [dueDate, setDueDate] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        try {
            await onCreate({
                title,
                description,
                priority,
                status: 'todo',
                due_date: dueDate || undefined
            });
            setOpen(false);
            setTitle("");
            setDescription("");
            setPriority("medium");
            setDueDate("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" className="w-full h-12 border-dashed border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200">
                        <Plus className="mr-2 h-4 w-4" /> Add New Task
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-[#0a0a0a] border-[#333] text-zinc-100">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Create Task</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Add a new task to your board. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-zinc-300">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Redesign Homepage"
                            className="bg-[#111] border-[#333] text-zinc-100 focus:ring-zinc-700"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-zinc-300">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add details about this task..."
                            className="bg-[#111] border-[#333] text-zinc-100 focus:ring-zinc-700 min-h-[100px]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-zinc-300">Priority</Label>
                            <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                                <SelectTrigger className="bg-[#111] border-[#333] text-zinc-100">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#111] border-[#333] text-zinc-100">
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="due_date" className="text-zinc-300">Due Date</Label>
                        <Input
                            id="due_date"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="bg-[#111] border-[#333] text-zinc-100 focus:ring-zinc-700"
                        />
                    </div>


                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="ghost" className="text-zinc-400 hover:text-zinc-100 hover:bg-white/5">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading} className="bg-white text-black hover:bg-zinc-200 disabled:opacity-50">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Task
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
