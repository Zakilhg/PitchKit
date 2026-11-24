import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => (
  <main className="container-page flex flex-col items-center py-24 text-center">
    <p className="font-mono text-sm text-muted-foreground">404</p>
    <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">This page is offside</h1>
    <p className="mt-4 max-w-md text-muted-foreground">
      The page you were looking for doesn&apos;t exist or has moved.
    </p>
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      <Button asChild size="lg">
        <Link to="/">Go to the homepage</Link>
      </Button>
      <Button asChild size="lg" variant="outline">
        <Link to="/shop">Shop jerseys</Link>
      </Button>
    </div>
  </main>
);

export default NotFound;
