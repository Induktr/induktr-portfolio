import { Card, CardContent } from "@/shared/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { Button } from "@/shared/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-primary/20 bg-card/50 backdrop-blur-xl">
        <CardContent className="pt-6 text-center">
          <div className="flex flex-col items-center mb-6">
            <div className="p-3 bg-red-500/10 rounded-full mb-4">
              <AlertCircle className="h-12 w-12 text-red-500 shadow-glow" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-red-400 to-primary">
              404 Page Not Found
            </h1>
          </div>

          <p className="text-muted-foreground mb-8">
            The page you are looking for might have been moved, deleted, or never existed.
          </p>

          <Button asChild className="w-full gap-2">
            <Link href="/">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
