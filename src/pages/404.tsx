import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import { Link } from "react-router-dom";

export default function Page404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="rounded-full bg-muted p-6 mb-6">
        <FileQuestion
          className="h-12 w-12 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page not found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Sorry, we couldn't find the page you're looking for. The page might have
        been moved, deleted, or never existed.
      </p>
      <Button asChild>
        <Link to="/">Return to home</Link>
      </Button>
    </div>
  );
}
