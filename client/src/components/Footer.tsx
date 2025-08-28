import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "wouter";
import { useNavigationWithLoading } from "@/hooks/useNavigationWithLoading";
import LoadingSpinner from "./LoadingSpinner";

export default function Footer() {
  const { navigateWithLoading, isLoading } = useNavigationWithLoading();
  return (
    <>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <LoadingSpinner size="lg" text="Navigating..." />
          </div>
        </div>
      )}
      
      <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="col-span-1 sm:col-span-2">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Planora</h3>
            <p className="text-gray-300 mb-4 sm:mb-6 max-w-md text-sm sm:text-base">
              Your trusted partner for perfect event planning. We connect you with the best vendors and services to make your special occasions unforgettable.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/planora_app?igsh=aXNvMm1ybnp5ZHYw" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/in/planora-events-817932380" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => navigateWithLoading('/about')}
                  disabled={isLoading}
                  className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateWithLoading('/vendors')}
                  disabled={isLoading}
                  className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Browse Vendors
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateWithLoading('/contact')}
                  disabled={isLoading}
                  className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => navigateWithLoading('/contact')}
                  disabled={isLoading}
                  className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateWithLoading('/privacy-policy')}
                  disabled={isLoading}
                  className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateWithLoading('/terms-of-service')}
                  disabled={isLoading}
                  className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center">
          <p className="text-gray-400 text-sm sm:text-base">© 2024 Planora. All rights reserved.</p>
        </div>
      </div>
    </footer>
    </>
  );
}
