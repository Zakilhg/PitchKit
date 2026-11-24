import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import PitchLoader from "@/components/PitchLoader";
import { ADMIN_URL } from "@/lib/api";

/**
 * /admin in the storefront. The admin panel is a separate Laravel app, so this
 * route hands over to it, or explains how to run it when this build has no
 * backend (the GitHub Pages demo).
 */
const AdminRedirect = () => {
  useEffect(() => {
    if (ADMIN_URL) window.location.replace(ADMIN_URL);
  }, []);

  if (ADMIN_URL) {
    return (
      <main className="grid min-h-[60vh] place-items-center">
        <div className="text-center">
          <PitchLoader label="Opening the admin" />
          <p className="mt-6 text-sm text-muted-foreground">
            Not moving?{" "}
            <a
              href={ADMIN_URL}
              className="font-medium text-foreground underline underline-offset-4"
            >
              Open the admin dashboard
            </a>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="container-page flex flex-col items-center py-20 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-muted">
        <Server className="size-5 text-muted-foreground" aria-hidden="true" />
      </span>
      <h1 className="mt-5 text-3xl font-semibold">The admin runs on the backend</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">
        This demo is a static build with no server, so the Laravel admin panel isn&apos;t available
        here. Run the project locally (or deploy the included Render blueprint) and open{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">/admin</code> on the API
        server.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <a href="https://github.com/Zakilhg/PitchKit#try-the-admin-panel-online">
            How to run it <ExternalLink aria-hidden="true" />
          </a>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/">Back to the store</Link>
        </Button>
      </div>
    </main>
  );
};

export default AdminRedirect;
