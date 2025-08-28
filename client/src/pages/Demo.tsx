import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Play,
  Zap,
  Shield,
  Users,
  Award,
  ArrowRight
} from "lucide-react";
import { useLocation } from "wouter";
import HowItWorks from "@/components/HowItWorks";
import EnhancedFormValidation from "@/components/EnhancedFormValidation";
import { SkeletonPage, SkeletonVendorCard, SkeletonForm } from "@/components/SkeletonLoader";

export default function Demo() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  const features = [
    {
      icon: Star,
      title: "Enhanced User Experience",
      description: "Professional-grade UX with smooth animations and intuitive navigation",
      color: "bg-yellow-500"
    },
    {
      icon: Shield,
      title: "Trust & Credibility",
      description: "Social proof, testimonials, and security badges build user confidence",
      color: "bg-green-500"
    },
    {
      icon: Users,
      title: "Mobile-First Design",
      description: "Optimized for mobile with proper touch targets and responsive layouts",
      color: "bg-blue-500"
    },
    {
      icon: Zap,
      title: "Performance Optimized",
      description: "Skeleton loaders, smooth transitions, and fast loading times",
      color: "bg-purple-500"
    },
    {
      icon: CheckCircle,
      title: "Form Validation",
      description: "Real-time validation with immediate feedback and loading states",
      color: "bg-emerald-500"
    },
    {
      icon: Award,
      title: "Professional Polish",
      description: "Modern design system with consistent spacing and typography",
      color: "bg-orange-500"
    }
  ];

  const improvements = [
    "✅ Added 'How It Works' section with demo video",
    "✅ Enhanced testimonials with social proof",
    "✅ Real-time form validation with feedback",
    "✅ Skeleton loaders for better perceived performance",
    "✅ Improved mobile touch targets and spacing",
    "✅ Professional animations and transitions",
    "✅ Trust signals and credibility elements",
    "✅ Enhanced user onboarding flow",
    "✅ Better visual hierarchy and typography",
    "✅ Comprehensive error handling"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Planora UX Demo</h1>
              <p className="text-gray-600 mt-1">Showcasing professional UX improvements</p>
            </div>
            <Button onClick={() => setLocation("/")} variant="outline">
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
            <TabsTrigger value="validation">Form Validation</TabsTrigger>
            <TabsTrigger value="loading">Loading States</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Features Grid */}
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Professional UX Improvements
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Transform your event planning experience with these industry-leading UX enhancements
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Improvements List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  Key Improvements Implemented
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {improvements.map((improvement, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-green-500 font-semibold">✓</span>
                      <span className="text-gray-700">{improvement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary-600 mb-2">70%</div>
                  <div className="text-gray-600">Faster Planning</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary-600 mb-2">4.8/5</div>
                  <div className="text-gray-600">User Rating</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary-600 mb-2">10K+</div>
                  <div className="text-gray-600">Events Planned</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
                  <div className="text-gray-600">Verified Vendors</div>
                </CardContent>
              </Card>
            </div>

            {/* CTA */}
            <Card className="bg-gradient-to-r from-primary-600 to-blue-600 text-white border-0">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Experience the Difference?</h3>
                <p className="text-lg opacity-90 mb-6">
                  See these improvements in action on the main site
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    className="bg-white text-primary-600 hover:bg-gray-100"
                    onClick={() => setLocation("/")}
                  >
                    Explore Planora
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-primary-600"
                    onClick={() => setActiveTab("how-it-works")}
                  >
                    See How It Works
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="how-it-works">
            <HowItWorks />
          </TabsContent>

          <TabsContent value="validation">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Enhanced Form Validation
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Real-time validation with immediate feedback, password strength indicators, and loading states
                </p>
              </div>
              <EnhancedFormValidation />
            </div>
          </TabsContent>

          <TabsContent value="loading">
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Loading States & Skeleton Loaders
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Professional loading experiences that improve perceived performance
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Full Page Loading</h3>
                  <SkeletonPage />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Component Loading</h3>
                  <div className="space-y-4">
                    <SkeletonVendorCard />
                    <SkeletonVendorCard />
                    <SkeletonVendorCard />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Form Loading</h3>
                <SkeletonForm />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
