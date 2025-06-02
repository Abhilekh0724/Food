import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import DistrictSelect from "./sections/districts";
import { ProfileForm } from "./sections/profile-form";

export default function OrganizerSettingsPage() {

  return (
    <div className="relative">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>
      <div className="mt-4 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organization Profile</h1>
          <p className="text-muted-foreground">
            Manage your organization profile.
          </p>
        </div>
        <Separator />
        <ProfileForm />
        <Separator />
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Your Working Districts
            </h2>
          </div>
          <DistrictSelect />
        </div>
      </div>
    </div>
  );
}
