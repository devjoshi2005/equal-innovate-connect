import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Globe, CheckCircle2, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MentorsConfirmed = () => {
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

      {/* Confirmation Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 md:p-12 border-border/50 bg-card/50 backdrop-blur-sm text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-primary-foreground" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Application Submitted Successfully!
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8">
                Thank you for your interest in our mentorship program.
              </p>

              <div className="bg-muted/50 rounded-lg p-6 mb-8">
                <div className="flex items-start gap-3 text-left">
                  <Mail className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">What's Next?</h3>
                    <p className="text-sm text-muted-foreground">
                      Our team will review your application and assess your eligibility based on your profile metrics, 
                      expertise areas, and alignment with our SDG goals. You will receive a confirmation email within 
                      3-5 business days with details about next steps and the mentorship matching process.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Please check your email regularly for updates regarding your application status.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                  className="flex-1"
                >
                  Go to Dashboard
                </Button>
                <Button 
                  onClick={() => navigate('/')}
                  className="flex-1 bg-gradient-to-r from-primary to-accent"
                >
                  Back to Home
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MentorsConfirmed;