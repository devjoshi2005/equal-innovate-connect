import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Mail, Phone, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Support = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate sending support request
    setTimeout(() => {
      toast.success("Support request submitted successfully! We'll get back to you soon.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setIsSubmitting(false);
    }, 1500);
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
                <MessageSquare className="w-4 h-4 mr-1" />
                Support Center
              </Badge>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              We're Here to <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">Help</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Get in touch with our support team for any questions or assistance
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="How can we help?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-accent"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Email Support</h4>
                    <p className="text-muted-foreground text-sm mb-2">
                      Get in touch via email for detailed inquiries
                    </p>
                    <a href="mailto:support@innovationhub.org" className="text-primary hover:underline text-sm">
                      support@innovationhub.org
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Phone Support</h4>
                    <p className="text-muted-foreground text-sm mb-2">
                      Call us during business hours (9 AM - 5 PM EST)
                    </p>
                    <a href="tel:+1-555-123-4567" className="text-primary hover:underline text-sm">
                      +1 (555) 123-4567
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
                <h4 className="font-semibold mb-4">Frequently Asked Questions</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium mb-1">How long does it take to get a response?</p>
                    <p className="text-muted-foreground">We typically respond within 24-48 hours during business days.</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">What are your support hours?</p>
                    <p className="text-muted-foreground">Our support team is available Monday-Friday, 9 AM - 5 PM EST.</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Can I schedule a call?</p>
                    <p className="text-muted-foreground">Yes! Mention your preferred time in the message and we'll coordinate.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Support;