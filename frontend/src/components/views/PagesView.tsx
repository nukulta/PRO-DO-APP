import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  FileText, 
  MoreHorizontal, 
  Trash2, 
  Edit3,
  ArrowLeft,
  Save
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Tables } from '@/integrations/supabase/types';

type Page = Tables<'pages'>;

interface PagesViewProps {
  pages: Page[];
  selectedPage: Page | null;
  onSelectPage: (page: Page | null) => void;
  onCreatePage: (title: string) => void;
  onUpdatePage: (id: string, updates: Partial<Page>) => void;
  onDeletePage: (id: string) => void;
}

export function PagesView({ 
  pages, 
  selectedPage, 
  onSelectPage, 
  onCreatePage, 
  onUpdatePage,
  onDeletePage 
}: PagesViewProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [editingContent, setEditingContent] = useState('');
  const [editingTitle, setEditingTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleCreate = () => {
    if (newTitle.trim()) {
      onCreatePage(newTitle.trim());
      setNewTitle('');
      setIsCreating(false);
    }
  };

  const handleStartEdit = () => {
    if (selectedPage) {
      setEditingTitle(selectedPage.title);
      setEditingContent(selectedPage.content || '');
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if (selectedPage) {
      onUpdatePage(selectedPage.id, { 
        title: editingTitle, 
        content: editingContent 
      });
      setIsEditing(false);
    }
  };

  // Page detail view
  if (selectedPage) {
    return (
      <div className="p-8 animate-fade-in max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => onSelectPage(null)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Pages
        </Button>

        <div className="space-y-6">
          {isEditing ? (
            <>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedPage.icon}</span>
                <Input
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="text-3xl font-bold border-none bg-transparent p-0 h-auto focus-visible:ring-0"
                  placeholder="Page title"
                />
              </div>
              <Textarea
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                className="min-h-[400px] text-lg leading-relaxed resize-none"
                placeholder="Start writing..."
              />
              <div className="flex gap-2">
                <Button onClick={handleSaveEdit}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedPage.icon}</span>
                  <h1 className="text-3xl font-bold">{selectedPage.title}</h1>
                </div>
                <Button variant="outline" size="sm" onClick={handleStartEdit}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date(selectedPage.updated_at).toLocaleString()}
              </p>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                {selectedPage.content ? (
                  <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                    {selectedPage.content}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">
                    This page is empty. Click Edit to add content.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Pages list view
  return (
    <div className="p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Pages</h1>
          <p className="text-muted-foreground">
            Create and organize your documentation.
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Page
        </Button>
      </div>

      {/* Create new page */}
      {isCreating && (
        <Card className="mb-6 animate-scale-in">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Input
                placeholder="Page title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                autoFocus
              />
              <Button onClick={handleCreate}>Create</Button>
              <Button variant="outline" onClick={() => {
                setIsCreating(false);
                setNewTitle('');
              }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pages grid */}
      {pages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page, index) => (
            <Card 
              key={page.id} 
              className="hover-lift cursor-pointer animate-slide-up group"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => onSelectPage(page)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{page.icon}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePage(page.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <h3 className="font-semibold text-lg mb-2 truncate">{page.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {page.content || 'Empty page'}
                </p>
                <p className="text-xs text-muted-foreground mt-4">
                  {new Date(page.updated_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-xl font-semibold mb-2">No pages yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first page to start documenting.
          </p>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Page
          </Button>
        </div>
      )}
    </div>
  );
}
