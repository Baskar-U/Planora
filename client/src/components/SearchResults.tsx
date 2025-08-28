import { useVendors } from "@/hooks/useFirebaseData";
import VendorCard from "./VendorCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import LoadingSpinner from "./LoadingSpinner";
import { Search, MapPin, Filter, Users, Package, Briefcase, Star, Grid, List, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchResultsProps {
  searchParams: {
    search?: string;
    city?: string;
  };
}

export default function SearchResults({ searchParams }: SearchResultsProps) {
  console.log('SearchResults Component - searchParams:', searchParams);
  const { data: allVendors = [], isLoading, error } = useVendors();
  
  console.log('SearchResults Component - allVendors:', allVendors);
  console.log('SearchResults Component - isLoading:', isLoading);
  console.log('SearchResults Component - error:', error);

  // Filter vendors based on search parameters
  const filteredVendors = allVendors.filter((vendor) => {
    const matchesSearch = !searchParams.search || 
      vendor.eventname?.toLowerCase().includes(searchParams.search.toLowerCase()) ||
      vendor.description?.toLowerCase().includes(searchParams.search.toLowerCase()) ||
      vendor.menu?.some((item: string) => 
        item.toLowerCase().includes(searchParams.search.toLowerCase())
      );

    const matchesCity = !searchParams.city || 
      vendor.location?.toLowerCase().includes(searchParams.city.toLowerCase());

    const matches = matchesSearch && matchesCity;
    
    // Debug logging for search filtering (commented out to reduce console spam)
    // if (searchParams.search) {
    //   console.log(`🔍 Vendor ${vendor.id} (${vendor.eventname}):`, {
    //     eventname: vendor.eventname?.toLowerCase(),
    //     description: vendor.description?.toLowerCase().substring(0, 50) + '...',
    //     searchTerm: searchParams.search.toLowerCase(),
    //     matchesEventName: vendor.eventname?.toLowerCase().includes(searchParams.search.toLowerCase()),
    //     matchesDescription: vendor.description?.toLowerCase().includes(searchParams.search.toLowerCase()),
    //     matchesMenu: vendor.menu?.some((item) => item.toLowerCase().includes(searchParams.search.toLowerCase())),
    //     matchesSearch,
    //     matchesCity,
    //     finalMatch: matches
    //   });
    // }

    return matches;
  });

  // Debug logging (commented out to reduce console spam)
  // console.log('🔍 SearchResults - Filtered vendors:', filteredVendors.length);
  // console.log('🔍 SearchResults - All vendors count:', allVendors.length);
  // console.log('🔍 SearchResults - Search params:', searchParams);

  // Calculate statistics
  const stats = {
    totalVendors: allVendors.length,
    totalServices: allVendors.reduce((sum, vendor) => sum + (vendor.menu?.length || 0), 0),
    avgExperience: allVendors.length > 0 
      ? Math.round((allVendors.reduce((sum, vendor) => sum + (parseInt(String(vendor.exprience)) || 0), 0) / allVendors.length) * 10) / 10
      : 0,
    avgRating: allVendors.length > 0
      ? Math.round((allVendors.reduce((sum, vendor) => sum + (vendor.rating || 0), 0) / allVendors.length) * 10) / 10
      : 0
  };

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

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Searching vendors..." />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Search Results</h2>
            <p className="text-gray-600 mb-8">Unable to load search results at the moment</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white border-b mb-6">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {searchParams.search ? `${searchParams.search} Vendors` : "Search Results"}
            </h1>
            <p className="text-lg text-gray-600">
              {searchParams.search 
                ? `Discover amazing ${searchParams.search.toLowerCase()} vendors for your perfect event`
                : "Discover amazing vendors for your perfect event"
              }
            </p>
            <div className="mt-2">
              <Badge className={`${getCategoryColor(searchParams.search || '')} text-base px-3 py-1`}>
                {filteredVendors.length} {filteredVendors.length === 1 ? 'vendor' : 'vendors'} found
              </Badge>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Total Vendors</p>
                    <p className="text-xl font-bold text-gray-900">{stats.totalVendors}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Package className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Total Services</p>
                    <p className="text-xl font-bold text-gray-900">{stats.totalServices}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Briefcase className="h-8 w-8 text-orange-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Avg Experience</p>
                    <p className="text-xl font-bold text-gray-900">{stats.avgExperience} years</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Star className="h-8 w-8 text-yellow-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Avg Rating</p>
                    <p className="text-xl font-bold text-gray-900">{stats.avgRating}/5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-gray-600">
                {searchParams.search && (
                  <div className="flex items-center">
                    <Search className="h-4 w-4 mr-2" />
                    <span>"{searchParams.search}"</span>
                  </div>
                )}
                {searchParams.city && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{searchParams.city}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/">
                    Clear Search
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/vendors">
                    View All Vendors
                  </Link>
                </Button>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Showing {filteredVendors.length} vendors {searchParams.search ? `in ${searchParams.search}` : ''} {searchParams.city ? `from ${searchParams.city}` : ''} ({stats.totalVendors} total in database)
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredVendors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <Search className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No vendors found</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchParams.search || searchParams.city 
                ? `No vendors found matching your search criteria. Try adjusting your search terms or location.`
                : "No vendors available at the moment."
              }
            </p>
            <div className="space-x-4">
              <Button variant="outline" asChild>
                <Link href="/">
                  Browse All Vendors
                </Link>
              </Button>
              <Button asChild>
                <Link href="/vendors">
                  View All Vendors
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredVendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild size="lg" className="px-8 py-3 text-lg">
                <Link href="/vendors">
                  View All Vendors
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
