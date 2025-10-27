import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Users, Target, Globe, ArrowLeft, Plus } from 'lucide-react';
import { projectsApi, ProjectFilters } from '@/services/projectsApi';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectDetails } from '@/components/projects/ProjectDetails';

const ExploreProjects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<ProjectFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects', filters],
    queryFn: () => projectsApi.getProjects(filters),
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters(prev => ({ ...prev, search: value || undefined }));
  };

  const handleSDGFilter = (sdg: string) => {
    setFilters(prev => ({
      ...prev,
      sdg_alignment: sdg ? [sdg] : undefined
    }));
  };

  const joinProjectMutation = useMutation({
    mutationFn: ({ projectId, userId }: { projectId: string; userId: string }) =>
      projectsApi.joinProject(projectId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Successfully joined the project!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleJoinProject = async (projectId: string) => {
    if (!user) {
      toast.error('Please sign in to join projects');
      return;
    }

    joinProjectMutation.mutate({ projectId, userId: user.id });
  };

  const handleViewDetails = (projectId: string) => {
    setSelectedProjectId(projectId);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedProjectId(null);
  };


  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-destructive">Error loading projects. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Globe className="w-6 h-6 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  Explore Projects
                </h1>
              </div>
            </div>
            {user && (
              <Button 
                onClick={() => navigate('/projects/create')}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select onValueChange={handleSDGFilter}>
              <SelectTrigger className="w-full md:w-64">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by SDG" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All SDGs</SelectItem>
                <SelectItem value="5">SDG 5: Gender Equality</SelectItem>
                <SelectItem value="9">SDG 9: Industry & Innovation</SelectItem>
                <SelectItem value="10">SDG 10: Reduced Inequalities</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Section */}
        {projects && projects.length > 0 && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{projects.length}</p>
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {projects.reduce((total, project) => total + ((project.team_members as string[])?.length || 0), 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Members</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {new Set(projects.flatMap(p => (p.sdg_alignment as string[]) || [])).size}
                  </p>
                  <p className="text-sm text-muted-foreground">SDGs Covered</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.project_id}
                project={project}
                onJoinProject={handleJoinProject}
                onViewDetails={handleViewDetails}
                isJoining={joinProjectMutation.isPending}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Globe className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">
              {filters.search || filters.sdg_alignment 
                ? 'Try adjusting your search or filters'
                : 'Be the first to create a project!'
              }
            </p>
            {user && (
              <Button>Create Project</Button>
            )}
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      <ProjectDetails
        projectId={selectedProjectId}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
      />
    </div>
  );
};

export default ExploreProjects;
