import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Mail, CheckCircle, Package, Briefcase, Clock } from "lucide-react";
import { Link } from "wouter";
import { type Vendor } from "@/lib/firebaseService";

interface VendorCardProps {
  vendor: Vendor;
  showDetails?: boolean;
}

export default function VendorCard({ vendor, showDetails = false }: VendorCardProps) {
  
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
  const getBusinessName = (vendor: Vendor) => {
    return vendor.businessname || 
           vendor.business_name || 
           vendor.companyName || 
           vendor.company_name || 
           vendor.name || 
           'Business name not available';
  };

  return (
    <>
      <Card className="group cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden border-0 shadow-md">
      <div className="relative overflow-hidden">
        <img
          src={vendor.image || "/placeholder-vendor.jpg"}
          alt={getBusinessName(vendor)}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {vendor.isVerified && (
          <div className="absolute top-4 right-4">
            <CheckCircle className="h-6 w-6 text-green-500 bg-white rounded-full shadow-md" />
          </div>
        )}
        {/* Category badge overlay */}
        <div className="absolute top-4 left-4">
          <Badge className={`${getCategoryColor(vendor.eventname)} shadow-md`}>
            {vendor.eventname}
          </Badge>
        </div>
        {/* Experience badge overlay */}
        <div className="absolute bottom-4 left-4">
          <Badge className="bg-black bg-opacity-70 text-white shadow-md">
            <Briefcase className="h-3 w-3 mr-1" />
            {vendor.exprience || vendor.experience || '0'} years
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-3 pt-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
          {getBusinessName(vendor)}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-1">{vendor.name}</p>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{vendor.description}</p>
        
        {/* Quick info row */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">{vendor.location}</span>
          </div>
        </div>

        {showDetails && (
          <div className="space-y-3 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2 text-gray-400" />
              <span>{vendor.mobilenumber}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2 text-gray-400" />
              <span>{vendor.hours}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
              <span>{vendor.exprience || vendor.experience || '0'} years experience</span>
            </div>
            {vendor.rating && vendor.rating > 0 && (
              <div className="flex items-center text-sm text-gray-600">
                <Star className="h-4 w-4 mr-2 text-yellow-400 fill-yellow-400" />
                <span>{vendor.rating.toFixed(1)} rating</span>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button asChild className="w-full text-sm">
            <Link href={`/vendor/${vendor.id}`}>
              View Profile
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>

  </>
  );
}

