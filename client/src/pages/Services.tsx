import { useState, useEffect } from "react";
import { useServices } from "@/hooks/useFirebaseData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  Plus, 
  ArrowLeft, 
  MapPin, 
  Calendar,
  User,
  Building,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import { Link, useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import VendorBookingForm from "@/components/VendorBookingForm";
import { FeaturedAd, HorizontalAd, SectionAd } from "@/components/AdComponent";

const categories = [
  "All",
  "Venue",
  "Catering", 
  "Decoration",
  "DJ",
  "Cakes",
  "Return Gift",
  "Photography",
  "Transport",
  "Wedding",
  "Birthday",
  "Corporate"
];

const priceRanges = [
  "All",
  "Under ₹1000",
  "₹1000 - ₹5000",
  "₹5000 - ₹10000",
  "₹10000 - ₹25000",
  "Above ₹25000"
];

export default function Services() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [user, setUser] = useState<any>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle back navigation
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation("/");
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  // Fetch all services and apply filters client-side
  const { data: allServices = [], isLoading } = useServices();

  const addToCartMutation = useMutation({
    mutationFn: async ({ serviceId }: { serviceId: string }) => {
      if (!user) throw new Error("User not authenticated");
      const response = await apiRequest("POST", "/api/cart", {
        userId: user.uid,
        serviceId,
        quantity: 1,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", user?.uid] });
      toast({
        title: "Success",
        description: "Service added to cart",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add to cart",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = (serviceId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to cart",
        variant: "destructive",
      });
      return;
    }
    addToCartMutation.mutate({ serviceId });
  };

  const handleBookService = (service: any) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to book services",
        variant: "destructive",
      });
      return;
    }
    setSelectedVendor({
      id: service.vendorId,
      name: service.vendorName || service.name,
      businessname: service.vendorCompany || service.name,
      eventname: service.name,
      description: service.description,
      location: service.vendorLocation || 'Location not specified',
      price: service.price,
      priceUnit: service.priceUnit
    });
    setShowBookingForm(true);
  };

  const handleViewVendorProfile = (vendorId: string) => {
    setLocation(`/vendor/${vendorId}`);
  };

  // Apply category and price filters
  let filteredServices = allServices;

  if (selectedCategory !== "All") {
    filteredServices = filteredServices.filter(service => 
      service.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }

  if (selectedPriceRange !== "All") {
    filteredServices = filteredServices.filter(service => {
      const price = service.price;
      switch (selectedPriceRange) {
        case "Under ₹1000":
          return price < 1000;
        case "₹1000 - ₹5000":
          return price >= 1000 && price <= 5000;
        case "₹5000 - ₹10000":
          return price >= 5000 && price <= 10000;
        case "₹10000 - ₹25000":
          return price >= 10000 && price <= 25000;
        case "Above ₹25000":
          return price > 25000;
        default:
          return true;
      }
    });
  }

  // Filter by search term
  if (searchTerm) {
    filteredServices = filteredServices.filter(service =>
      (service.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (service.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (service.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Venue': 'bg-blue-100 text-blue-800',
      'Catering': 'bg-orange-100 text-orange-800',
      'Decoration': 'bg-pink-100 text-pink-800',
      'DJ': 'bg-green-100 text-green-800',
      'Cakes': 'bg-red-100 text-red-800',
      'Return Gift': 'bg-yellow-100 text-yellow-800',
      'Photography': 'bg-purple-100 text-purple-800',
      'Transport': 'bg-indigo-100 text-indigo-800',
      'Wedding': 'bg-rose-100 text-rose-800',
      'Birthday': 'bg-purple-100 text-purple-800',
      'Corporate': 'bg-slate-100 text-slate-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatPrice = (price: number, unit: string) => {
    if (unit === 'person') return `₹${price}/person`;
    if (unit === 'piece') return `₹${price}/piece`;
    return `₹${price.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <LoadingSpinner size="lg" text="Loading services..." />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Event Services</h1>
          <p className="text-gray-600 text-lg">
            Discover and book the best event services for your special occasions
          </p>
        </div>

        {/* Ad after header */}
        <div className="mb-8">
          <FeaturedAd />
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price Range Filter */}
            <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Ad between filters and results */}
        <div className="mb-8">
          <HorizontalAd />
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {filteredServices.length} of {allServices.length} services
              </p>
            </div>

            {/* Services Grid/List */}
            <div className={
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-6"
            }>
              {filteredServices.map((service, index) => (
                <Card 
                  key={service.id} 
                  className="group cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={service.images?.[0] || "/placeholder-service.jpg"}
                      alt={service.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                    />
                    {/* Vendor Info Overlay */}
                    <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400" />
                        <span>{service.vendorRating?.toFixed(1) || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getCategoryColor(service.category)}>
                        {service.category}
                      </Badge>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                        <span className="text-sm font-medium text-gray-700">
                          {service.rating?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                    
                    {/* Vendor Information */}
                    <div className="flex items-center gap-3 mt-3 p-3 bg-gray-50 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={service.vendorImage} />
                        <AvatarFallback>
                          {service.vendorName?.charAt(0) || "V"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {service.vendorName || "Unknown Vendor"}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {service.vendorCompany || "Unknown Company"}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <MapPin className="h-3 w-3" />
                          <span>{service.vendorLocation || "Location not specified"}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary-600">
                        {formatPrice(service.price, service.priceUnit)}
                      </span>
                      {service.vendorExperience && (
                        <Badge variant="outline" className="text-xs">
                          {service.vendorExperience} years exp.
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex flex-col gap-2">
                    <div className="flex gap-2 w-full">
                      <Button 
                        onClick={() => handleBookService(service)}
                        className="flex-1"
                        size="sm"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Book Now
                      </Button>
                      <Button 
                        onClick={() => handleViewVendorProfile(service.vendorId)}
                        variant="outline"
                        size="sm"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button 
                      onClick={() => handleAddToCart(service.id!)}
                      variant="outline"
                      className="w-full"
                      size="sm"
                      disabled={addToCartMutation.isPending}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Ad after services grid */}
            <div className="mt-8">
              <SectionAd />
            </div>
          </>
        )}

        {/* Booking Form Modal */}
        {showBookingForm && selectedVendor && (
          <VendorBookingForm
            vendor={selectedVendor}
            isOpen={showBookingForm}
            onClose={() => {
              setShowBookingForm(false);
              setSelectedVendor(null);
            }}
          />
        )}

        {/* Ad before back button */}
        <div className="mt-8">
          <FeaturedAd />
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <Button onClick={handleBack} variant="outline" size="lg">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
