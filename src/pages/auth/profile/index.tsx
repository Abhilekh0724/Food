import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import DistrictSelect from "./sections/districts";
import { PasswordForm } from "./sections/password-form";
import { ProfileForm } from "./sections/profile-form";

export default function ProfilePage() {

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
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your profile settings and change your password.
          </p>
        </div>
        <Separator />
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Personal Information
            </h2>
          </div>
          <ProfileForm />
        </div>
        <Separator />
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Your Working Districts
            </h2>
          </div>
          <DistrictSelect />
        </div>
        <Separator />

        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Password</h2>
            <p className="text-sm text-muted-foreground">
              Change your password to keep your account secure.
            </p>
          </div>
          <PasswordForm />
        </div>
      </div>
    </div>
  );
}
