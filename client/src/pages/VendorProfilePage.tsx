import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { useUserType } from "@/contexts/UserTypeContext";
import { Link } from "wouter";
import { 
  User, 
  Edit, 
  Share2, 
  Check, 
  ShoppingCart,
  Calendar,
  Star,
  Package,
  Plus,
  Settings,
  Store,
  TrendingUp,
  Clock,
  DollarSign
} from "lucide-react";
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/LoadingSpinner";
import VendorServiceManager from "@/components/VendorServiceManager";
import InteractiveAvailabilityCalendar from "@/components/InteractiveAvailabilityCalendar";
import { 
  useUserProfile, 
  useVendorProfile, 
  useVendorStats, 
  useUpdateUserProfile,
  useUpdateVendorProfile 
} from "@/hooks/useProfileData";
import { FeaturedAd, HorizontalAd, SectionAd } from "@/components/AdComponent";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function VendorProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const { userType } = useUserType();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  // Fetch user profile data
  const { data: userProfile, isLoading: profileLoading } = useUserProfile(user?.uid || "");
  
  // Fetch vendor profile data
  const { data: vendorProfile, isLoading: vendorProfileLoading } = useVendorProfile(user?.uid || "");
  
  // Fetch vendor statistics
  const { data: vendorStats, isLoading: statsLoading } = useVendorStats(user?.uid || "");

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  // Update form when user profile loads
  useEffect(() => {
    if (userProfile) {
      form.reset({
        name: userProfile.name || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
      });
    } else if (user) {
      form.reset({
        name: user.displayName || "",
        email: user.email || "",
        phone: "",
      });
    }
  }, [userProfile, user, form]);

  const updateProfileMutation = useUpdateUserProfile();
  const updateVendorProfileMutation = useUpdateVendorProfile();

  const onSubmit = (data: ProfileFormData) => {
    if (!user?.uid) return;
    
    // Update user profile
    updateProfileMutation.mutate({
      userId: user.uid,
      updates: data
    }, {
      onSuccess: () => {
        toast({
          title: "Profile Updated!",
          description: "Your profile has been updated successfully.",
        });
        setIsEditing(false);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
        console.error("Profile update error:", error);
      }
    });

    // Also update vendor profile if it exists
    if (vendorProfile?.id) {
      updateVendorProfileMutation.mutate({
        vendorId: vendorProfile.id,
        updates: {
          name: data.name,
          email: data.email,
          phone: data.phone
        }
      }, {
        onSuccess: () => {
          console.log("Vendor profile updated successfully");
        },
        onError: (error) => {
          console.error("Vendor profile update error:", error);
        }
      });
    }
  };

  const handleShareProfile = async () => {
    const profileUrl = `${window.location.origin}/vendor/${vendorProfile?.id || user?.uid}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${vendorProfile?.businessname || user?.displayName || 'Vendor'}'s Profile`,
          text: `Check out ${vendorProfile?.businessname || 'this vendor'}'s services on Planora!`,
          url: profileUrl,
        });
      } else {
        await navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        toast({
          title: "Profile link copied!",
          description: "Share this link with potential customers",
        });
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing profile:', error);
      toast({
        title: "Error",
        description: "Failed to share profile",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view your profile</h2>
            <p className="text-gray-600">Please sign in to access your vendor profile settings.</p>
          </div>
        </div>
      </div>
    );
  }

  if (profileLoading || vendorProfileLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <LoadingSpinner size="lg" text="Loading vendor profile..." />
          </div>
        </div>
      </div>
    );
  }

  const displayName = vendorProfile?.businessname || userProfile?.name || user?.displayName || 'Vendor';
  const displayEmail = userProfile?.email || user?.email || '';
  const memberSince = userProfile?.createdAt 
    ? new Date(userProfile.createdAt.toDate()).toLocaleDateString() 
    : new Date(user.metadata?.creationTime || Date.now()).toLocaleDateString();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Profile</h1>
              <p className="text-gray-600">Manage your business profile and services</p>
            </div>
            <Button onClick={handleShareProfile} className="flex items-center gap-2">
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  Share Profile
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={vendorProfile?.image || userProfile?.image || user?.photoURL} />
                    <AvatarFallback className="text-2xl">
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{displayName}</h2>
                  
                  <Badge className="mb-3 bg-green-100 text-green-800">
                    Vendor
                  </Badge>
                  
                  <p className="text-gray-600 mb-1">{displayEmail}</p>
                  <p className="text-sm text-gray-500">Member since {memberSince}</p>
                  
                  {vendorProfile?.isVerified && (
                    <div className="flex items-center justify-center mt-3 text-green-600">
                      <Check className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">Verified Vendor</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Business Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">
                      {vendorStats?.totalServices || 0}
                    </div>
                    <p className="text-sm text-gray-600">Services</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">
                      {vendorStats?.totalOrders || 0}
                    </div>
                    <p className="text-sm text-gray-600">Orders</p>
                  </div>
                </div>
                
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">
                    ₹{vendorStats?.totalRevenue?.toLocaleString() || 0}
                  </div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{vendorStats?.averageRating?.toFixed(1) || 0}/5</span>
                  <span className="text-gray-600">({vendorStats?.reviewCount || 0})</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/manage-orders">
                  <Button variant="outline" className="w-full justify-start">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Manage Orders
                  </Button>
                </Link>
                <Link href="/post-service">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Post Service
                  </Button>
                </Link>
                <Link href="/messages">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Messages
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Overview
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShareProfile}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={userProfile?.photoURL || user?.photoURL} />
                    <AvatarFallback className="text-lg">
                      {userProfile?.name?.charAt(0) || user?.displayName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {userProfile?.name || user?.displayName || "User"}
                    </h2>
                    <p className="text-gray-600">{userProfile?.email || user?.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        <Check className="h-3 w-3 mr-1" />
                        Verified Vendor
                      </Badge>
                    </div>
                  </div>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} />
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
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} placeholder="Optional" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex items-end">
                        <div className="w-full">
                          <label className="text-sm font-medium text-gray-700">Member Since</label>
                          <p className="text-sm text-gray-600 mt-1">{memberSince}</p>
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex space-x-3 pt-4">
                        <Button
                          type="submit"
                          disabled={updateProfileMutation.isPending}
                        >
                          {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            form.reset();
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Ad after profile overview */}
            <div>
              <HorizontalAd />
            </div>

            {/* Business Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Business Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{vendorStats?.totalServices || 0}</div>
                    <p className="text-sm text-gray-600">Total Services</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{vendorStats?.totalOrders || 0}</div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">₹{vendorStats?.totalRevenue?.toLocaleString() || 0}</div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{vendorStats?.averageRating?.toFixed(1) || 0}</div>
                    <p className="text-sm text-gray-600">Rating</p>
                  </div>
                </div>

                {vendorStats?.serviceCategories && vendorStats.serviceCategories.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Service Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {vendorStats.serviceCategories.map((category: string) => (
                        <Badge key={category} variant="outline" className="bg-green-50">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ad after business performance */}
            <div>
              <SectionAd />
            </div>

            {/* Services Tab */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  My Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VendorServiceManager 
                  vendorId={user?.uid || ''} 
                  vendorName={displayName} 
                />
              </CardContent>
            </Card>

            {/* Ad after services */}
            <div>
              <FeaturedAd />
            </div>

            {/* Availability Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Availability Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <InteractiveAvailabilityCalendar
                  vendorId={user?.uid || ''}
                  vendorName={displayName}
                  isVendor={true}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Service
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Bookings
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  View Orders
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Store className="h-4 w-4 mr-2" />
                  Business Settings
                </Button>
              </CardContent>
            </Card>

            {/* Ad in sidebar */}
            <div>
              <FeaturedAd />
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">New booking received</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Service updated</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Payment received</p>
                      <p className="text-xs text-gray-500">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
