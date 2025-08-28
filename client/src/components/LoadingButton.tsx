import { Button } from "@/components/ui/button";
import LoadingSpinner from "./LoadingSpinner";
import { cn } from "@/lib/utils";
import { ButtonProps } from "@/components/ui/button";

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export default function LoadingButton({ 
  loading = false, 
  loadingText = "Loading...",
  children, 
  className,
  disabled,
  ...props 
}: LoadingButtonProps) {
  return (
    <Button 
      className={cn(className)} 
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <LoadingSpinner size="sm" text="" />
          <span>{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
}
