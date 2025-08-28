import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { UserTypeProvider } from "@/contexts/UserTypeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { useNavigationLoading } from "@/hooks/useNavigationLoading";
import { ToastContainer, useToast } from "@/components/FeedbackToast";
import { memo } from "react";

import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import Orders from "@/pages/Orders";
import PostOrder from "@/pages/PostOrder";
import OrderForm from "@/pages/OrderForm";
import OrderTracking from "@/pages/OrderTracking";
import VendorRequests from "@/pages/VendorRequests";
import Messages from "@/pages/Messages";
import Profile from "@/pages/Profile";
import Cart from "@/pages/Cart";
import VendorProfile from "@/pages/VendorProfile";
import Vendors from "@/pages/Vendors";
import Services from "@/pages/Services";
import VendorServicePage from "@/pages/VendorServicePage";
import CustomerOrdersPage from "@/pages/CustomerOrdersPage";
import Demo from "@/pages/Demo";


function Router() {
  useNavigationLoading();
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      
      {/* Public Pages */}
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      
      {/* Application Routes - All Public for Google AdSense */}
      <Route path="/orders" component={Orders} />
      <Route path="/post-order" component={PostOrder} />
      <Route path="/order/:eventType" component={OrderForm} />
      <Route path="/order-tracking" component={OrderTracking} />
      <Route path="/vendor-requests" component={VendorRequests} />
      <Route path="/messages" component={Messages} />
      <Route path="/profile" component={Profile} />
      <Route path="/cart" component={Cart} />
      <Route path="/vendor-services" component={VendorServicePage} />
      <Route path="/my-orders" component={CustomerOrdersPage} />
      <Route path="/vendors" component={Vendors} />
      <Route path="/vendor/:id" component={VendorProfile} />
      <Route path="/services" component={Services} />
      <Route path="/demo" component={Demo} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserTypeProvider>
          <LoadingProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
              <AppContent />
            </TooltipProvider>
          </LoadingProvider>
        </UserTypeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AppContent() {
  const { toasts, dismissToast } = useToast();

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}

export default App;
