import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Lightbulb, Award, Globe, Target, Handshake, Rocket, BookOpen, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = async () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Globe className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Inclusive Innovation Hub
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#impact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Impact</a>
            <button onClick={() => navigate('/community')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Community</button>
            {user ? (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
            ) : (
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                onClick={handleAuthAction}
              >
                Join Now
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-50"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/30">SDG 5: Gender Equality</Badge>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30">SDG 9: Innovation</Badge>
              <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/30">SDG 10: Reduced Inequalities</Badge>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Empowering <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">Inclusive Innovation</span> Through Collaboration
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              A platform where diverse voices drive sustainable innovation. Connect with mentors, collaborate on impactful projects, and access resources to build a more equitable future.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8"
                onClick={handleAuthAction}
              >
                {user ? "Dashboard" : "Get Started"}
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Platform Features</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to collaborate, innovate, and create meaningful impact
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Mentorship Network</h4>
              <p className="text-muted-foreground">AI-powered matching connects you with mentors aligned to your SDG goals and skills.</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Collaboration Workspace</h4>
              <p className="text-muted-foreground">Shared project boards with real-time collaboration and SDG impact tracking.</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-accent-foreground" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Resource Hub</h4>
              <p className="text-muted-foreground">Discover grants, training programs, and equipment based on location and SDG focus.</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-primary-foreground" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Community Challenges</h4>
              <p className="text-muted-foreground">SDG-themed hackathons with industry partnerships and mentorship opportunities.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section id="impact" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Our Global Impact</h3>
            <p className="text-muted-foreground">Building an inclusive ecosystem where diverse voices create change</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                45%
              </div>
              <p className="text-muted-foreground">Women-led Projects</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-2">
                120+
              </div>
              <p className="text-muted-foreground">Countries Represented</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-2">
                2,500+
              </div>
              <p className="text-muted-foreground">Active Mentorships</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
                $5M+
              </div>
              <p className="text-muted-foreground">Resources Distributed</p>
            </div>
          </div>
        </div>
      </section>

      {/* SDG Alignment */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Sustainable Development Goals</h3>
              <p className="text-muted-foreground">Our platform connects three critical SDGs to create systemic change</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 border-accent/30 bg-accent/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xl">
                    5
                  </div>
                  <h4 className="font-semibold">Gender Equality</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Providing women and non-binary individuals access to innovation tools, mentorship, and leadership opportunities.
                </p>
              </Card>

              <Card className="p-6 border-primary/30 bg-primary/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                    9
                  </div>
                  <h4 className="font-semibold">Industry & Innovation</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Building resilient infrastructure and fostering innovation through local innovation hubs with global reach.
                </p>
              </Card>

              <Card className="p-6 border-secondary/30 bg-secondary/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-xl">
                    10
                  </div>
                  <h4 className="font-semibold">Reduced Inequalities</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Creating pathways for underrepresented groups in tech and industry to access resources and opportunities.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="community" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h3>
            <p className="text-muted-foreground">Join our community in four simple steps</p>
          </div>
          <div className="max-w-4xl mx-auto grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                1
              </div>
              <h4 className="font-semibold mb-2">Create Profile</h4>
              <p className="text-sm text-muted-foreground">Share your skills, interests, and SDG focus areas</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-secondary-foreground">
                2
              </div>
              <h4 className="font-semibold mb-2">Get Matched</h4>
              <p className="text-sm text-muted-foreground">AI connects you with mentors and collaborators</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-accent-foreground">
                3
              </div>
              <h4 className="font-semibold mb-2">Collaborate</h4>
              <p className="text-sm text-muted-foreground">Work on projects with real SDG impact</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center mx-auto mb-4 text-primary-foreground">
                <Rocket className="w-8 h-8" />
              </div>
              <h4 className="font-semibold mb-2">Create Impact</h4>
              <p className="text-sm text-muted-foreground">Launch innovations that reduce inequalities</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-accent to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <h3 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Drive Inclusive Innovation?
            </h3>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Join thousands of innovators, mentors, and change-makers building a more equitable future.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                variant="secondary" 
                className="text-lg px-8"
                onClick={handleAuthAction}
              >
                <Handshake className="w-5 h-5 mr-2" />
                {user ? "View Profile" : "Join the Community"}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 bg-white/10 border-white/30 text-white hover:bg-white/20"
                onClick={() => navigate('/projects')}
              >
                <Target className="w-5 h-5 mr-2" />
                My Projects
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold">Innovation Hub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Building an inclusive ecosystem where diverse voices drive sustainable innovation.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Platform</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Community</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Mentors</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Projects</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Challenges</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Resources</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">SDG Guidelines</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 Inclusive Innovation Hub. Empowering change through SDGs 5, 9 & 10.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
