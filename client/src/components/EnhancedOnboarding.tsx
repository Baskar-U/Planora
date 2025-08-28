import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Calendar, 
  Star, 
  MapPin,
  Shield,
  Zap
} from "lucide-react";
import { useLocation } from "wouter";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  action: string;
  href: string;
  completed?: boolean;
}

export default function EnhancedOnboarding() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const onboardingSteps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome to Planora!",
      description: "Let's get you started with planning your perfect event in just a few simple steps.",
      icon: Star,
      color: "bg-gradient-to-br from-yellow-400 to-orange-500",
      action: "Get Started",
      href: "/onboarding/step1"
    },
    {
      id: "user-type",
      title: "Choose Your Role",
      description: "Are you planning an event or providing services? This helps us personalize your experience.",
      icon: Users,
      color: "bg-gradient-to-br from-blue-400 to-purple-500",
      action: "Select Role",
      href: "/onboarding/step2"
    },
    {
      id: "preferences",
      title: "Set Your Preferences",
      description: "Tell us about your event type, location, and budget to get personalized recommendations.",
      icon: MapPin,
      color: "bg-gradient-to-br from-green-400 to-teal-500",
      action: "Set Preferences",
      href: "/onboarding/step3"
    },
    {
      id: "explore",
      title: "Explore Vendors",
      description: "Browse our curated list of verified vendors based on your preferences.",
      icon: Calendar,
      color: "bg-gradient-to-br from-purple-400 to-pink-500",
      action: "Browse Vendors",
      href: "/vendors"
    },
    {
      id: "complete",
      title: "You're All Set!",
      description: "Start planning your event with confidence. We're here to help every step of the way.",
      icon: CheckCircle,
      color: "bg-gradient-to-br from-emerald-400 to-green-500",
      action: "Start Planning",
      href: "/post-order"
    }
  ];

  const handleStepClick = (step: OnboardingStep) => {
    if (step.completed) {
      setLocation(step.href);
      return;
    }

    // Mark current step as completed
    if (!completedSteps.includes(step.id)) {
      setCompletedSteps([...completedSteps, step.id]);
    }

    // Move to next step
    const nextIndex = onboardingSteps.findIndex(s => s.id === step.id) + 1;
    if (nextIndex < onboardingSteps.length) {
      setCurrentStep(nextIndex);
    } else {
      // Complete onboarding
      setLocation(step.href);
    }
  };

  const getProgressPercentage = () => {
    return ((completedSteps.length + 1) / onboardingSteps.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Zap className="w-5 h-5 text-primary-600" />
            <span className="text-sm font-semibold text-gray-700">Quick Setup</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Welcome to Planora!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Let's get you started with planning your perfect event in just a few simple steps.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {onboardingSteps.length}
            </span>
            <span className="text-sm font-medium text-primary-600">
              {Math.round(getProgressPercentage())}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-500 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Current Step */}
        <div className="mb-8">
          <Card className="border-2 border-primary-200 shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${onboardingSteps[currentStep].color}`}>
                <onboardingSteps[currentStep].icon className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {onboardingSteps[currentStep].title}
              </CardTitle>
              <p className="text-gray-600 mt-2">
                {onboardingSteps[currentStep].description}
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                size="lg"
                className="btn-primary"
                onClick={() => handleStepClick(onboardingSteps[currentStep])}
              >
                {onboardingSteps[currentStep].action}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* All Steps Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {onboardingSteps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = index === currentStep;
            
            return (
              <Card 
                key={step.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  isCurrent ? 'ring-2 ring-primary-500 shadow-lg' : ''
                } ${isCompleted ? 'opacity-75' : ''}`}
                onClick={() => handleStepClick(step)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.color}`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <Icon className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {step.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {step.description}
                      </p>
                    </div>
                    {isCompleted && (
                      <Badge variant="secondary" className="text-xs">
                        Done
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trust Signals */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-6 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700">Secure & Trusted</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">10,000+ Users</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">4.8/5 Rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
