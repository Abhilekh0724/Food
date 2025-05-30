import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DonorSummary = ({
  donorData,
  donationHistory,
}: {
  donorData: any;
  donationHistory: any;
}) => {
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate total blood donated in liters
  const totalBloodDonated =
    donationHistory?.reduce(
      (total: number, donation: any) => total + donation.amount,
      0
    ) / 1000;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Donor Summary</CardTitle>
        <CardDescription>
          Overview of {donorData?.username}'s donation activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">
              Total Donations
            </div>
            <div className="text-2xl font-bold">
              {donorData?.totalDonations}
            </div>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">
              Blood Donated
            </div>
            <div className="text-2xl font-bold">
              {totalBloodDonated?.toFixed(1)} Pints
            </div>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">
              Last Donation
            </div>
            <div className="text-lg font-bold">
              {formatDate(donorData?.donorProfile?.lastDonationDate)}
            </div>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">
              Next Eligible Date
            </div>
            {donorData?.donorProfile?.lastDonationDate
              ? new Date().getTime() -
                  new Date(donorData.donorProfile.lastDonationDate).getTime() >
                90 * 24 * 60 * 60 * 1000
                ? "Eligible for donation!"
                : `Next eligible donation date: ${new Date(
                    new Date(
                      donorData.donorProfile.lastDonationDate
                    ).getTime() +
                      90 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}`
              : "Eligible for donation!"}{" "}
            {donorData?.eligibleToDonateDays <= 0 && (
              <Button size="sm" className="mt-2 bg-red-500 hover:bg-red-600">
                Send Notification
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonorSummary;
