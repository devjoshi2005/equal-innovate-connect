import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Users, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Mentors = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applicationType, setApplicationType] = useState<'mentor' | 'mentee' | null>(null);
  const [expertiseAreas, setExpertiseAreas] = useState("");
  const [availability, setAvailability] = useState("");
  const [motivation, setMotivation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please sign in to apply");
      navigate('/auth');
      return;
    }

    if (!applicationType) {
      toast.error("Please select mentor or mentee");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('mentorship_applications')
        .insert({
          user_id: user.id,
          application_type: applicationType,
          expertise_areas: expertiseAreas.split(',').map(s => s.trim()),
          availability,
          motivation,
          status: 'pending'
        });

      if (error) throw error;

      navigate('/mentors/confirmed');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error("Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md mx-4">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">Please sign in to access mentorship</p>
          <Button onClick={() => navigate('/auth')} className="w-full">
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Globe className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Inclusive Innovation Hub
            </h1>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')}>Home</Button>
            <Button onClick={() => navigate('/dashboard')}>Dashboard</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-50"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="flex justify-center mb-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30">
                <Users className="w-4 h-4 mr-1" />
                Mentorship Program
              </Badge>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Connect with <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">Mentors</span> or <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">Become One</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our mentorship network to accelerate innovation and create SDG impact
            </p>
          </div>
        </div>
      </section>

      {/* Application Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {!applicationType ? (
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setApplicationType('mentor')}>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6">
                    <Users className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-4">Become a Mentor</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    Share your expertise and guide others in achieving their SDG goals
                  </p>
                  <Button className="w-full bg-gradient-to-r from-primary to-accent">
                    Apply as Mentor
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Card>

                <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setApplicationType('mentee')}>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center mx-auto mb-6">
                    <Users className="w-8 h-8 text-secondary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-4">Find a Mentor</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    Connect with experienced mentors to accelerate your innovation journey
                  </p>
                  <Button className="w-full bg-gradient-to-r from-secondary to-accent">
                    Apply as Mentee
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Card>
              </div>
            ) : (
              <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">
                    {applicationType === 'mentor' ? 'Mentor Application' : 'Mentee Application'}
                  </h3>
                  <p className="text-muted-foreground">
                    Tell us about yourself and your goals
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="expertise">Expertise Areas / Interests (comma-separated)</Label>
                    <Input
                      id="expertise"
                      placeholder="e.g., SDG 5, Gender Equality, Social Innovation"
                      value={expertiseAreas}
                      onChange={(e) => setExpertiseAreas(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="availability">Availability</Label>
                    <Input
                      id="availability"
                      placeholder="e.g., Weekends, 2 hours per week"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="motivation">
                      {applicationType === 'mentor' ? 'Why do you want to mentor?' : 'What are you hoping to learn?'}
                    </Label>
                    <Textarea
                      id="motivation"
                      placeholder="Share your motivation..."
                      value={motivation}
                      onChange={(e) => setMotivation(e.target.value)}
                      rows={5}
                      required
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setApplicationType(null)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-primary to-accent"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </div>
                </form>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mentors;