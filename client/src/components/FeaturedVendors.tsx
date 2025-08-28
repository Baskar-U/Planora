import { useVendors } from "@/hooks/useFirebaseData";
import VendorCard from "./VendorCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import LoadingSpinner from "./LoadingSpinner";

export default function FeaturedVendors() {
  const { data: vendors = [], isLoading, error } = useVendors();

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Vendors</h2>
            <p className="text-xl text-gray-600">Top-rated vendors in your area</p>
          </div>
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading featured vendors..." />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Vendors</h2>
            <p className="text-xl text-gray-600 mb-8">Unable to load vendors at the moment</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Vendors
          </h2>
          <p className="text-xl text-gray-600">
            Top-rated vendors in your area
          </p>
        </div>

        {vendors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No vendors found</p>
            <p className="text-gray-500">Be the first to add your business!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {vendors.slice(0, 8).map((vendor, index) => (
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
