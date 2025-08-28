import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw, ArrowRight, ArrowLeft } from "lucide-react";
import ProgressIndicator, { EVENT_PLANNING_STEPS, updateStepStatus } from "./ProgressIndicator";

export default function ProgressDemo() {
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState(EVENT_PLANNING_STEPS);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [speed, setSpeed] = useState(3000); // 3 seconds per step

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAutoPlaying && currentStep < steps.length) {
      interval = setInterval(() => {
        handleNext();
      }, speed);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, currentStep, speed]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      const nextStep = currentStep + 1;
      const stepId = steps[nextStep - 1]?.id;
      if (stepId) {
        const updatedSteps = updateStepStatus(steps, stepId);
        setSteps(updatedSteps);
        setCurrentStep(nextStep);
      }
    } else {
      setIsAutoPlaying(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      const stepId = steps[prevStep - 1]?.id;
      if (stepId) {
        const updatedSteps = updateStepStatus(steps, stepId);
        setSteps(updatedSteps);
        setCurrentStep(prevStep);
      }
    }
  };

  const handleReset = () => {
    setSteps(EVENT_PLANNING_STEPS);
    setCurrentStep(1);
    setIsAutoPlaying(false);
  };

  const handleStepClick = (stepId: string) => {
    const stepIndex = steps.findIndex(step => step.id === stepId);
    if (stepIndex !== -1) {
      const updatedSteps = updateStepStatus(steps, stepId);
      setSteps(updatedSteps);
      setCurrentStep(stepIndex + 1);
    }
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Interactive Progress Demo
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how the progress indicator works in real-time. Click on steps or use the controls below.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 animate-slide-up">
          <ProgressIndicator 
            steps={steps} 
            currentStep={currentStep}
            showDescriptions={true}
          />
        </div>

        {/* Controls */}
        <Card className="mb-8 animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              <span>Demo Controls</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {/* Navigation Controls */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentStep <= 1}
                  className="tap-target"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentStep >= steps.length}
                  className="tap-target"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {/* Auto-play Controls */}
              <div className="flex items-center space-x-2">
                <Button
                  variant={isAutoPlaying ? "destructive" : "default"}
                  size="sm"
                  onClick={toggleAutoPlay}
                  className="tap-target"
                >
                  {isAutoPlaying ? (
                    <>
                      <Pause className="w-4 h-4 mr-1" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-1" />
                      Auto-play
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="tap-target"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
              </div>

              {/* Speed Control */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Speed:</label>
                <select
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value={1000}>Fast (1s)</option>
                  <option value={3000}>Normal (3s)</option>
                  <option value={5000}>Slow (5s)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-slide-up">
          {steps.map((step, index) => {
            const isActive = step.status === 'current';
            const isCompleted = step.status === 'completed';
            
            return (
              <Card
                key={step.id}
                className={`cursor-pointer transition-all duration-300 hover-lift ${
                  isActive ? 'ring-2 ring-primary-500 bg-primary-50' : ''
                } ${isCompleted ? 'bg-green-50' : ''}`}
                onClick={() => handleStepClick(step.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold text-sm ${
                        isActive ? 'text-primary-700' : 'text-gray-900'
                      }`}>
                        {step.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Status Info */}
        <div className="mt-8 text-center animate-fade-in">
          <div className="inline-flex items-center space-x-4 bg-white px-6 py-3 rounded-full shadow-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                Current: {steps[currentStep - 1]?.title}
              </span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                Completed: {steps.filter(s => s.status === 'completed').length}
              </span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                Remaining: {steps.filter(s => s.status === 'upcoming').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
