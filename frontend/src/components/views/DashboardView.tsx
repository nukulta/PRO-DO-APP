import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckSquare, Users, Clock, TrendingUp, Zap } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Page = Tables<'pages'>;
type Task = Tables<'tasks'>;
type TeamMember = Tables<'team_members'>;

interface DashboardViewProps {
  pages: Page[];
  tasks: Task[];
  teamMembers: TeamMember[];
}

export function DashboardView({ pages, tasks, teamMembers }: DashboardViewProps) {
  const todoTasks = tasks.filter(t => t.status === 'todo').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;

  const stats = [
    { 
      label: 'Total Pages', 
      value: pages.length, 
      icon: FileText, 
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    { 
      label: 'Active Tasks', 
      value: todoTasks + inProgressTasks, 
      icon: CheckSquare, 
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    { 
      label: 'Team Members', 
      value: teamMembers.length, 
      icon: Users, 
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    { 
      label: 'Completed', 
      value: completedTasks, 
      icon: TrendingUp, 
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
  ];

  const recentPages = pages.slice(0, 5);
  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
        <p className="text-muted-foreground">
          Here's what's happening in your workspace today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={stat.label} className="hover-lift animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Pages */}
        <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-primary" />
              Recent Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentPages.length > 0 ? (
              <div className="space-y-3">
                {recentPages.map((page) => (
                  <div 
                    key={page.id} 
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                  >
                    <span className="text-xl">{page.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{page.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Updated {new Date(page.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No pages yet. Create your first page!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card className="animate-slide-up" style={{ animationDelay: '250ms' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckSquare className="w-5 h-5 text-warning" />
              Recent Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentTasks.length > 0 ? (
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      task.status === 'done' ? 'bg-success' : 
                      task.status === 'in_progress' ? 'bg-warning' : 'bg-muted-foreground'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {task.status?.replace('_', ' ')} • {task.priority} priority
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No tasks yet. Add your first task!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5 text-primary" />
            Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              <h4 className="font-medium mb-1">Create Pages</h4>
              <p className="text-sm text-muted-foreground">
                Organize your thoughts and documentation in pages.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-warning/5 border border-warning/10">
              <h4 className="font-medium mb-1">Manage Tasks</h4>
              <p className="text-sm text-muted-foreground">
                Track your work with a Kanban-style task board.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-success/5 border border-success/10">
              <h4 className="font-medium mb-1">Collaborate</h4>
              <p className="text-sm text-muted-foreground">
                Add team members to work together.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
