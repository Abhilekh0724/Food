import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import DonationHistory from "./sections/donaton-history";
import DonorSummary from "./sections/donor-summary";
import ProfileSide from "./sections/profile-side";

// Types
interface BloodDonation {
  id: string;
  date: string;
  location: string;
  amount: number; // in ml
  donationType: "whole blood" | "plasma" | "platelets" | "double red cells";
  notes?: string;
}

interface DonorInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  bloodType: string;
  rhFactor: "+" | "-";
  registrationDate: string;
  totalDonations: number;
  avatarUrl?: string;
  eligibleToDonateDays: number;
  lastHealthCheck: string;
  healthMetrics: {
    hemoglobin: number; // g/dL
    bloodPressure: string;
    pulse: number;
    weight: number; // kg
  };
}

// Sample data
const donorData: DonorInfo = {
  id: "BD-12345",
  name: "Michael Chen",
  email: "michael.chen@example.com",
  phone: "(555) 123-4567",
  address: "123 Main St, Anytown, CA 94321",
  dateOfBirth: "1985-06-15",
  bloodType: "O",
  rhFactor: "+",
  registrationDate: "2019-03-10",
  totalDonations: 12,
  eligibleToDonateDays: 0, // 0 means eligible now
  lastHealthCheck: "2023-11-15",
  healthMetrics: {
    hemoglobin: 14.2,
    bloodPressure: "120/80",
    pulse: 72,
    weight: 75,
  },
};

const donationHistory: BloodDonation[] = [
  {
    id: "DON-001",
    date: "2023-12-15",
    location: "Central Blood Bank",
    amount: 450,
    donationType: "whole blood",
  },
  {
    id: "DON-002",
    date: "2023-09-22",
    location: "Community Blood Drive - City Hall",
    amount: 450,
    donationType: "whole blood",
  },
  {
    id: "DON-003",
    date: "2023-06-05",
    location: "Central Blood Bank",
    amount: 650,
    donationType: "plasma",
    notes: "Double plasma donation",
  },
  {
    id: "DON-004",
    date: "2023-03-18",
    location: "Mobile Blood Drive - University",
    amount: 450,
    donationType: "whole blood",
  },
  {
    id: "DON-005",
    date: "2022-12-30",
    location: "Central Blood Bank",
    amount: 450,
    donationType: "whole blood",
  },
];

export default function BloodDonorProfile({ data }: any) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar with donor info */}
        <div className="w-full flex-1">
          <ProfileSide data={data} />
        </div>

        {/* Main content */}
        <div className="w-full flex-[2]">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="donations">Donation History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <DonorSummary
                donationHistory={donationHistory}
                donorData={data}
              />
            </TabsContent>

            <TabsContent value="donations" className="mt-4">
              <DonationHistory donationHistory={donationHistory} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
