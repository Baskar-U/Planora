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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { auth, db } from "@/lib/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useServicesByVendor } from "@/hooks/useFirebaseData";
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle,
  User,
  Phone,
  Mail,
  FileText,
  CalendarDays,
  X
} from "lucide-react";

const vendorBookingSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  eventDate: z.string().min(1, "Event date is required"),
  eventLocation: z.string().min(1, "Event location is required"),
  guestCount: z.coerce.number().min(1, "Guest count is required"),
  budget: z.coerce.number().min(1000, "Budget must be at least ₹1,000"),
  eventDescription: z.string().min(20, "Description must be at least 20 characters"),
  specificRequirements: z.string().optional(),
  selectedTimeSlot: z.string().min(1, "Please select a time slot"),
  selectedServices: z.array(z.string()).min(1, "Please select at least one service"),
});

type VendorBookingFormData = z.infer<typeof vendorBookingSchema>;

interface VendorBookingFormProps {
  vendor: {
    id: string;
    name: string;
    businessname: string;
    eventname: string;
    description: string;
    location: string;
    price: number;
    priceUnit: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface AvailabilityData {
  date: string;
  timeSlots: TimeSlot[];
  isAvailable: boolean;
}

export default function VendorBookingForm({ vendor, isOpen, onClose }: VendorBookingFormProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string>("");
  
  // Fetch vendor services
  const { data: vendorServices = [], isLoading: servicesLoading } = useServicesByVendor(vendor.id);

  const form = useForm<VendorBookingFormData>({
    resolver: zodResolver(vendorBookingSchema),
    defaultValues: {
      customerName: "",
      email: "",
      phone: "",
      eventDate: "",
      eventLocation: "",
      guestCount: 0,
      budget: 0,
      eventDescription: "",
      specificRequirements: "",
      selectedTimeSlot: "",
      selectedServices: [],
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: VendorBookingFormData) => {
      if (!auth.currentUser) throw new Error("User not authenticated");
      
      const booking = {
        bookingId: `VB-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        customerId: auth.currentUser.uid,
        customerName: bookingData.customerName,
        customerEmail: bookingData.email,
        customerPhone: bookingData.phone,
        vendorId: vendor.id,
        vendorName: vendor.businessname,
        serviceType: vendor.eventname.toLowerCase(),
        eventDate: bookingData.eventDate,
        eventLocation: bookingData.eventLocation,
        guestCount: bookingData.guestCount,
        budget: bookingData.budget,
        selectedTimeSlot: bookingData.selectedTimeSlot,
        selectedServices: bookingData.selectedServices,
        eventDescription: bookingData.eventDescription,
        specificRequirements: bookingData.specificRequirements || "",
        status: "pending",
        paymentStatus: "pending",
        vendorResponse: null,
        vendorNotes: "",
        customerNotes: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, "vendorBookings"), booking);
      
      return {
        ...booking,
        id: docRef.id
      };
    },
    onSuccess: (data) => {
      setBookingId(data.bookingId);
      setShowSuccess(true);
      toast({
        title: "Booking Submitted Successfully!",
        description: "The vendor will review your booking and get back to you shortly.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit booking",
        variant: "destructive",
      });
    },
  });

  const fetchVendorAvailability = async (date: string) => {
    setLoadingAvailability(true);
    try {
      const availabilityRef = collection(db, "vendorAvailability");
      const q = query(
        availabilityRef,
        where("vendorId", "==", vendor.id),
        where("date", "==", date)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const availabilityDoc = querySnapshot.docs[0];
        const data = availabilityDoc.data();
        setAvailabilityData([{
          date: data.date,
          timeSlots: data.timeSlots || [],
          isAvailable: data.isAvailable
        }]);
      } else {
        setAvailabilityData([]);
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
      toast({
        title: "Error",
        description: "Failed to fetch vendor availability",
        variant: "destructive",
      });
    } finally {
      setLoadingAvailability(false);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    form.setValue("eventDate", date);
    form.setValue("selectedTimeSlot", "");
    if (date) {
      fetchVendorAvailability(date);
    }
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    form.setValue("selectedTimeSlot", timeSlot);
  };

  const onSubmit = (data: VendorBookingFormData) => {
    createBookingMutation.mutate(data);
  };

  const handleClose = () => {
    if (!createBookingMutation.isPending) {
      onClose();
      setShowSuccess(false);
      setBookingId("");
      form.reset();
      setSelectedDate("");
      setAvailabilityData([]);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 22; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 2).toString().padStart(2, '0')}:00`;
      slots.push({
        id: `${startTime}-${endTime}`,
        startTime,
        endTime,
        isAvailable: true
      });
    }
    return slots;
  };

  const defaultTimeSlots = generateTimeSlots();
  const availableSlots = availabilityData.length > 0 
    ? availabilityData[0].timeSlots.filter(slot => slot.isAvailable)
    : defaultTimeSlots;

  if (showSuccess && bookingId) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-center text-xl font-bold text-gray-900">
              Booking Submitted!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Your booking request has been submitted successfully. The vendor will review your request and get back to you shortly.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Booking ID:</strong> {bookingId}
              </p>
            </div>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Book {vendor.businessname}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Vendor Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{vendor.businessname}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{vendor.location || 'Location not specified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span>₹{vendor.price ? vendor.price.toLocaleString() : 'Contact for pricing'} {vendor.priceUnit || ''}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span>{vendor.eventname || 'Event details not specified'}</span>
                </div>
              </div>
              <p className="text-gray-600 mt-3">{vendor.description || 'No description available'}</p>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Event Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Event Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="eventDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field}
                            onChange={(e) => handleDateChange(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="guestCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Guests</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter number of guests" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="eventLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter event location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget (₹)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your budget" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Service Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Select Services</h3>
                
                {servicesLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-2">Loading services...</p>
                  </div>
                ) : vendorServices.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-600">No services available for this vendor.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {vendorServices.map((service) => (
                      <div key={service.id || 'unknown'} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                        <Checkbox
                          id={service.id || 'unknown'}
                          checked={form.watch("selectedServices").includes(service.id || '')}
                          onCheckedChange={(checked) => {
                            const currentServices = form.watch("selectedServices");
                            if (checked && service.id) {
                              form.setValue("selectedServices", [...currentServices, service.id]);
                            } else if (!checked && service.id) {
                              form.setValue("selectedServices", currentServices.filter(id => id !== service.id));
                            }
                          }}
                        />
                        <div className="flex-1">
                          <Label htmlFor={service.id} className="text-sm font-medium cursor-pointer">
                            {service.name || 'Unnamed Service'}
                          </Label>
                          <p className="text-xs text-gray-600 mt-1">{service.description || 'No description available'}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {service.category || 'General'}
                            </Badge>
                            <span className="text-xs font-medium text-green-600">
                              ₹{(service.price || 0).toLocaleString()} {service.priceUnit || 'fixed'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <FormField
                  control={form.control}
                  name="selectedServices"
                  render={({ field }) => (
                    <FormItem>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Time Slot Selection */}
              {selectedDate && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Select Time Slot</h3>
                  
                  {loadingAvailability ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-sm text-gray-600 mt-2">Loading availability...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot.id}
                          type="button"
                          variant={form.watch("selectedTimeSlot") === slot.id ? "default" : "outline"}
                          onClick={() => handleTimeSlotSelect(slot.id)}
                          className="h-12"
                        >
                          {slot.startTime} - {slot.endTime}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  <FormField
                    control={form.control}
                    name="selectedTimeSlot"
                    render={({ field }) => (
                      <FormItem>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Event Description */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Event Requirements</h3>
                
                <FormField
                  control={form.control}
                  name="eventDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your event, theme, and requirements..."
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specificRequirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specific Requirements (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any specific requirements or special requests..."
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createBookingMutation.isPending}
                  className="min-w-[120px]"
                >
                  {createBookingMutation.isPending ? "Submitting..." : "Submit Booking"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
