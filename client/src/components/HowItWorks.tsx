import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Search, 
  Users, 
  Calendar, 
  Star,
  ArrowRight,
  CheckCircle,
  Clock,
  Shield,
  Zap
} from "lucide-react";
import { useLocation } from "wouter";

export default function HowItWorks() {
  const [, setLocation] = useLocation();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      icon: Search,
      title: "Search & Discover",
      description: "Find the perfect vendors and services for your event",
      details: "Browse through our curated list of verified vendors, read reviews, and compare prices. Filter by location, budget, and service type.",
      color: "bg-blue-500",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      features: ["Smart search filters", "Verified vendor profiles", "Real customer reviews"]
    },
    {
      icon: Users,
      title: "Compare & Choose",
      description: "Compare vendors side-by-side and make informed decisions",
      details: "View detailed profiles, pricing, availability, and past work. Chat with vendors directly to discuss your requirements.",
      color: "bg-green-500",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      features: ["Side-by-side comparison", "Direct messaging", "Portfolio galleries"]
    },
    {
      icon: Calendar,
      title: "Book & Plan",
      description: "Secure your bookings and manage your event timeline",
      details: "Book services with secure payments, track your event timeline, and manage all your bookings in one place.",
      color: "bg-purple-500",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      features: ["Secure payments", "Event timeline", "Booking management"]
    },
    {
      icon: Star,
      title: "Enjoy & Celebrate",
      description: "Relax and enjoy your perfectly planned event",
      details: "Your event is in good hands. Track progress, communicate with vendors, and focus on celebrating your special day.",
      color: "bg-orange-500",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      features: ["Progress tracking", "Vendor communication", "Event coordination"]
    }
  ];

  const handleGetStarted = () => {
    setLocation("/post-order");
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Zap className="w-4 h-4 mr-2" />
            How It Works
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Plan Your Perfect Event in 4 Simple Steps
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From finding vendors to celebrating your event, we've streamlined the entire process. 
            <span className="font-semibold text-primary-600"> No stress, just results.</span>
          </p>
        </div>

        {/* Demo Video Section */}
        <div className="mb-16">
          <Card className="overflow-hidden shadow-2xl border-0">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-primary-600 to-blue-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <Play className="w-8 h-8 ml-1" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">See Planora in Action</h3>
                  <p className="text-lg opacity-90">Watch how easy it is to plan your perfect event</p>
                  <Button 
                    size="lg" 
                    className="mt-6 bg-white text-primary-600 hover:bg-gray-100"
                    onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Watch Demo Video
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Step-by-Step Process */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Step Navigation */}
          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === activeStep;
              
              return (
                <div
                  key={index}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                    isActive 
                      ? 'bg-white shadow-xl border-2 border-primary-200' 
                      : 'bg-white/60 hover:bg-white/80 hover:shadow-lg'
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${step.color} text-white flex-shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                        {isActive && (
                          <Badge className="bg-primary-100 text-primary-700">
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{step.description}</p>
                      {isActive && (
                        <div className="space-y-2">
                          {step.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-2 text-sm text-gray-700">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-gray-300">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Step Details */}
          <div className="relative">
            <Card className="overflow-hidden shadow-2xl border-0">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative">
                <img 
                  src={steps[activeStep].image} 
                  alt={steps[activeStep].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 mb-2">{steps[activeStep].title}</h4>
                    <p className="text-sm text-gray-700">{steps[activeStep].details}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Save Time</h3>
            <p className="text-gray-600">
              Plan your entire event in hours, not weeks. Our streamlined process cuts planning time by 70%.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Vendors</h3>
            <p className="text-gray-600">
              Every vendor is background-checked and reviewed. Your event is in safe hands.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Best Prices</h3>
            <p className="text-gray-600">
              Compare prices from multiple vendors and save up to 30% on your event costs.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-primary-600 to-blue-600 text-white border-0 shadow-2xl">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold mb-4">Ready to Start Planning?</h3>
              <p className="text-xl opacity-90 mb-6 max-w-2xl mx-auto">
                Join thousands of users who have successfully planned their perfect events with Planora
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-gray-100"
                  onClick={handleGetStarted}
                >
                  Start Planning Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary-600"
                  onClick={() => setLocation("/vendors")}
                >
                  Browse Vendors
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
