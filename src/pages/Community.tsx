import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Home, ThumbsUp, MessageCircle, Plus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const SDG_OPTIONS = [
  'SDG 5: Gender Equality',
  'SDG 9: Innovation & Infrastructure',
  'SDG 10: Reduced Inequalities',
  'SDG 1: No Poverty',
  'SDG 4: Quality Education',
  'SDG 8: Decent Work',
];

const SKILL_OPTIONS = [
  'Technology',
  'Design',
  'Business',
  'Marketing',
  'Education',
  'Healthcare',
  'Research',
  'Policy',
];

const Community = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedSDGs, setSelectedSDGs] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const { data: posts, isLoading } = useQuery({
    queryKey: ['community-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          users (username)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('community_posts')
        .insert({
          user_id: user.id,
          title,
          content,
          sdg_badges: selectedSDGs,
          skills_criteria: selectedSkills,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      setTitle('');
      setContent('');
      setSelectedSDGs([]);
      setSelectedSkills([]);
      setIsCreateOpen(false);
      toast.success('Post created successfully');
    },
    onError: () => {
      toast.error('Failed to create post');
    },
  });

  const upvoteMutation = useMutation({
    mutationFn: async (postId: string) => {
      const post = posts?.find(p => p.post_id === postId);
      if (!post) return;

      const { error } = await supabase
        .from('community_posts')
        .update({ upvotes: post.upvotes + 1 })
        .eq('post_id', postId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
    },
  });

  const toggleSDG = (sdg: string) => {
    setSelectedSDGs(prev =>
      prev.includes(sdg) ? prev.filter(s => s !== sdg) : [...prev, sdg]
    );
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleCreatePost = () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    createPostMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Community
            </h1>
            <div className="flex gap-2">
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create a Community Post</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Title</label>
                      <Input
                        placeholder="Enter post title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Content</label>
                      <Textarea
                        placeholder="Share your thoughts with the community..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={6}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">SDG Goals</label>
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
                      <label className="text-sm font-medium mb-2 block">Skills</label>
                      <div className="flex flex-wrap gap-2">
                        {SKILL_OPTIONS.map((skill) => (
                          <Badge
                            key={skill}
                            variant={selectedSkills.includes(skill) ? 'secondary' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => toggleSkill(skill)}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button onClick={handleCreatePost} className="w-full">
                      Post to Community
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button onClick={() => navigate('/')} variant="outline" className="gap-2">
                <Home className="w-4 h-4" />
                Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-full"></div>
                      <div className="h-3 bg-muted rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            posts.map((post) => {
              const sdgBadges = (post.sdg_badges as string[]) || [];
              const skillsBadges = (post.skills_criteria as string[]) || [];
              const username = (post.users as any)?.username || 'Anonymous';

              return (
                <Card key={post.post_id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-muted-foreground">
                            Posted by <span className="font-medium text-foreground">{username}</span>
                          </span>
                          <span className="text-sm text-muted-foreground">
                            • {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <CardTitle className="text-xl mb-3">{post.title}</CardTitle>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {sdgBadges.map((sdg, idx) => (
                            <Badge key={idx} className="bg-gradient-to-r from-primary/80 to-accent/80">
                              {sdg}
                            </Badge>
                          ))}
                          {skillsBadges.map((skill, idx) => (
                            <Badge key={idx} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap mb-4">{post.content}</p>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={() => upvoteMutation.mutate(post.post_id)}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        {post.upvotes}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Comment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">
                  No posts yet. Be the first to share with the community!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;
