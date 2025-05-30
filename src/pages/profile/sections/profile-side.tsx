import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, User } from "lucide-react";

const ProfileSide = ({ data }: { data: any }) => {
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-col items-center justify-center w-full">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={data?.avatarUrl} alt={data?.username} />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {data?.username
                  .split(" ")
                  .map((n: any) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-center">{data?.username}</CardTitle>
            <CardDescription className="text-center">
              Donor ID: {data?.donorProfile?.donorId}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 font-bold text-xl">
              {data?.bloodGroup?.name}
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Blood Type</div>
              <div className="text-lg font-semibold">
                {data?.bloodGroup?.name}
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-muted-foreground">
                Donation Status
              </span>
              {data?.donorProfile?.lastDonationDate &&
              new Date().getTime() -
                new Date(data?.donorProfile?.lastDonationDate).getTime() >
                90 * 24 * 60 * 60 * 1000 ? (
                <Badge variant="outline" className="bg-green-500 text-white">
                  Eligible
                </Badge>
              ) : (
                <Badge variant="outline">Waiting Period</Badge>
              )}
            </div>
            <div className="text-sm">
              {data?.donorProfile?.lastDonationDate
                ? new Date().getTime() -
                    new Date(data.donorProfile.lastDonationDate).getTime() >
                  90 * 24 * 60 * 60 * 1000
                  ? "Eligible for donation!"
                  : `Next eligible donation date: ${new Date(
                      new Date(data.donorProfile.lastDonationDate).getTime() +
                        90 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}`
                : "Eligible for donation!"}
            </div>
          </div>

          <div className="space-y-3">
            {/* <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{data?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{data?.phone}</span>
            </div> */}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{data?.location?.place_name}</span>
            </div>
            {/* <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                DOB: {formatDate(data?.dateOfBirth)}
              </span>
            </div> */}
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Donor since {formatDate(data?.donorProfile?.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSide;
