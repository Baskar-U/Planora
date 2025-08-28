import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sparkles, 
  Zap, 
  Star, 
  Heart, 
  Target, 
  Award,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";

interface AnimationDemo {
  name: string;
  className: string;
  description: string;
  icon: any;
}

const animationDemos: AnimationDemo[] = [
  {
    name: "Fade In",
    className: "animate-fade-in",
    description: "Smooth fade-in animation",
    icon: Sparkles
  },
  {
    name: "Slide Up",
    className: "animate-slide-up",
    description: "Slide up from below",
    icon: Zap
  },
  {
    name: "Scale In",
    className: "animate-scale-in",
    description: "Scale in with bounce effect",
    icon: Target
  },
  {
    name: "Bounce In",
    className: "animate-bounce-in",
    description: "Bouncy entrance animation",
    icon: Star
  },
  {
    name: "Float",
    className: "animate-float",
    description: "Gentle floating motion",
    icon: Heart
  },
  {
    name: "Pulse Slow",
    className: "animate-pulse-slow",
    description: "Slow pulsing effect",
    icon: Award
  }
];

export default function AnimationShowcase() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAnimations, setActiveAnimations] = useState<Set<string>>(new Set());

  const triggerAnimation = (className: string) => {
    setActiveAnimations(prev => new Set(prev).add(className));
    setTimeout(() => {
      setActiveAnimations(prev => {
        const newSet = new Set(prev);
        newSet.delete(className);
        return newSet;
      });
    }, 2000);
  };

  const playAllAnimations = () => {
    setIsPlaying(true);
    animationDemos.forEach((demo, index) => {
      setTimeout(() => {
        triggerAnimation(demo.className);
      }, index * 300);
    });
    setTimeout(() => setIsPlaying(false), animationDemos.length * 300 + 2000);
  };

  const resetAnimations = () => {
    setActiveAnimations(new Set());
    setIsPlaying(false);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Animation Showcase
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore the enhanced animation system with interactive demos and effects.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8 animate-slide-up">
          <Button
            onClick={playAllAnimations}
            disabled={isPlaying}
            className="btn-primary tap-target"
          >
            <Play className="w-4 h-4 mr-2" />
            Play All Animations
          </Button>
          
          <Button
            variant="outline"
            onClick={resetAnimations}
            className="tap-target"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Animation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {animationDemos.map((demo, index) => {
            const Icon = demo.icon;
            const isActive = activeAnimations.has(demo.className);
            
            return (
              <Card
                key={demo.name}
                className={`group cursor-pointer transition-all duration-300 hover-lift hover-glow ${
                  isActive ? 'ring-2 ring-primary-500 bg-primary-50' : ''
                }`}
                onClick={() => triggerAnimation(demo.className)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br from-primary-100 to-primary-200 group-hover:scale-110 transition-transform duration-300 ${
                      isActive ? demo.className : ''
                    }`}>
                      <Icon className="w-8 h-8 text-primary-600" />
                    </div>
                    <div className="text-right">
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                        #{index + 1}
                      </span>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {demo.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {demo.description}
                  </p>
                  
                  {/* Demo Element */}
                  <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                    <div className={`w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center ${
                      isActive ? demo.className : ''
                    }`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full group-hover:bg-primary-600 group-hover:text-white transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerAnimation(demo.className);
                      }}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Try Animation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Hover Effects Demo */}
        <div className="mt-16 animate-slide-up">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Hover Effects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover-lift cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Hover Lift</h4>
                <p className="text-sm text-gray-600">
                  Cards lift up with enhanced shadow on hover
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-glow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Hover Glow</h4>
                <p className="text-sm text-gray-600">
                  Subtle glow effect around the card
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-lift hover-glow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Combined Effects</h4>
                <p className="text-sm text-gray-600">
                  Both lift and glow effects together
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Performance Info */}
        <div className="mt-12 text-center animate-fade-in">
          <div className="bg-white rounded-lg p-6 shadow-sm border max-w-2xl mx-auto">
            <h4 className="font-semibold text-gray-900 mb-3">Performance Optimized</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Hardware Accelerated</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Reduced Motion Support</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600">Smooth Transitions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
