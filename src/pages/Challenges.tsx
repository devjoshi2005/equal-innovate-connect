import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Award, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SDG_QUESTIONS = [
  {
    question: "Which SDG focuses on ensuring inclusive and equitable quality education?",
    options: ["SDG 3", "SDG 4", "SDG 5", "SDG 8"],
    correct: 1,
    sdg: "SDG 4"
  },
  {
    question: "What does SDG 5 primarily address?",
    options: ["Climate Action", "Gender Equality", "Clean Water", "Zero Hunger"],
    correct: 1,
    sdg: "SDG 5"
  },
  {
    question: "Which SDG aims to build resilient infrastructure and promote sustainable industrialization?",
    options: ["SDG 7", "SDG 9", "SDG 11", "SDG 12"],
    correct: 1,
    sdg: "SDG 9"
  },
  {
    question: "SDG 10 focuses on reducing inequalities within and among which entity?",
    options: ["Communities", "Countries", "Organizations", "Families"],
    correct: 1,
    sdg: "SDG 10"
  },
  {
    question: "How many Sustainable Development Goals are there in total?",
    options: ["15", "17", "20", "25"],
    correct: 1,
    sdg: "General"
  },
  {
    question: "Which SDG addresses responsible consumption and production patterns?",
    options: ["SDG 11", "SDG 12", "SDG 13", "SDG 14"],
    correct: 1,
    sdg: "SDG 12"
  },
  {
    question: "What is the target year for achieving the Sustainable Development Goals?",
    options: ["2025", "2030", "2040", "2050"],
    correct: 1,
    sdg: "General"
  },
  {
    question: "Which organization established the Sustainable Development Goals?",
    options: ["WHO", "UNESCO", "United Nations", "World Bank"],
    correct: 2,
    sdg: "General"
  },
  {
    question: "SDG 13 primarily focuses on which global issue?",
    options: ["Poverty", "Climate Change", "Ocean Conservation", "Peace"],
    correct: 1,
    sdg: "SDG 13"
  },
  {
    question: "Which SDG aims to ensure availability and sustainable management of water?",
    options: ["SDG 6", "SDG 7", "SDG 14", "SDG 15"],
    correct: 0,
    sdg: "SDG 6"
  }
];

const Challenges = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleNext = async () => {
    if (selectedAnswer === null) {
      toast.error("Please select an answer");
      return;
    }

    const isCorrect = selectedAnswer === SDG_QUESTIONS[currentQuestion].correct;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);
    setShowResult(true);

    if (currentQuestion === SDG_QUESTIONS.length - 1) {
      setQuizCompleted(true);
      
      // Update user's quiz score
      if (user) {
        // First get current attempts
        const { data: userData } = await supabase
          .from('users')
          .select('quiz_attempts')
          .eq('user_id', user.id)
          .single();

        const currentAttempts = userData?.quiz_attempts || 0;

        const { error } = await supabase
          .from('users')
          .update({ 
            quiz_score: newScore,
            quiz_attempts: currentAttempts + 1
          })
          .eq('user_id', user.id);

        if (error) {
          console.error('Error updating quiz score:', error);
        } else {
          toast.success(`Quiz completed! Your score: ${newScore}/${SDG_QUESTIONS.length}`);
        }
      }
    }
  };

  const handleContinue = () => {
    setShowResult(false);
    setSelectedAnswer(null);
    setCurrentQuestion(currentQuestion + 1);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizCompleted(false);
    setShowResult(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md mx-4">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">Please sign in to take SDG challenges</p>
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
                <Award className="w-4 h-4 mr-1" />
                SDG Knowledge Challenge
              </Badge>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Test Your <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">SDG Knowledge</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Challenge yourself with questions about Sustainable Development Goals
            </p>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {!quizCompleted ? (
              <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="outline">Question {currentQuestion + 1} of {SDG_QUESTIONS.length}</Badge>
                    <Badge className="bg-gradient-to-r from-primary to-accent">
                      {SDG_QUESTIONS[currentQuestion].sdg}
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-6">
                    <div 
                      className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all"
                      style={{ width: `${((currentQuestion + 1) / SDG_QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-6">
                    {SDG_QUESTIONS[currentQuestion].question}
                  </h3>
                </div>

                <div className="space-y-3 mb-6">
                  {SDG_QUESTIONS[currentQuestion].options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = index === SDG_QUESTIONS[currentQuestion].correct;
                    const showCorrectAnswer = showResult && isCorrect;
                    const showWrongAnswer = showResult && isSelected && !isCorrect;

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showResult}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          showCorrectAnswer
                            ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                            : showWrongAnswer
                            ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                            : isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {showCorrectAnswer && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                          {showWrongAnswer && <XCircle className="w-5 h-5 text-red-600" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <Button 
                  onClick={showResult ? handleContinue : handleNext}
                  className="w-full bg-gradient-to-r from-primary to-accent"
                  disabled={selectedAnswer === null && !showResult}
                >
                  {showResult ? (currentQuestion === SDG_QUESTIONS.length - 1 ? 'View Results' : 'Next Question') : 'Submit Answer'}
                </Button>
              </Card>
            ) : (
              <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm text-center">
                <div className="mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6">
                    <Award className="w-12 h-12 text-primary-foreground" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Quiz Completed!</h3>
                  <p className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
                    {score}/{SDG_QUESTIONS.length}
                  </p>
                  <p className="text-muted-foreground mb-6">
                    {score >= 8 ? 'Excellent work!' : score >= 6 ? 'Good job!' : 'Keep learning!'}
                  </p>
                  <p className="text-sm text-muted-foreground mb-8">
                    Your score has been updated in your profile
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button 
                    onClick={handleRestart}
                    variant="outline"
                    className="flex-1"
                  >
                    Retake Quiz
                  </Button>
                  <Button 
                    onClick={() => navigate('/dashboard')}
                    className="flex-1 bg-gradient-to-r from-primary to-accent"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Challenges;