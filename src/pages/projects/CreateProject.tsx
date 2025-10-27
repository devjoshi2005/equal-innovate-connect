import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Home, Save } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SDG_OPTIONS = [
  'SDG 5: Gender Equality',
  'SDG 9: Innovation & Infrastructure',
  'SDG 10: Reduced Inequalities',
  'SDG 1: No Poverty',
  'SDG 4: Quality Education',
];

const CreateProject = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [selectedSDGs, setSelectedSDGs] = useState<string[]>([]);
  const [teamMembers, setTeamMembers] = useState('');
  const [impactMetrics, setImpactMetrics] = useState('');

  const createProjectMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');

      const teamArray = teamMembers.split(',').map(m => m.trim()).filter(Boolean);
      const metricsArray = impactMetrics.split(',').map(m => m.trim()).filter(Boolean);

      const { error } = await supabase
        .from('collaboration_projects')
        .insert({
          created_by: user.id,
          title,
          description: content || description,
          sdg_alignment: selectedSDGs,
          team_members: teamArray,
          impact_metrics: metricsArray,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Project created successfully');
      navigate('/projects');
    },
    onError: () => {
      toast.error('Failed to create project');
    },
  });

  const toggleSDG = (sdg: string) => {
    setSelectedSDGs(prev =>
      prev.includes(sdg) ? prev.filter(s => s !== sdg) : [...prev, sdg]
    );
  };

  const handleSave = () => {
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in title and description');
      return;
    }
    createProjectMutation.mutate();
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Create New Project
            </h1>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                Save Project
              </Button>
              <Button onClick={() => navigate('/')} variant="outline" className="gap-2">
                <Home className="w-4 h-4" />
                Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Notepad Editor */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Project Content</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Write your project details here... Use this space like a notepad to document your ideas, goals, and plans."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[500px] font-mono text-sm"
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Project Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Project Title</label>
                  <Input
                    placeholder="Enter project title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Short Description</label>
                  <Textarea
                    placeholder="Brief project description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">SDG Alignment</label>
                  <div className="flex flex-wrap gap-2">
                    {SDG_OPTIONS.map((sdg) => (
                      <Badge
                        key={sdg}
                        variant={selectedSDGs.includes(sdg) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleSDG(sdg)}
                      >
                        {sdg}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Team Members (comma separated)
                  </label>
                  <Input
                    placeholder="John, Sarah, Alex..."
                    value={teamMembers}
                    onChange={(e) => setTeamMembers(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Impact Metrics (comma separated)
                  </label>
                  <Input
                    placeholder="100 users, 50% reduction..."
                    value={impactMetrics}
                    onChange={(e) => setImpactMetrics(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
