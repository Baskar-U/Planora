import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Menu, User, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const [location] = useLocation();
  const { user, signOut } = useAuth();

  const { data: cartItems = [] } = useQuery({
    queryKey: ["/api/cart", user?.uid],
    enabled: !!user,
  });

  const cartCount = Array.isArray(cartItems) ? cartItems.length : 0;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };



  // Simplified navigation items for Google AdSense approval
  const navigationItems = [
    { path: "/", label: "Home" },
    { path: "/vendors", label: "Browse Vendors" },
    { path: "/about", label: "About Us" },
    { path: "/contact", label: "Contact Us" },
  ];

  return (
    <>
      <header className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50 transition-shadow duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <div className="flex items-end">
                  <img 
                    src="/logo.jpg" 
                    alt="Planora Logo" 
                    className="h-8 sm:h-10 w-auto object-contain"
                  />
                  <h1 className="text-xl sm:text-2xl font-bold text-primary-600 ml-2 mb-1">Planora</h1>
                </div>
              </Link>
            </div>

            {/* Right side: Navigation + User Actions */}
            <div className="flex items-center space-x-6">
              {/* Navigation Items */}
              <div className="hidden md:flex items-center space-x-6">
                {navigationItems.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <span className={`text-gray-700 hover:text-primary-600 transition-colors ${
                      location === item.path ? 'text-primary-600 font-medium' : ''
                    }`}>
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>



              {/* User Actions */}
              <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Cart - Only show for logged-in users */}
              {user && (
                <Link href="/cart">
                  <Button variant="ghost" size="sm" className="relative tap-target">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )}

              {/* User Profile or Auth */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full tap-target">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.photoURL} alt={user.displayName} />
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col space-y-4 mt-8">
                    {navigationItems.map((item) => (
                      <Link key={item.path} href={item.path}>
                        <span className="text-gray-900 hover:text-primary-600 transition-colors block py-2">
                          {item.label}
                        </span>
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>

    </>
  );
}
