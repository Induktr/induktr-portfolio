import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "accent";
  text?: string;
}

export function Loader({ 
  className, 
  size = "md", 
  variant = "primary",
  text 
}: LoaderProps) {
  const sizeMap = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };

  const variants = {
    primary: "from-primary via-primary/50 to-transparent",
    secondary: "from-blue-500 via-blue-300 to-transparent",
    accent: "from-orange-500 via-orange-300 to-transparent"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div className={cn("relative", sizeMap[size])}>
        {/* Outer Glow */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={cn(
            "absolute inset-0 rounded-full blur-xl bg-gradient-to-tr",
            variants[variant]
          )}
        />
        
        {/* Spinning Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
          className={cn(
            "w-full h-full rounded-full border-2 border-t-transparent border-l-transparent bg-gradient-to-tr p-[2px]",
            variants[variant]
          )}
        >
          <div className="w-full h-full rounded-full bg-background" />
        </motion.div>

        {/* Inner Core */}
        <motion.div
           animate={{
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={cn(
            "absolute inset-0 m-auto w-1/3 h-1/3 rounded-full bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
          )}
        />
      </div>

      {text && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-mono font-bold tracking-[0.2em] text-muted-foreground uppercase pt-2"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

/**
 * DeferredRenderer helper component.
 * Purpose: Optimize browser rendering by delaying the mounting of heavy components
 * until the next animation frame, preventing main thread blocking during crucial paints.
 */
export function DeferredContent({ 
  children, 
  fallback,
  delay = 0 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
  delay?: number;
}) {
  const [shouldRender, setShouldRender] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      requestAnimationFrame(() => {
        setShouldRender(true);
      });
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [delay]);

  if (!shouldRender) return <>{fallback}</>;
  return <>{children}</>;
}
