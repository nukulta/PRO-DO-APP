import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  MoreHorizontal, 
  Trash2, 
  Calendar,
  Flag,
  CheckCircle2,
  Circle,
  Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Tables } from '@/integrations/supabase/types';

type Task = Tables<'tasks'>;

interface TasksViewProps {
  tasks: Task[];
  onCreateTask: (title: string, status?: string, priority?: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

const columns = [
  { id: 'todo', label: 'To Do', icon: Circle, color: 'text-muted-foreground' },
  { id: 'in_progress', label: 'In Progress', icon: Clock, color: 'text-warning' },
  { id: 'done', label: 'Done', icon: CheckCircle2, color: 'text-success' },
];

const priorities = [
  { value: 'low', label: 'Low', color: 'bg-muted text-muted-foreground' },
  { value: 'medium', label: 'Medium', color: 'bg-warning/20 text-warning' },
  { value: 'high', label: 'High', color: 'bg-destructive/20 text-destructive' },
];

export function TasksView({ tasks, onCreateTask, onUpdateTask, onDeleteTask }: TasksViewProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null);

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const handleCreateTask = (status: string) => {
    if (newTaskTitle.trim()) {
      onCreateTask(newTaskTitle.trim(), status, 'medium');
      setNewTaskTitle('');
      setAddingToColumn(null);
    }
  };

  const getPriorityBadge = (priority: string | null) => {
    const p = priorities.find(pr => pr.value === priority) || priorities[1];
    return <Badge variant="secondary" className={p.color}>{p.label}</Badge>;
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tasks</h1>
        <p className="text-muted-foreground">
          Manage your tasks with a Kanban board.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column, colIndex) => {
          const columnTasks = getTasksByStatus(column.id);
          const Icon = column.icon;
          
          return (
            <div 
              key={column.id} 
              className="animate-slide-up"
              style={{ animationDelay: `${colIndex * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${column.color}`} />
                  <h2 className="font-semibold">{column.label}</h2>
                  <Badge variant="secondary" className="ml-1">
                    {columnTasks.length}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setAddingToColumn(column.id)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3 min-h-[200px] p-3 bg-muted/30 rounded-xl">
                {/* Add task input */}
                {addingToColumn === column.id && (
                  <Card className="animate-scale-in">
                    <CardContent className="p-3">
                      <Input
                        placeholder="Task title..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCreateTask(column.id);
                          if (e.key === 'Escape') setAddingToColumn(null);
                        }}
                        autoFocus
                        className="mb-2"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleCreateTask(column.id)}>
                          Add
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            setAddingToColumn(null);
                            setNewTaskTitle('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Task cards */}
                {columnTasks.map((task, index) => (
                  <Card 
                    key={task.id} 
                    className="hover-lift group animate-fade-in"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-medium ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => onUpdateTask(task.id, { status: 'todo' })}
                              disabled={task.status === 'todo'}
                            >
                              <Circle className="w-4 h-4 mr-2" /> To Do
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onUpdateTask(task.id, { status: 'in_progress' })}
                              disabled={task.status === 'in_progress'}
                            >
                              <Clock className="w-4 h-4 mr-2" /> In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onUpdateTask(task.id, { status: 'done' })}
                              disabled={task.status === 'done'}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" /> Done
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => onDeleteTask(task.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {task.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        {getPriorityBadge(task.priority)}
                        {task.due_date && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {new Date(task.due_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {columnTasks.length === 0 && addingToColumn !== column.id && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
