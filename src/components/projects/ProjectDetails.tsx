import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, 
  Target, 
  Calendar, 
  MapPin, 
  Heart, 
  Share2, 
  MessageCircle, 
  ExternalLink,
  ArrowLeft,
  UserPlus,
  X
} from 'lucide-react';
import { projectsApi, ProjectWithCreator } from '@/services/projectsApi';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProjectDetailsProps {
  projectId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDetails = ({ projectId, isOpen, onClose }: ProjectDetailsProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(false);

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectId ? projectsApi.getProject(projectId) : null,
    enabled: !!projectId && isOpen,
  });

  const joinProjectMutation = useMutation({
    mutationFn: ({ projectId, userId }: { projectId: string; userId: string }) =>
      projectsApi.joinProject(projectId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Successfully joined the project!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const leaveProjectMutation = useMutation({
    mutationFn: ({ projectId, userId }: { projectId: string; userId: string }) =>
      projectsApi.leaveProject(projectId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Left the project successfully');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const getSDGBadgeColor = (sdg: string) => {
    const colors: { [key: string]: string } = {
      '5': 'bg-pink-100 text-pink-800 border-pink-200',
      '9': 'bg-blue-100 text-blue-800 border-blue-200',
      '10': 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[sdg] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getSDGName = (sdg: string) => {
    const names: { [key: string]: string } = {
      '5': 'Gender Equality',
      '9': 'Industry & Innovation',
      '10': 'Reduced Inequalities',
    };
    return names[sdg] || `SDG ${sdg}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleJoinProject = () => {
    if (!user) {
      toast.error('Please sign in to join projects');
      return;
    }
    if (projectId) {
      joinProjectMutation.mutate({ projectId, userId: user.id });
    }
  };

  const handleLeaveProject = () => {
    if (projectId) {
      leaveProjectMutation.mutate({ projectId, userId: user.id });
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project?.title,
          text: project?.description || '',
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Project link copied to clipboard');
    }
  };

  if (!project && !isLoading) {
    return null;
  }

  const isUserMember = user && project && (project.team_members as string[])?.includes(user.id);
  const isUserCreator = user && project && project.created_by === user.id;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ) : project ? (
          <ScrollArea className="max-h-[90vh]">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        {getInitials(project.creator?.username || 'Unknown')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="text-2xl font-bold">{project.title}</h1>
                      <p className="text-muted-foreground">
                        Created by {project.creator?.username || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {(project.sdg_alignment as string[])?.map((sdg) => (
                      <Badge key={sdg} className={`${getSDGBadgeColor(sdg)}`}>
                        {getSDGName(sdg)}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleLike}
                    className={`p-2 ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleShare}
                    className="p-2 text-muted-foreground hover:text-primary"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onClose}
                    className="p-2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">About This Project</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {project.description || 'No description provided.'}
                </p>
              </div>

              {/* Project Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{(project.team_members as string[])?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Members</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <Target className="w-6 h-6 mx-auto mb-2 text-secondary" />
                  <p className="text-2xl font-bold">Active</p>
                  <p className="text-sm text-muted-foreground">Status</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-accent" />
                  <p className="text-2xl font-bold">Ongoing</p>
                  <p className="text-sm text-muted-foreground">Duration</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <MapPin className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">Global</p>
                  <p className="text-sm text-muted-foreground">Scope</p>
                </div>
              </div>

              {/* Impact Metrics */}
              {project.impact_metrics && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Impact Metrics</h3>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {JSON.stringify(project.impact_metrics, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Team Members */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Team Members</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        {getInitials(project.creator?.username || 'Unknown')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{project.creator?.username || 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground">Project Creator</p>
                    </div>
                    <Badge variant="secondary" className="ml-auto">Creator</Badge>
                  </div>
                  
                  {/* Additional team members would be loaded here */}
                  {(project.team_members as string[])?.filter(id => id !== project.created_by).map((memberId, index) => (
                    <div key={memberId} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="" />
                        <AvatarFallback>M{index + 1}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Member {index + 1}</p>
                        <p className="text-sm text-muted-foreground">Team Member</p>
                      </div>
                      <Badge variant="outline" className="ml-auto">Member</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                {isUserCreator ? (
                  <Button className="flex-1">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Manage Project
                  </Button>
                ) : isUserMember ? (
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={handleLeaveProject}
                    disabled={leaveProjectMutation.isPending}
                  >
                    <X className="w-4 h-4 mr-2" />
                    {leaveProjectMutation.isPending ? 'Leaving...' : 'Leave Project'}
                  </Button>
                ) : (
                  <Button 
                    className="flex-1"
                    onClick={handleJoinProject}
                    disabled={joinProjectMutation.isPending}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {joinProjectMutation.isPending ? 'Joining...' : 'Join Project'}
                  </Button>
                )}
                
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View External
                </Button>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="p-6 text-center">
            <p className="text-muted-foreground">Project not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
