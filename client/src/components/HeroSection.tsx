import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useLocation } from "wouter";
import { auth } from "@/lib/firebase";


interface HeroSectionProps {
  onGetStarted: () => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const cities = ["Chennai", "Madurai", "Kanchi", "Thanjavur", "Coimbatore", "Tirunelveli", "Trichy", "Hosur", "Kodaikanal", "Thoothukudi"];
  
  const services = [
    "Wedding Planning",
    "Catering",
    "Photography",
    "Decoration",
    "Music & Entertainment",
    "Venue Booking",
    "Transportation",
    "Beauty & Makeup",
    "Event Management",
    "Corporate Events",
    "Birthday Parties",
    "Anniversary Celebrations"
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCity) params.set("city", selectedCity);
    
    const vendorsUrl = `/vendors?${params.toString()}`;
    
    // Redirect to vendors page with search parameters
    window.location.href = vendorsUrl;
  };

  return (
    <section className="relative bg-gradient-to-r from-primary-600 via-blue-600 to-primary-700 text-white min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600&q=80')"
        }}
        role="img"
        aria-label="Event planning background with people celebrating"
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 flex flex-col justify-center min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
        <div className="text-center w-full">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            Plan Your Events <span className="text-yellow-300">Perfectly</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-4 sm:mb-6 text-yellow-200 font-semibold max-w-4xl mx-auto px-4 leading-relaxed">
            The #1 Event Planning Platform - Connect with 500+ Verified Vendors
          </p>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-gray-100 max-w-5xl mx-auto px-4 leading-relaxed">
            From weddings to corporate events, find the perfect vendors, compare prices, and book everything in one place. 
            <span className="font-semibold text-yellow-200"> Trusted by 10,000+ event planners.</span>
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mb-6 px-4">
            <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1">
                  <Select value={searchQuery} onValueChange={setSearchQuery}>
                    <SelectTrigger className="h-12 sm:h-14 text-base sm:text-lg bg-white text-gray-900 border-gray-300 focus:border-primary-500 focus:ring-primary-500 tap-target">
                      <SelectValue placeholder="Search for services..." className="text-gray-500" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="h-12 sm:h-14 text-base sm:text-lg bg-white text-gray-900 border-gray-300 focus:border-primary-500 focus:ring-primary-500 tap-target">
                      <SelectValue placeholder="Select City" className="text-gray-500" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleSearch}
                  className="btn-primary h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold tap-target w-full sm:w-auto"
                >
                  <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
