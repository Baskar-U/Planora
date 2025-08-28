import { useState } from "react";
import { useLocation } from "wouter";

export function useNavigationWithLoading() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const navigateWithLoading = (path: string) => {
    setIsLoading(true);
    
    // Simulate a small delay for better UX
    setTimeout(() => {
      setLocation(path);
      // Scroll to top after navigation
      window.scrollTo(0, 0);
      setIsLoading(false);
    }, 500);
  };

  return { navigateWithLoading, isLoading };
}
