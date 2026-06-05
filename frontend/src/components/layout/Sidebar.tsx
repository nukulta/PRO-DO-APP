import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  CheckSquare, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Home,
  Search,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Tables } from '@/integrations/supabase/types';

type Page = Tables<'pages'>;

interface SidebarProps {
  pages: Page[];
  currentView: string;
  onViewChange: (view: string) => void;
  onPageSelect: (page: Page) => void;
  selectedPageId?: string;
  onCreatePage: () => void;
}

export function Sidebar({ 
  pages, 
  currentView, 
  onViewChange, 
  onPageSelect, 
  selectedPageId,
  onCreatePage 
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'pages', label: 'Pages', icon: FileText },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'team', label: 'Team', icon: Users },
  ];

  return (
    <aside 
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-sidebar-foreground">Workspace</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="p-3">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:bg-sidebar-accent"
          >
            <Search className="w-4 h-4 mr-2" />
            Search...
          </Button>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full justify-start transition-colors",
                collapsed ? "px-3" : "px-3",
                currentView === item.id 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <item.icon className={cn("w-4 h-4", !collapsed && "mr-3")} />
              {!collapsed && item.label}
            </Button>
          ))}
        </nav>

        {/* Pages List */}
        {!collapsed && currentView === 'pages' && (
          <div className="mt-6">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Pages
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-muted-foreground hover:text-foreground"
                onClick={onCreatePage}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            <div className="space-y-0.5">
              {pages.map((page) => (
                <Button
                  key={page.id}
                  variant="ghost"
                  onClick={() => onPageSelect(page)}
                  className={cn(
                    "w-full justify-start text-sm px-3 py-1.5 h-auto",
                    selectedPageId === page.id 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <span className="mr-2">{page.icon}</span>
                  <span className="truncate">{page.title}</span>
                </Button>
              ))}
              {pages.length === 0 && (
                <p className="text-xs text-muted-foreground px-3 py-2">
                  No pages yet
                </p>
              )}
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Settings */}
      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent",
            collapsed && "px-3"
          )}
        >
          <Settings className={cn("w-4 h-4", !collapsed && "mr-3")} />
          {!collapsed && "Settings"}
        </Button>
      </div>
    </aside>
  );
}
