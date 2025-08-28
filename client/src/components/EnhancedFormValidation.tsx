import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader2,
  Eye,
  EyeOff,
  Calendar,
  MapPin,
  Users,
  DollarSign
} from "lucide-react";

interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
  icon?: any;
}

interface FieldValidation {
  value: string;
  isValid: boolean;
  error: string;
  isTouched: boolean;
}

export default function EnhancedFormValidation() {
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: '',
    date: '',
    location: '',
    budget: '',
    attendees: '',
    description: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [validation, setValidation] = useState<Record<string, FieldValidation>>({
    eventName: { value: '', isValid: false, error: '', isTouched: false },
    eventType: { value: '', isValid: false, error: '', isTouched: false },
    date: { value: '', isValid: false, error: '', isTouched: false },
    location: { value: '', isValid: false, error: '', isTouched: false },
    budget: { value: '', isValid: false, error: '', isTouched: false },
    attendees: { value: '', isValid: false, error: '', isTouched: false },
    description: { value: '', isValid: false, error: '', isTouched: false },
    email: { value: '', isValid: false, error: '', isTouched: false },
    password: { value: '', isValid: false, error: '', isTouched: false },
    confirmPassword: { value: '', isValid: false, error: '', isTouched: false }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Validation rules
  const validationRules: Record<string, ValidationRule[]> = {
    eventName: [
      { test: (value) => value.length >= 3, message: "Event name must be at least 3 characters", icon: AlertCircle },
      { test: (value) => value.length <= 100, message: "Event name must be less than 100 characters", icon: AlertCircle }
    ],
    eventType: [
      { test: (value) => value.length > 0, message: "Please select an event type", icon: AlertCircle }
    ],
    date: [
      { test: (value) => value.length > 0, message: "Please select a date", icon: Calendar },
      { test: (value) => new Date(value) > new Date(), message: "Date must be in the future", icon: Calendar }
    ],
    location: [
      { test: (value) => value.length >= 5, message: "Location must be at least 5 characters", icon: MapPin }
    ],
    budget: [
      { test: (value) => /^\d+$/.test(value), message: "Budget must be a number", icon: DollarSign },
      { test: (value) => parseInt(value) >= 100, message: "Budget must be at least $100", icon: DollarSign }
    ],
    attendees: [
      { test: (value) => /^\d+$/.test(value), message: "Number of attendees must be a number", icon: Users },
      { test: (value) => parseInt(value) >= 1, message: "Must have at least 1 attendee", icon: Users }
    ],
    description: [
      { test: (value) => value.length >= 10, message: "Description must be at least 10 characters", icon: AlertCircle },
      { test: (value) => value.length <= 500, message: "Description must be less than 500 characters", icon: AlertCircle }
    ],
    email: [
      { test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), message: "Please enter a valid email address", icon: AlertCircle }
    ],
    password: [
      { test: (value) => value.length >= 8, message: "Password must be at least 8 characters", icon: AlertCircle },
      { test: (value) => /[A-Z]/.test(value), message: "Password must contain at least one uppercase letter", icon: AlertCircle },
      { test: (value) => /[a-z]/.test(value), message: "Password must contain at least one lowercase letter", icon: AlertCircle },
      { test: (value) => /\d/.test(value), message: "Password must contain at least one number", icon: AlertCircle },
      { test: (value) => /[!@#$%^&*]/.test(value), message: "Password must contain at least one special character (!@#$%^&*)", icon: AlertCircle }
    ],
    confirmPassword: [
      { test: (value) => value === formData.password, message: "Passwords must match", icon: AlertCircle }
    ]
  };

  // Password strength calculation
  useEffect(() => {
    const password = formData.password;
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    
    setPasswordStrength(strength);
  }, [formData.password]);

  const validateField = (fieldName: string, value: string): FieldValidation => {
    const rules = validationRules[fieldName] || [];
    let isValid = true;
    let error = '';

    for (const rule of rules) {
      if (!rule.test(value)) {
        isValid = false;
        error = rule.message;
        break;
      }
    }

    return {
      value,
      isValid,
      error,
      isTouched: true
    };
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    const fieldValidation = validateField(fieldName, value);
    setValidation(prev => ({
      ...prev,
      [fieldName]: fieldValidation
    }));
  };

  const handleFieldBlur = (fieldName: string) => {
    const fieldValidation = validateField(fieldName, formData[fieldName as keyof typeof formData]);
    setValidation(prev => ({
      ...prev,
      [fieldName]: { ...fieldValidation, isTouched: true }
    }));
  };

  const isFormValid = () => {
    return Object.values(validation).every(field => field.isValid);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      // Mark all fields as touched to show errors
      const updatedValidation = { ...validation };
      Object.keys(updatedValidation).forEach(fieldName => {
        updatedValidation[fieldName].isTouched = true;
      });
      setValidation(updatedValidation);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    
    // Show success message (you can integrate with your toast system)
    alert('Form submitted successfully!');
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    if (passwordStrength <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Fair';
    if (passwordStrength <= 4) return 'Good';
    return 'Strong';
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Enhanced Form Validation Demo
          </CardTitle>
          <p className="text-gray-600 text-center">
            Real-time validation with immediate feedback and loading states
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Event Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eventName">Event Name *</Label>
                  <div className="relative">
                    <Input
                      id="eventName"
                      value={formData.eventName}
                      onChange={(e) => handleFieldChange('eventName', e.target.value)}
                      onBlur={() => handleFieldBlur('eventName')}
                      className={`${
                        validation.eventName.isTouched && !validation.eventName.isValid
                          ? 'border-red-500 focus:border-red-500'
                          : validation.eventName.isValid
                          ? 'border-green-500 focus:border-green-500'
                          : ''
                      }`}
                    />
                    {validation.eventName.isTouched && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {validation.eventName.isValid ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {validation.eventName.isTouched && !validation.eventName.isValid && (
                    <Alert className="mt-2 border-red-200 bg-red-50">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <AlertDescription className="text-red-700">
                        {validation.eventName.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div>
                  <Label htmlFor="eventType">Event Type *</Label>
                  <Select
                    value={formData.eventType}
                    onValueChange={(value) => handleFieldChange('eventType', value)}
                  >
                    <SelectTrigger className={`${
                      validation.eventType.isTouched && !validation.eventType.isValid
                        ? 'border-red-500 focus:border-red-500'
                        : validation.eventType.isValid
                        ? 'border-green-500 focus:border-green-500'
                        : ''
                    }`}>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="corporate">Corporate Event</SelectItem>
                      <SelectItem value="birthday">Birthday Party</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {validation.eventType.isTouched && !validation.eventType.isValid && (
                    <Alert className="mt-2 border-red-200 bg-red-50">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <AlertDescription className="text-red-700">
                        {validation.eventType.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div>
                  <Label htmlFor="date">Event Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleFieldChange('date', e.target.value)}
                    onBlur={() => handleFieldBlur('date')}
                    className={`${
                      validation.date.isTouched && !validation.date.isValid
                        ? 'border-red-500 focus:border-red-500'
                        : validation.date.isValid
                        ? 'border-green-500 focus:border-green-500'
                        : ''
                    }`}
                  />
                  {validation.date.isTouched && !validation.date.isValid && (
                    <Alert className="mt-2 border-red-200 bg-red-50">
                      <Calendar className="w-4 h-4 text-red-500" />
                      <AlertDescription className="text-red-700">
                        {validation.date.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleFieldChange('location', e.target.value)}
                    onBlur={() => handleFieldBlur('location')}
                    placeholder="Enter event location"
                    className={`${
                      validation.location.isTouched && !validation.location.isValid
                        ? 'border-red-500 focus:border-red-500'
                        : validation.location.isValid
                        ? 'border-green-500 focus:border-green-500'
                        : ''
                    }`}
                  />
                  {validation.location.isTouched && !validation.location.isValid && (
                    <Alert className="mt-2 border-red-200 bg-red-50">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <AlertDescription className="text-red-700">
                        {validation.location.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div>
                  <Label htmlFor="budget">Budget ($) *</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleFieldChange('budget', e.target.value)}
                    onBlur={() => handleFieldBlur('budget')}
                    placeholder="Enter your budget"
                    className={`${
                      validation.budget.isTouched && !validation.budget.isValid
                        ? 'border-red-500 focus:border-red-500'
                        : validation.budget.isValid
                        ? 'border-green-500 focus:border-green-500'
                        : ''
                    }`}
                  />
                  {validation.budget.isTouched && !validation.budget.isValid && (
                    <Alert className="mt-2 border-red-200 bg-red-50">
                      <DollarSign className="w-4 h-4 text-red-500" />
                      <AlertDescription className="text-red-700">
                        {validation.budget.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div>
                  <Label htmlFor="attendees">Number of Attendees *</Label>
                  <Input
                    id="attendees"
                    type="number"
                    value={formData.attendees}
                    onChange={(e) => handleFieldChange('attendees', e.target.value)}
                    onBlur={() => handleFieldBlur('attendees')}
                    placeholder="Enter number of attendees"
                    className={`${
                      validation.attendees.isTouched && !validation.attendees.isValid
                        ? 'border-red-500 focus:border-red-500'
                        : validation.attendees.isValid
                        ? 'border-green-500 focus:border-green-500'
                        : ''
                    }`}
                  />
                  {validation.attendees.isTouched && !validation.attendees.isValid && (
                    <Alert className="mt-2 border-red-200 bg-red-50">
                      <Users className="w-4 h-4 text-red-500" />
                      <AlertDescription className="text-red-700">
                        {validation.attendees.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Event Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  onBlur={() => handleFieldBlur('description')}
                  placeholder="Describe your event..."
                  rows={4}
                  className={`${
                    validation.description.isTouched && !validation.description.isValid
                      ? 'border-red-500 focus:border-red-500'
                      : validation.description.isValid
                      ? 'border-green-500 focus:border-green-500'
                      : ''
                  }`}
                />
                {validation.description.isTouched && !validation.description.isValid && (
                  <Alert className="mt-2 border-red-200 bg-red-50">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <AlertDescription className="text-red-700">
                      {validation.description.error}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            {/* Account Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Account Details
              </h3>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  onBlur={() => handleFieldBlur('email')}
                  placeholder="Enter your email"
                  className={`${
                    validation.email.isTouched && !validation.email.isValid
                      ? 'border-red-500 focus:border-red-500'
                      : validation.email.isValid
                      ? 'border-green-500 focus:border-green-500'
                      : ''
                  }`}
                />
                {validation.email.isTouched && !validation.email.isValid && (
                  <Alert className="mt-2 border-red-200 bg-red-50">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <AlertDescription className="text-red-700">
                      {validation.email.error}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                    onBlur={() => handleFieldBlur('password')}
                    placeholder="Enter your password"
                    className={`${
                      validation.password.isTouched && !validation.password.isValid
                        ? 'border-red-500 focus:border-red-500'
                        : validation.password.isValid
                        ? 'border-green-500 focus:border-green-500'
                        : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-600">Password strength:</span>
                      <Badge variant="outline" className={`text-xs ${getPasswordStrengthColor().replace('bg-', 'text-')}`}>
                        {getPasswordStrengthText()}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {validation.password.isTouched && !validation.password.isValid && (
                  <Alert className="mt-2 border-red-200 bg-red-50">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <AlertDescription className="text-red-700">
                      {validation.password.error}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                    onBlur={() => handleFieldBlur('confirmPassword')}
                    placeholder="Confirm your password"
                    className={`${
                      validation.confirmPassword.isTouched && !validation.confirmPassword.isValid
                        ? 'border-red-500 focus:border-red-500'
                        : validation.confirmPassword.isValid
                        ? 'border-green-500 focus:border-green-500'
                        : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {validation.confirmPassword.isTouched && !validation.confirmPassword.isValid && (
                  <Alert className="mt-2 border-red-200 bg-red-50">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <AlertDescription className="text-red-700">
                      {validation.confirmPassword.error}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            {/* Form Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Form Status:</span>
                {isFormValid() ? (
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Ready to Submit
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-orange-600">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Please Fix Errors
                  </Badge>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {Object.values(validation).filter(field => field.isValid).length} / {Object.keys(validation).length} fields valid
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={!isFormValid() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Form'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
