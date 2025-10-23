import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Target, MessageCircle, Calendar, MapPin, Heart, Share2 } from 'lucide-react';
import { ProjectWithCreator } from '@/services/projectsApi';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProjectCardProps {
  project: ProjectWithCreator;
  onJoinProject: (projectId: string) => void;
  onViewDetails: (projectId: string) => void;
  isJoining?: boolean;
}

export const ProjectCard = ({ project, onJoinProject, onViewDetails, isJoining = false }: ProjectCardProps) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);

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

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: project.description || '',
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Project link copied to clipboard');
    }
  };

  const isUserMember = user && (project.team_members as string[])?.includes(user.id);
  const isUserCreator = user && project.created_by === user.id;

  return (
    <Card className="hover:shadow-lg transition-all duration-300 group border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
              {project.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src="" />
                <AvatarFallback className="text-xs">
                  {getInitials(project.creator?.username || 'Unknown')}
                </AvatarFallback>
              </Avatar>
              <CardDescription className="text-sm">
                by {project.creator?.username || 'Unknown'}
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 ml-2">
            {(project.sdg_alignment as string[])?.map((sdg) => (
              <Badge key={sdg} className={`text-xs ${getSDGBadgeColor(sdg)}`}>
                {getSDGName(sdg)}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {project.description}
        </p>
        
        {/* Project Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{(project.team_members as string[])?.length || 0} members</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            <span>Active</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Ongoing</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {isUserCreator ? (
            <Button size="sm" className="flex-1" variant="outline">
              <MessageCircle className="w-4 h-4 mr-1" />
              Manage
            </Button>
          ) : isUserMember ? (
            <Button size="sm" className="flex-1" variant="outline">
              <MessageCircle className="w-4 h-4 mr-1" />
              View Project
            </Button>
          ) : (
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => onJoinProject(project.project_id)}
              disabled={isJoining}
            >
              {isJoining ? 'Joining...' : 'Join Project'}
            </Button>
          )}
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onViewDetails(project.project_id)}
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Details
          </Button>
        </div>

        {/* Additional Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleLike}
              className={`p-2 h-8 w-8 ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleShare}
              className="p-2 h-8 w-8 text-muted-foreground hover:text-primary"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Impact Metrics Preview */}
          {project.impact_metrics && (
            <div className="text-xs text-muted-foreground">
              Impact: {JSON.stringify(project.impact_metrics).length > 20 
                ? 'High' 
                : 'Medium'
              }
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
