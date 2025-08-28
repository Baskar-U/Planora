import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PopularCities from "@/components/PopularCities";
import IndividualServices from "@/components/IndividualServices";
import Categories from "@/components/Categories";
import FeaturedVendors from "@/components/FeaturedVendors";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import OnboardingModal from "@/components/OnboardingModal";
import { useUserType } from "@/contexts/UserTypeContext";
import { useAuth } from "@/contexts/AuthContext";
import { FeaturedAd, HorizontalAd, SectionAd } from "@/components/AdComponent";

export default function Home() {
  const [location] = useLocation();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const { user } = useAuth();
  const { userType } = useUserType();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle authentication redirects from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authParam = urlParams.get('auth');
    
    if (authParam === 'login' || authParam === 'signup') {
      setAuthModalOpen(true);
    }
  }, [location]);

  const handleGetStarted = () => {
    if (user) {
      setOnboardingOpen(true);
    } else {
      setAuthModalOpen(true);
    }
  };

    return (
    <div className="bg-white">
      <Navbar />
      <div>
        <HeroSection onGetStarted={handleGetStarted} />
      </div>
      
      {/* Ad after hero section */}
      <div className="container mx-auto px-4">
        <FeaturedAd />
      </div>
      
      <div className="py-8 bg-gray-50">
        <PopularCities />
      </div>
      
      {/* Ad between sections */}
      <SectionAd />
      
      <div className="py-8 bg-white">
        <IndividualServices />
      </div>
      
      {/* Ad between sections */}
      <div className="container mx-auto px-4">
        <HorizontalAd />
      </div>
      
      <div className="py-8 bg-gray-50">
        <Categories />
      </div>
      
      {/* Ad between sections */}
      <SectionAd />
      
      <div className="py-8 bg-gray-50">
        <FeaturedVendors />
      </div>
      
      {/* Ad before footer */}
      <div className="container mx-auto px-4">
        <FeaturedAd />
      </div>
      
      <Footer />
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <OnboardingModal 
        open={onboardingOpen} 
        onOpenChange={setOnboardingOpen} 
        userType={userType}
      />
    </div>
  );
}
