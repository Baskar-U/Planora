import { useParams } from "wouter";
import { useVendor, useServicesByVendor } from "@/hooks/useFirebaseData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star, MapPin, Phone, Clock, User, CheckCircle, ArrowLeft, Calendar, Briefcase, Package, Filter } from "lucide-react";
import { Link, useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useEffect, useState } from "react";
import CollectionsGallery from "@/components/CollectionsGallery";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import VendorBookingForm from "@/components/VendorBookingForm";
import VendorServiceManager from "@/components/VendorServiceManager";
import { useUserType } from "@/contexts/UserTypeContext";
import { auth } from "@/lib/firebase";
import { FeaturedAd, HorizontalAd, SectionAd } from "@/components/AdComponent";

export default function VendorProfile() {
  const { id } = useParams();
  const { data: vendor, isLoading, error } = useVendor(id || "");
  const { data: vendorServices = [], isLoading: servicesLoading } = useServicesByVendor(id || "");
  const [, setLocation] = useLocation();
  const { userType } = useUserType();
  const [selectedServiceCategory, setSelectedServiceCategory] = useState("All");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get current user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);



  // Debug: Log vendor data when it loads
  useEffect(() => {
    if (vendor) {
      console.log('VendorProfile - Full vendor data:', vendor);
      console.log('VendorProfile - businessname:', vendor.businessname);
      console.log('VendorProfile - name:', vendor.name);
      console.log('VendorProfile - All vendor keys:', Object.keys(vendor));
    }
  }, [vendor]);

  // Debug: Log services data
  useEffect(() => {
    if (vendorServices.length > 0) {
      console.log('VendorProfile - Services data:', vendorServices);
      console.log('VendorProfile - Number of services:', vendorServices.length);
    }
  }, [vendorServices]);

  // Handle back navigation
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation("/");
    }
  };

  



  // Handle booking cancellation
  const handleBookingCancel = () => {
    setShowBookingForm(false);
  };

  // Filter services by category
  const filteredServices = selectedServiceCategory === "All" 
    ? vendorServices 
    : vendorServices.filter(service => service.category === selectedServiceCategory);

  // Get unique service categories for filtering
  const serviceCategories = ["All", ...Array.from(new Set(vendorServices.map(service => service.category)))];

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

  // Helper function to get business name with fallbacks
  const getBusinessName = (vendor: any) => {
    return vendor.businessname || 
           vendor.business_name || 
           vendor.companyName || 
           vendor.company_name || 
           vendor.name || 
           'Business name not available';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <LoadingSpinner size="lg" text="Loading vendor profile..." />
          </div>
        </div>
               <Footer />
     </div>
   );
 }

  // Show booking form overlay if active
  if (showBookingForm && vendor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button variant="outline" onClick={handleBookingCancel} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Vendor Profile
            </Button>
          </div>
          <VendorBookingForm
            vendor={{
              id: vendor.vendorid || vendor.id || '',
              name: vendor.name || '',
              businessname: getBusinessName(vendor),
              eventname: vendor.eventname || '',
              description: vendor.description || '',
              location: vendor.location || '',
              price: 0,
              priceUnit: 'fixed'
            }}
            isOpen={showBookingForm}
            onClose={handleBookingCancel}
          />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Vendor Not Found</h1>
            <p className="text-gray-600 mb-8">The vendor you're looking for doesn't exist or has been removed.</p>
            <Button onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      
      {/* Go Back Button - Top Left */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Button 
          variant="outline" 
          onClick={handleBack}
          className="mb-4 hover:bg-gray-100 hover:border-gray-400 transition-all duration-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
      
      {/* Enhanced Hero Section */}
      <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white space-y-3 sm:space-y-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Badge className={`${getCategoryColor(vendor?.eventname || '')} bg-white/20 backdrop-blur-sm border-white/30 text-white text-xs sm:text-sm`}>
                {vendor?.eventname || 'Vendor'}
              </Badge>
              {vendor?.isVerified && (
                <div className="flex items-center gap-1 bg-green-500/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full border border-green-400/30">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-300" />
                  <span className="text-xs sm:text-sm font-medium text-green-100">Verified</span>
                </div>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 leading-tight">
              {getBusinessName(vendor || {})}
            </h1>
            <p className="text-lg sm:text-xl opacity-95 font-medium">
              {vendor?.name || 'Vendor Name'}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm opacity-90">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{vendor?.location || 'Location'}</span>
              </div>
              {/* <div className="flex items-center gap-1">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                <span>4.8/5</span>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - 3 columns */}
          <div className="lg:col-span-3 space-y-8">
            {/* Vendor Details Section */}
            <Card>
              <CardHeader className="pb-3">
                <h2 className="text-xl font-bold text-gray-900">Vendor Details</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {/* Owner */}
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 mr-2 sm:mr-3" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Owner</p>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">{vendor?.name || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-semibold text-gray-900">{vendor?.location || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Posting Date
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Posted</p>
                      <p className="font-semibold text-gray-900">
                        {vendor?.createdAt ? new Date(vendor.createdAt.toDate()).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: '2-digit'
                        }).toUpperCase() : 'N/A'}
                      </p>
                    </div>
                  </div> */}

                  {/* Mobile */}
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Mobile</p>
                      <p className="font-semibold text-gray-900">{vendor?.mobilenumber || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Working Hours</p>
                      <p className="font-semibold text-gray-900">{vendor?.hours || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Briefcase className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Experience</p>
                      <p className="font-semibold text-gray-900">{vendor?.exprience || 0} years</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ad after vendor details
            <div>
              <HorizontalAd />
            </div> */}

            {/* Gallery Section */}
            {/* {vendor?.image && (
              <Card>
                <CardHeader className="pb-3">
                  <h2 className="text-xl font-bold text-gray-900">Gallery</h2>
                </CardHeader>
                <CardContent>
                  <CollectionsGallery vendorId={vendor.id || ''} />
                </CardContent>
              </Card>
            )} */}

            {/* Ad after gallery */}
            {vendor?.image && (
              <div>
                <FeaturedAd />
              </div>
            )}

            {/* About Section */}
            <Card>
              <CardHeader className="pb-3">
                <h2 className="text-xl font-bold text-gray-900">About</h2>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {vendor?.description || 'No description available.'}
                </p>
              </CardContent>
            </Card>

            {/* Services/Menu Section */}
            {vendor?.menu && vendor.menu.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <h2 className="text-xl font-bold text-gray-900">Services & Menu</h2>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {vendor?.menu?.map((item, index) => {
                      // Check if the item is a Firebase storage URL (contains firebasestorage.googleapis.com)
                      const isImageUrl = item.includes('firebasestorage.googleapis.com') || 
                                       item.includes('http') && (item.includes('.jpg') || item.includes('.jpeg') || item.includes('.png') || item.includes('.webp'));
                      
                      if (isImageUrl) {
                        return (
                          <div key={index} className="relative group">
                            <img
                              src={item}
                              alt={`Menu item ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg border border-gray-200 group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                // Fallback to text display if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallbackDiv = document.createElement('div');
                                fallbackDiv.className = 'w-full h-48 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center p-4';
                                fallbackDiv.innerHTML = `
                                  <div class="text-center">
                                    <div class="w-2 h-2 bg-primary-500 rounded-full mx-auto mb-2"></div>
                                    <span class="text-gray-700 text-sm">${item}</span>
                                  </div>
                                `;
                                target.parentNode?.appendChild(fallbackDiv);
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Badge className="bg-white text-gray-900">
                                  Menu Item {index + 1}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        );
                      } else {
                        // Display as text item in a card format
                        return (
                          <div key={index} className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                              <div className="flex-1 min-w-0">
                                <p className="text-gray-700 text-sm font-medium line-clamp-3">
                                  {item}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Service {index + 1}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Collections Section */}
            <Card>
              <CardHeader className="pb-3">
                <h2 className="text-xl font-bold text-gray-900">Collections</h2>
                <p className="text-sm text-gray-600">Shop photos and portfolio</p>
              </CardHeader>
              <CardContent>
                <CollectionsGallery vendorId={vendor?.vendorid || ''} />
              </CardContent>
            </Card>

                         {/* Service Management Section - Only for vendors viewing their own profile */}
             {userType === 'vendor' && currentUser?.uid === vendor?.id && (
               <Card>
                 <CardHeader className="pb-3">
                   <h2 className="text-xl font-bold text-gray-900">Manage Services</h2>
                   <p className="text-sm text-gray-600">Add, edit, and manage your service offerings</p>
                 </CardHeader>
                 <CardContent>
                   <VendorServiceManager 
                     vendorId={vendor?.vendorid || vendor?.id || ''} 
                     vendorName={getBusinessName(vendor || {})} 
                   />
                 </CardContent>
               </Card>
             )}



             {/* Additional vendor management features can be added here */}
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Vendor Image */}
            <Card className="overflow-hidden shadow-lg">
              <CardContent className="p-0">
                <div className="relative group">
                  <img
                    src={vendor?.image || "/placeholder-vendor.jpg"}
                    alt={getBusinessName(vendor || {})}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="font-semibold text-lg">{getBusinessName(vendor || {})}</p>
                      <p className="text-sm opacity-90">{vendor?.eventname}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Info */}
            <Card>
              <CardHeader className="pb-3">
                <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Business Name</p>
                  <p className="font-semibold text-gray-900">
                    {getBusinessName(vendor || {})}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <Badge className={getCategoryColor(vendor?.eventname || '')}>
                    {vendor?.eventname || 'N/A'}
                  </Badge>
                </div>
                
                {vendor?.isVerified && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Verified Vendor</span>
                  </div>
                )}
              </CardContent>
            </Card>


          </div>
        </div>

        {/* Ad before back button */}
        <div className="mt-8">
          <FeaturedAd />
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <Button onClick={handleBack} variant="outline" size="lg">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <VendorBookingForm
          vendor={{
            id: vendor.vendorid || vendor.id || '',
            name: vendor.name || '',
            businessname: getBusinessName(vendor),
            eventname: vendor.eventname || '',
            description: vendor.description || '',
            location: vendor.location || '',
            price: 0,
            priceUnit: 'fixed'
          }}
          isOpen={showBookingForm}
          onClose={handleBookingCancel}
        />
      )}

      <Footer />
    </div>
  );
}
