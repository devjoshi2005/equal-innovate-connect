import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Users, Calendar, Target, Globe } from 'lucide-react';
import { projectsApi, ProjectFilters } from '@/services/projectsApi';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const ExploreProjects = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<ProjectFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleJoinProject = async (projectId: string) => {
    if (!user) {
      toast.error('Please sign in to join projects');
      return;
    }

    try {
      await projectsApi.joinProject(projectId, user.id);
      toast.success('Successfully joined the project!');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

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
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Globe className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Explore Projects
              </h1>
            </div>
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
              <Card key={project.project_id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <CardDescription className="text-sm">
                        by {project.creator?.username || 'Unknown'}
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(project.sdg_alignment as string[])?.map((sdg) => (
                        <Badge key={sdg} className={`text-xs ${getSDGBadgeColor(sdg)}`}>
                          {getSDGName(sdg)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{(project.team_members as string[])?.length || 0} members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      <span>Active</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleJoinProject(project.project_id)}
                    >
                      Join Project
                    </Button>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
    </div>
  );
};

export default ExploreProjects;
