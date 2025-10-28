import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePremiumClick = () => {
    if (!user) {
      toast.error("Please sign in to subscribe to premium");
      navigate("/auth");
      return;
    }
    
    // Redirect to PayPal payment (using a demo PayPal.me link)
    const paypalLink = "https://www.paypal.me/yourpaypalaccount/49.99";
    window.open(paypalLink, "_blank");
    toast.success("Redirecting to PayPal for payment...");
  };

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
            {user && <Button onClick={() => navigate('/dashboard')}>Dashboard</Button>}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-50"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Choose Your <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">Plan</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Select the perfect plan to accelerate your innovation journey
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Access to community posts</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Create up to 3 projects</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Basic SDG challenges</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Community support</span>
                </li>
              </ul>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => user ? navigate('/dashboard') : navigate('/auth')}
              >
                {user ? 'Current Plan' : 'Get Started'}
              </Button>
            </Card>

            {/* Pro Plan */}
            <Card className="p-8 border-primary/50 bg-primary/5 backdrop-blur-sm hover:shadow-lg transition-shadow relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent">
                Popular
              </Badge>
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">$19</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">All Free features</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Unlimited projects</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Advanced SDG analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Mentor matching</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Priority support</span>
                </li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-primary to-accent" onClick={handlePremiumClick}>
                Subscribe Now
              </Button>
            </Card>

            {/* Enterprise Plan */}
            <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">All Pro features</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Team collaboration (up to 50)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Custom SDG reporting</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Dedicated account manager</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">24/7 premium support</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" onClick={handlePremiumClick}>
                Contact Sales
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;