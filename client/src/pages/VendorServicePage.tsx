import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Package, Settings } from "lucide-react";
import Navbar from "@/components/Navbar";
import VendorServiceForm from "@/components/VendorServiceForm";
import VendorServiceManager from "@/components/VendorServiceManager";
import { auth } from "@/lib/firebase";
import { useUserType } from "@/contexts/UserTypeContext";

export default function VendorServicePage() {
  const [activeTab, setActiveTab] = useState("add-service");
  const [user, setUser] = useState<any>(null);
  const { userType } = useUserType();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  // Get vendor display name
  const getVendorDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'Vendor';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Vendor Services</h1>
          <p className="text-gray-600">Manage your services and availability</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add-service" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Service
            </TabsTrigger>
            <TabsTrigger value="manage-services" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Manage Services
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add-service">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Add New Service
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VendorServiceForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage-services">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Manage Your Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VendorServiceManager 
                  vendorId={user?.uid || ''}
                  vendorName={getVendorDisplayName()}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
