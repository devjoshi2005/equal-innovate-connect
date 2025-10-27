import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useParams } from 'react-router-dom';
import { Home, Edit, Trash2, Users, Target } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const ViewProject = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      if (!id) throw new Error('No project ID');
      const { data, error } = await supabase
        .from('collaboration_projects')
        .select(`
          *,
          users (username, email)
        `)
        .eq('project_id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async () => {
      if (!id || !user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('collaboration_projects')
        .delete()
        .eq('project_id', id)
        .eq('created_by', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-projects'] });
      toast.success('Project deleted successfully');
      navigate('/projects');
    },
    onError: () => {
      toast.error('Failed to delete project');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  const sdgAlignment = (project.sdg_alignment as string[]) || [];
  const teamMembers = (project.team_members as string[]) || [];
  const impactMetrics = (project.impact_metrics as string[]) || [];
  const isOwner = user?.id === project.created_by;
  const creator = project.users as any;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              {project.title}
            </h1>
            <div className="flex gap-2">
              {isOwner && (
                <>
                  <Button onClick={() => navigate(`/project/update/${id}`)} variant="outline" className="gap-2">
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="gap-2">
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Project</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this project? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteProjectMutation.mutate()}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
              <Button onClick={() => navigate('/')} variant="outline" className="gap-2">
                <Home className="w-4 h-4" />
                Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2">{project.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Created by {creator?.username || creator?.email || 'Unknown'}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {sdgAlignment.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">SDG Alignment</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sdgAlignment.map((sdg, idx) => (
                      <Badge key={idx} className="bg-gradient-to-r from-primary/80 to-accent/80">
                        {sdg}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{project.description}</p>
              </div>

              {teamMembers.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-secondary" />
                    <h3 className="font-semibold">Team Members</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {teamMembers.map((member, idx) => (
                      <Badge key={idx} variant="secondary">
                        {member}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {impactMetrics.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Impact Metrics</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {impactMetrics.map((metric, idx) => (
                      <li key={idx} className="text-muted-foreground">
                        {metric}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewProject;
