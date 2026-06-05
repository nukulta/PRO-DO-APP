import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Users, 
  MoreHorizontal, 
  Trash2, 
  Mail,
  UserPlus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Tables } from '@/integrations/supabase/types';

type TeamMember = Tables<'team_members'>;

interface TeamViewProps {
  teamMembers: TeamMember[];
  onCreateMember: (name: string, email?: string, role?: string) => void;
  onDeleteMember: (id: string) => void;
}

const roles = [
  { value: 'admin', label: 'Admin', color: 'bg-primary/20 text-primary' },
  { value: 'member', label: 'Member', color: 'bg-muted text-muted-foreground' },
  { value: 'viewer', label: 'Viewer', color: 'bg-secondary text-secondary-foreground' },
];

export function TeamView({ teamMembers, onCreateMember, onDeleteMember }: TeamViewProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('member');

  const handleCreate = () => {
    if (newName.trim()) {
      onCreateMember(newName.trim(), newEmail || undefined, newRole);
      setNewName('');
      setNewEmail('');
      setNewRole('member');
      setIsDialogOpen(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadge = (role: string | null) => {
    const r = roles.find(rl => rl.value === role) || roles[1];
    return <Badge variant="secondary" className={r.color}>{r.label}</Badge>;
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Team</h1>
          <p className="text-muted-foreground">
            Manage your workspace members.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreate} className="flex-1">
                  Add Member
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {teamMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map((member, index) => (
            <Card 
              key={member.id} 
              className="hover-lift animate-slide-up group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={member.avatar_url || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
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
                        onClick={() => onDeleteMember(member.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                
                {member.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Mail className="w-4 h-4" />
                    {member.email}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  {getRoleBadge(member.role)}
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${
                      member.status === 'online' ? 'bg-success' : 'bg-muted-foreground'
                    }`} />
                    <span className="text-xs text-muted-foreground capitalize">
                      {member.status}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-xl font-semibold mb-2">No team members yet</h3>
          <p className="text-muted-foreground mb-6">
            Add team members to collaborate together.
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add First Member
          </Button>
        </div>
      )}
    </div>
  );
}
