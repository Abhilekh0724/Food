import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DonationHistory = ({ donationHistory }: { donationHistory: any }) => {
  // Get donation type badge color
  const getDonationTypeBadge = (type: string) => {
    switch (type) {
      case "whole blood":
        return <Badge className="bg-red-500">Whole Blood</Badge>;
      case "plasma":
        return <Badge className="bg-amber-500">Plasma</Badge>;
      case "platelets":
        return <Badge className="bg-blue-500">Platelets</Badge>;
      case "double red cells":
        return <Badge className="bg-purple-500">Double Red Cells</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Donation History</CardTitle>
          <CardDescription>
            Complete record of all blood donations
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Donation ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donationHistory.map((donation: any) => (
              <TableRow key={donation.id}>
                <TableCell>{formatDate(donation.date)}</TableCell>
                <TableCell className="font-mono text-xs">
                  {donation.id}
                </TableCell>
                <TableCell>
                  {getDonationTypeBadge(donation.donationType)}
                </TableCell>
                <TableCell>{donation.location}</TableCell>
                <TableCell className="text-right">
                  {donation.amount} pints
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DonationHistory;
