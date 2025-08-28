import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { firebaseService } from "@/lib/firebaseService";
import { 
  CalendarDays, 
  Clock, 
  Plus, 
  Trash2,
  Save,
  Upload,
  MapPin,
  DollarSign,
  Package
} from "lucide-react";

const serviceSchema = z.object({
  // Service Information
  name: z.string().min(1, "Service name is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  tags: z.array(z.string()).min(1, "Add at least one tag"),
  
  // Pricing
  price: z.coerce.number().min(0, "Price must be positive"),
  priceUnit: z.string().min(1, "Price unit is required"),
  currency: z.string().default("INR"),
  originalPrice: z.coerce.number().optional(),
  discountPercentage: z.coerce.number().min(0).max(100).optional(),
  
  // Location
  location: z.string().min(1, "Location is required"),
  
  // Service Details
  duration: z.string().min(1, "Duration is required"),
  capacity: z.object({
    min: z.coerce.number().min(1, "Minimum capacity is required"),
    max: z.coerce.number().min(1, "Maximum capacity is required"),
    unit: z.string().default("guests")
  }),
  
  // Features
  features: z.array(z.string()).min(1, "At least one feature is required"),
  requirements: z.array(z.string()).optional(),
  
  // Availability
  availableDays: z.array(z.string()).min(1, "Select at least one day"),
  availableTimeSlots: z.array(z.object({
    start: z.string(),
    end: z.string(),
    label: z.string()
  })).min(1, "Add at least one time slot"),
  
  // Images
  images: z.array(z.string()).optional(),
  
  // Status
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isPopular: z.boolean().default(false),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

const categories = [
  "Photography",
  "Catering", 
  "Decoration",
  "DJ",
  "Cakes",
  "Return Gift",
  "Transport",
  "Venue",
  "Wedding",
  "Birthday",
  "Corporate",
  "Orchestra"
];

const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const timeSlots = [
  "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00",
  "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00",
  "17:00-18:00", "18:00-19:00", "19:00-20:00", "20:00-21:00"
];

export default function VendorServiceForm() {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [timeSlotData, setTimeSlotData] = useState<Array<{day: string, slots: string[]}>>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      shortDescription: "",
      category: "",
      subcategory: "",
      tags: [],
      price: 0,
      priceUnit: "per_person",
      currency: "INR",
      originalPrice: 0,
      discountPercentage: 0,
      location: "",
      duration: "4 hours",
      capacity: {
        min: 50,
        max: 500,
        unit: "guests"
      },
      features: [],
      requirements: [],
      availableDays: [],
      availableTimeSlots: [
        { start: "09:00", end: "12:00", label: "Morning" },
        { start: "18:00", end: "23:00", label: "Evening" }
      ],
      images: [],
      isActive: true,
      isFeatured: false,
      isPopular: false
    }
  });

  const createServiceMutation = useMutation({
    mutationFn: async (data: ServiceFormData) => {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      
      const serviceData = {
        ...data,
        vendorId: user.uid,
        vendorName: user.displayName || "Vendor",
        vendorLocation: data.location,
        averageRating: 0,
        totalReviews: 0,
        totalBookings: 0,
        searchKeywords: [
          data.category.toLowerCase(),
          data.name.toLowerCase(),
          ...data.tags
        ],
        slug: data.name.toLowerCase().replace(/\s+/g, "-"),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      return firebaseService.createVendorService(serviceData);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Service created successfully",
      });
      form.reset();
      setSelectedDays([]);
      setTimeSlotData([]);
      queryClient.invalidateQueries({ queryKey: ["vendorServices"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleDayToggle = (day: string) => {
    const newSelectedDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];
    
    setSelectedDays(newSelectedDays);
    form.setValue("availableDays", newSelectedDays);
    
    // Update time slots
    const newTimeSlotData = newSelectedDays.map(day => ({
      day,
      slots: timeSlotData.find(ts => ts.day === day)?.slots || []
    }));
    setTimeSlotData(newTimeSlotData);
    form.setValue("timeSlots", newTimeSlotData);
  };

  const handleTimeSlotToggle = (day: string, slot: string) => {
    const dayData = timeSlotData.find(ts => ts.day === day);
    const newSlots = dayData?.slots.includes(slot)
      ? dayData.slots.filter(s => s !== slot)
      : [...(dayData?.slots || []), slot];
    
    const newTimeSlotData = timeSlotData.map(ts => 
      ts.day === day ? { ...ts, slots: newSlots } : ts
    );
    
    setTimeSlotData(newTimeSlotData);
    form.setValue("timeSlots", newTimeSlotData);
  };

  const onSubmit = (data: ServiceFormData) => {
    createServiceMutation.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Add New Service
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Service Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Wedding Photography Package" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your service in detail..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Brief description for service cards (max 100 characters)"
                        maxLength={100}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tags */}
              <div>
                <Label className="text-sm font-medium">Tags</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {[
                    "wedding", "corporate", "birthday", "anniversary", "vegetarian", 
                    "non-vegetarian", "buffet", "live-counters", "premium", "budget",
                    "outdoor", "indoor", "customized", "traditional", "modern"
                  ].map((tag) => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={tag}
                        checked={form.watch("tags").includes(tag)}
                        onCheckedChange={(checked) => {
                          const currentTags = form.watch("tags");
                          const newTags = checked
                            ? [...currentTags, tag]
                            : currentTags.filter(t => t !== tag);
                          form.setValue("tags", newTags);
                        }}
                      />
                      <Label htmlFor={tag} className="text-sm">{tag}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="priceUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Unit</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="per_person">Per Person</SelectItem>
                          <SelectItem value="fixed">Fixed</SelectItem>
                          <SelectItem value="per_hour">Per Hour</SelectItem>
                          <SelectItem value="per_day">Per Day</SelectItem>
                          <SelectItem value="per_event">Per Event</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="originalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Price (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discountPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" min="0" max="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="INR">INR (₹)</SelectItem>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Service Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 4 hours" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capacity.min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Capacity</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capacity.max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Capacity</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capacity.unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity Unit</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="guests">Guests</SelectItem>
                          <SelectItem value="people">People</SelectItem>
                          <SelectItem value="attendees">Attendees</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Mumbai, Maharashtra" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Features */}
              <div>
                <Label className="text-sm font-medium">Features</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {[
                    "Professional Setup", "Customization", "On-site Service", 
                    "Equipment Included", "Staff Provided", "Insurance Coverage",
                    "Backup Plan", "Quality Guarantee", "Flexible Timing", "Emergency Support"
                  ].map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature}
                        checked={form.watch("features").includes(feature)}
                        onCheckedChange={(checked) => {
                          const currentFeatures = form.watch("features");
                          const newFeatures = checked
                            ? [...currentFeatures, feature]
                            : currentFeatures.filter(f => f !== feature);
                          form.setValue("features", newFeatures);
                        }}
                      />
                      <Label htmlFor={feature} className="text-sm">{feature}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div>
                <Label className="text-sm font-medium">Requirements</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {[
                    "Kitchen access required", "Power supply needed", "Minimum 24 hours notice",
                    "Access to water supply", "Refrigeration facilities", "Outdoor space preferred",
                    "Ventilation required", "Venue coordination required", "Setup time needed"
                  ].map((requirement) => (
                    <div key={requirement} className="flex items-center space-x-2">
                      <Checkbox
                        id={requirement}
                        checked={form.watch("requirements").includes(requirement)}
                        onCheckedChange={(checked) => {
                          const currentRequirements = form.watch("requirements");
                          const newRequirements = checked
                            ? [...currentRequirements, requirement]
                            : currentRequirements.filter(r => r !== requirement);
                          form.setValue("requirements", newRequirements);
                        }}
                      />
                      <Label htmlFor={requirement} className="text-sm">{requirement}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability Calendar */}
              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Availability & Time Slots
                </Label>
                
                {/* Days Selection */}
                <div className="grid grid-cols-7 gap-2 mt-2">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="flex flex-col items-center">
                      <Checkbox
                        id={day}
                        checked={selectedDays.includes(day)}
                        onCheckedChange={() => handleDayToggle(day)}
                      />
                      <Label htmlFor={day} className="text-xs mt-1">{day.slice(0, 3)}</Label>
                    </div>
                  ))}
                </div>

                {/* Time Slots */}
                {selectedDays.length > 0 && (
                  <div className="mt-4 space-y-4">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Time Slots
                    </Label>
                    
                    {selectedDays.map((day) => (
                      <div key={day} className="border rounded-lg p-4">
                        <Label className="font-medium">{day}</Label>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                          {timeSlots.map((slot) => (
                            <div key={slot} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${day}-${slot}`}
                                checked={timeSlotData.find(ts => ts.day === day)?.slots.includes(slot) || false}
                                onCheckedChange={() => handleTimeSlotToggle(day, slot)}
                              />
                              <Label htmlFor={`${day}-${slot}`} className="text-sm">{slot}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full"
                disabled={createServiceMutation.isPending}
              >
                {createServiceMutation.isPending ? (
                  "Creating Service..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Service
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
