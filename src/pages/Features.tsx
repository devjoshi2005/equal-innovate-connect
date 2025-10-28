import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Users, Lightbulb, Award, BookOpen, Target, Zap, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();

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
                <Zap className="w-4 h-4 mr-1" />
                Platform Features
              </Badge>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Everything You Need to <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">Innovate</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful tools and features to drive inclusive innovation and create meaningful SDG impact
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Mentorship Network</h3>
              <p className="text-muted-foreground mb-4">
                AI-powered matching connects you with mentors and mentees aligned to your SDG goals, skills, and availability for maximum impact.
              </p>
              <Button variant="link" className="p-0" onClick={() => navigate('/mentors')}>
                Learn more →
              </Button>
            </Card>

            <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-6">
                <Lightbulb className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Project Collaboration</h3>
              <p className="text-muted-foreground mb-4">
                Create, manage, and collaborate on projects with real-time SDG impact tracking and team coordination features.
              </p>
              <Button variant="link" className="p-0" onClick={() => navigate('/projects')}>
                Learn more →
              </Button>
            </Card>

            <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Resource Hub</h3>
              <p className="text-muted-foreground mb-4">
                Discover grants, training programs, and equipment based on your location, SDG focus areas, and project needs.
              </p>
              <Button variant="link" className="p-0" onClick={() => navigate('/explore')}>
                Learn more →
              </Button>
            </Card>

            <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">SDG Challenges</h3>
              <p className="text-muted-foreground mb-4">
                Test your knowledge with interactive quizzes and participate in SDG-themed challenges to earn badges and recognition.
              </p>
              <Button variant="link" className="p-0" onClick={() => navigate('/challenges')}>
                Learn more →
              </Button>
            </Card>

            <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Community Forum</h3>
              <p className="text-muted-foreground mb-4">
                Share ideas, get feedback, and collaborate with like-minded innovators in our Reddit-style community platform.
              </p>
              <Button variant="link" className="p-0" onClick={() => navigate('/community')}>
                Learn more →
              </Button>
            </Card>

            <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Premium Plans</h3>
              <p className="text-muted-foreground mb-4">
                Unlock advanced features, unlimited projects, and priority support with our flexible pricing plans for individuals and teams.
              </p>
              <Button variant="link" className="p-0" onClick={() => navigate('/pricing')}>
                Learn more →
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-accent to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <h3 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h3>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Join our platform today and start making a difference
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-lg px-8"
              onClick={() => navigate('/auth')}
            >
              Join Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;