import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useOrder } from "@/hooks/useFirebaseData";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  FileText,
  Phone,
  Mail,
  User,
  Clock,
  CheckCircle,
  Package,
  Truck,
  CreditCard,
  Star,
  MessageCircle
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";

const statusConfig = {
  pending: {
    label: "Order Placed",
    color: "bg-orange-500",
    icon: Package,
    description: "Your order has been placed successfully"
  },
  vendor_accepted: {
    label: "Vendor Accepted",
    color: "bg-blue-500",
    icon: CheckCircle,
    description: "A vendor has accepted your order"
  },
  payment_pending: {
    label: "Payment Pending",
    color: "bg-yellow-500",
    icon: CreditCard,
    description: "Please complete the payment to proceed"
  },
  in_progress: {
    label: "In Progress",
    color: "bg-purple-500",
    icon: Truck,
    description: "Your event is being prepared"
  },
  completed: {
    label: "Completed",
    color: "bg-green-500",
    icon: Star,
    description: "Your event has been completed successfully"
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-500",
    icon: Clock,
    description: "Order has been cancelled"
  }
};

export default function OrderTracking() {
  const [, setLocation] = useLocation();
  const [orderId, setOrderId] = useState<string>("");

  // Get order ID from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
      setOrderId(id);
    }
  }, []);

  const { data: order, isLoading, error } = useOrder(orderId);

  const handleBack = () => {
    setLocation("/orders");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <LoadingSpinner size="lg" text="Loading order details..." />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-500 mb-4">
                <FileText className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Order Not Found</h3>
                <p className="text-gray-600 mb-6">
                  The order you're looking for doesn't exist or has been removed.
                </p>
                <Button onClick={handleBack}>
                  Back to Orders
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const currentStatus = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Tracking
            </h1>
            <p className="text-lg text-gray-600">
              Track the progress of your order
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Order Summary</span>
              <Badge className={`${currentStatus.color} text-white`}>
                {currentStatus.label}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-semibold">{order.orderId}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Event Date</p>
                    <p className="font-semibold">{new Date(order.eventDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Event Location</p>
                    <p className="font-semibold">{order.eventLocation}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Guest Count</p>
                    <p className="font-semibold">{order.guestCount} guests</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Budget</p>
                    <p className="font-semibold">₹{order.budget.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-semibold">{order.customerName}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div>
              <h4 className="font-semibold mb-2">Event Description</h4>
              <p className="text-gray-600">{order.eventDescription}</p>
            </div>

            {/* Chat Button for Accepted Orders */}
            {order.status === "vendor_accepted" && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button 
                  onClick={() => setLocation(`/messages?vendor=${order.acceptedVendor}&orderId=${order.orderId}`)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat with Vendor
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Order Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              {/* Timeline Items */}
              <div className="space-y-8">
                {order.timeline?.map((item, index) => {
                  const isLast = index === order.timeline.length - 1;
                  const statusInfo = Object.values(statusConfig).find(s => 
                    s.label === item.status
                  ) || statusConfig.pending;
                  
                  return (
                    <div key={index} className="relative flex items-start">
                      {/* Timeline Dot */}
                      <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                        isLast ? currentStatus.color : 'bg-gray-300'
                      } text-white shadow-md`}>
                        {isLast ? (
                          <statusInfo.icon className="h-6 w-6" />
                        ) : (
                          <CheckCircle className="h-6 w-6" />
                        )}
                      </div>
                      
                      {/* Timeline Content */}
                      <div className="ml-6 flex-1">
                        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {item.status}
                            </h4>
                            <span className="text-sm text-gray-500">
                              {new Date(item.timestamp).toLocaleDateString()} | {new Date(item.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{order.email}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold">{order.phone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}
