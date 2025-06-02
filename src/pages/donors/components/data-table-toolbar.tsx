import { Button } from "@/components/ui/button";
import { BulkFileUpload } from "@/components/upload/BulkFileUpload";
import { useSelector } from "@/store/store";
import { exportToCsv, printPDF } from "@/util/exports-util";
import { Table } from "@tanstack/react-table";
import { Download, Printer, Upload, X } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

// Enum for backend column keys
export enum DonorColumns {
  FIRST_NAME = "firstName",
  LAST_NAME = "lastName",
  EMAIL = "email",
  PHONE = "phone",
  GENDER = "gender",
  BLOOD_GROUP = "bloodGroup",
  OCCUPATION = "occupation",
  DOB = "dob",
  CURRENT_COUNTRY = "currCountry",
  CURRENT_DISTRICT = "currDistrict",
  CURRENT_CITY = "currCity",
  CURRENT_MUNICIPALITY = "currMunicipality",
  CURRENT_ZIPCODE = "currZipcode",
  CURRENT_STREET = "currStreetAddress",
  CURRENT_WARDNO = "currWardNo",
  PERMANENT_COUNTRY = "permCountry",
  PERMANENT_DISTRICT = "permDistrict",
  PERMANENT_MUNICIPALITY = "permMunicipality",
  PERMANENT_ZIPCODE = "permZipcode",
  PERMANENT_STREET = "permStreetAddress",
  PERMANENT_WARDNO = "permWardNo",
  PERMANENT_CITY = "permCity",
  WEIGHT = "weight",
  HEIGHT = "height",
  LAST_DONATED_DATE = "lastDonatedDate",
  EVER_RECEIVED_BLOOD = "everReceivedBlood",
  DONTAED_BLOOD_BEFORE = "donatedBloodBefore",
  VICTIM_OF_ANY_DISEASES = "victimOfAnyDisease",
  VACCINATION_LAST_3_MONTH = "hadVaccinationLast3Month",
}

// Mapping of backend keys to human-readable labels
export const columnDisplayNames: Record<DonorColumns, string> = {
  [DonorColumns.FIRST_NAME]: "First Name",
  [DonorColumns.LAST_NAME]: "Last Name",
  [DonorColumns.EMAIL]: "Email",
  [DonorColumns.PHONE]: "Phone",
  [DonorColumns.GENDER]: "Gender",
  [DonorColumns.BLOOD_GROUP]: "Blood Group",
  [DonorColumns.OCCUPATION]: "Occupation",
  [DonorColumns.DOB]: "Date of Birth",
  [DonorColumns.CURRENT_COUNTRY]: "Current Country",
  [DonorColumns.CURRENT_CITY]: "Current City",
  [DonorColumns.CURRENT_DISTRICT]: "Current District",
  [DonorColumns.CURRENT_MUNICIPALITY]: "Current Municipality",
  [DonorColumns.CURRENT_ZIPCODE]: "Current Zipcode",
  [DonorColumns.CURRENT_STREET]: "Current Address",
  [DonorColumns.CURRENT_WARDNO]: "Current Ward No.",
  [DonorColumns.PERMANENT_COUNTRY]: "Permanent Country",
  [DonorColumns.PERMANENT_DISTRICT]: "Permanent District",
  [DonorColumns.PERMANENT_MUNICIPALITY]: "Permanent Municipality",
  [DonorColumns.PERMANENT_ZIPCODE]: "Permanent Zipcode",
  [DonorColumns.PERMANENT_STREET]: "Permanent Address",
  [DonorColumns.PERMANENT_WARDNO]: "Permanent Ward No.",
  [DonorColumns.PERMANENT_CITY]: "Permanent City",
  [DonorColumns.WEIGHT]: "Weight",
  [DonorColumns.HEIGHT]: "Height",
  [DonorColumns.LAST_DONATED_DATE]: "Last Donated Date",
  [DonorColumns.EVER_RECEIVED_BLOOD]: "Ever Received Blood",
  [DonorColumns.DONTAED_BLOOD_BEFORE]: "Ever Donated Blood",
  [DonorColumns.VACCINATION_LAST_3_MONTH]: "Vaccination in last 3 months",
  [DonorColumns.VICTIM_OF_ANY_DISEASES]: "Victim of Diseases",
};

// Type for donor data
type DonorData = {
  [key in DonorColumns]: string | number;
};

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [showUpload, setShowUpload] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const isFiltered = table.getState().columnFilters.length > 0;

  const generateSampleData = () => {
    setIsGenerating(true);

    // Helper functions
    const randomDate = (start: Date, end: Date) =>
      new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
      )
        .toISOString()
        .split("T")[0];
    const randomElement = <T,>(arr: T[]): T =>
      arr[Math.floor(Math.random() * arr.length)];
    const randomPhone = () =>
      Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const randomWeight = () => Math.floor(45 + Math.random() * 50);
    const randomHeight = () => Math.floor(150 + Math.random() * 40);

    // Data generators
    const firstNames = [
      "John",
      "Sarah",
      "Michael",
      "Emily",
      "David",
      "Emma",
      "James",
      "Olivia",
      "Robert",
      "Sophia",
      "William",
      "Ava",
      "Joseph",
      "Mia",
      "Daniel",
      "Charlotte",
    ];
    const lastNames = [
      "Smith",
      "Johnson",
      "Brown",
      "Davis",
      "Wilson",
      "Miller",
      "Taylor",
      "Anderson",
      "Thomas",
      "Jackson",
      "White",
      "Harris",
      "Martin",
      "Thompson",
    ];
    const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const occupations = [
      "Doctor",
      "Engineer",
      "Teacher",
      "Nurse",
      "Software Developer",
      "Accountant",
      "Lawyer",
      "Architect",
      "Student",
      "Business Owner",
    ];
    const countries = ["USA", "Canada", "UK", "Australia", "Nepal", "India"];
    const wardNos = Array.from({ length: 50 }, (_, i) => i + 1);
    const districts = {
      USA: ["California", "New York", "Texas", "Florida"],
      Canada: ["Ontario", "Quebec", "British Columbia"],
      UK: ["England", "Scotland", "Wales"],
      Australia: ["Victoria", "New South Wales", "Queensland"],
      Nepal: ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara"],
      India: ["Delhi", "Mumbai", "Bangalore"],
    };

    const cities = {
      USA: ["Los Angeles", "Chicago", "Houston", "Phoenix"],
      Canada: ["Toronto", "Vancouver", "Calgary", "Ottawa"],
      UK: ["London", "Manchester", "Birmingham", "Liverpool"],
      Australia: ["Sydney", "Melbourne", "Perth", "Adelaide"],
      Nepal: ["Pokhara", "Biratnagar", "Chitwan", "Dharan"],
      India: ["Hyderabad", "Chennai", "Kolkata", "Pune"],
    };
    const municipalities = {
      USA: ["Los Angeles", "New York City", "Houston", "Miami"],
      Canada: ["Toronto", "Montreal", "Vancouver"],
      UK: ["London", "Edinburgh", "Cardiff"],
      Australia: ["Melbourne", "Sydney", "Brisbane"],
      Nepal: ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara"],
      India: ["New Delhi", "Mumbai", "Bangalore"],
    };
    const streetNames = [
      "Main",
      "Oak",
      "Pine",
      "Maple",
      "Cedar",
      "Elm",
      "Birch",
    ];
    const streetTypes = ["St", "Ave", "Rd", "Blvd", "Ln"];

    // Generate 200 sample records using the enum keys
    const donors: DonorData[] = Array.from({ length: 50 }, (_, i) => {
      const firstName = randomElement(firstNames);
      const lastName = randomElement(lastNames);
      const country = randomElement(countries) as keyof typeof districts;
      const district = randomElement(districts[country]);
      const city = randomElement(cities[country]);
      const municipality = randomElement(municipalities[country]);
      const sameAddress = Math.random() > 0.7;

      return {
        [DonorColumns.FIRST_NAME]: firstName,
        [DonorColumns.LAST_NAME]: lastName,
        [DonorColumns.EMAIL]: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        [DonorColumns.PHONE]: randomPhone(),
        [DonorColumns.GENDER]: randomElement(["Male", "Female", "Others"]),
        [DonorColumns.BLOOD_GROUP]: randomElement(bloodGroups),
        [DonorColumns.OCCUPATION]: randomElement(occupations),
        [DonorColumns.DOB]: randomDate(
          new Date(1970, 0, 1),
          new Date(2000, 0, 1)
        ),
        [DonorColumns.CURRENT_COUNTRY]: country,
        [DonorColumns.CURRENT_CITY]: city,
        [DonorColumns.CURRENT_WARDNO]: randomElement(wardNos).toString(),
        [DonorColumns.CURRENT_DISTRICT]: district,
        [DonorColumns.CURRENT_MUNICIPALITY]: municipality,
        [DonorColumns.CURRENT_ZIPCODE]: Math.floor(
          10000 + Math.random() * 90000
        ).toString(),
        [DonorColumns.CURRENT_STREET]: `${Math.floor(
          1 + Math.random() * 100
        )} ${randomElement(streetNames)} ${randomElement(streetTypes)}`,
        [DonorColumns.PERMANENT_COUNTRY]: sameAddress
          ? country
          : randomElement(countries),
        [DonorColumns.PERMANENT_CITY]: sameAddress
          ? city
          : randomElement(cities[country]),
        [DonorColumns.PERMANENT_DISTRICT]: sameAddress
          ? district
          : randomElement(districts[country]),
        [DonorColumns.PERMANENT_MUNICIPALITY]: sameAddress
          ? municipality
          : randomElement(municipalities[country]),
        [DonorColumns.PERMANENT_ZIPCODE]: Math.floor(
          10000 + Math.random() * 90000
        ).toString(),
        [DonorColumns.PERMANENT_WARDNO]: randomElement(wardNos).toString(),
        [DonorColumns.PERMANENT_STREET]: `${Math.floor(
          1 + Math.random() * 100
        )} ${randomElement(streetNames)} ${randomElement(streetTypes)}`,
        [DonorColumns.WEIGHT]: randomWeight(),
        [DonorColumns.HEIGHT]: randomHeight(),
        [DonorColumns.LAST_DONATED_DATE]:
          Math.random() > 0.3
            ? randomDate(new Date(2020, 0, 1), new Date())
            : "",
        [DonorColumns.EVER_RECEIVED_BLOOD]: Math.random() > 0.7 ? "Yes" : "No",
        [DonorColumns.VACCINATION_LAST_3_MONTH]:
          Math.random() > 0.7 ? "Yes" : "No",
        [DonorColumns.DONTAED_BLOOD_BEFORE]: Math.random() > 0.5 ? "Yes" : "No",
        [DonorColumns.VICTIM_OF_ANY_DISEASES]:
          Math.random() > 0.8 ? "Yes" : "No",
      } as DonorData;
    });

    // Create worksheet with human-readable column headers
    const displayDonors = donors.map((donor) =>
      Object.keys(donor).reduce((acc, key) => {
        const columnKey = key as DonorColumns;
        acc[columnDisplayNames[columnKey] || key] = donor[columnKey];
        return acc;
      }, {} as Record<string, string | number>)
    );
    const worksheet = XLSX.utils.json_to_sheet(displayDonors);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Donors");
    XLSX.writeFile(workbook, "blood_donors_sample.xlsx");
    setIsGenerating(false);
  };

  const bloodGroups = useSelector((state) => state.common.bloodGroups);


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
          <div className="flex gap-x-2">
            {table.getColumn('donor.gender') && (
              <DataTableFacetedFilter
                column={table.getColumn('donor.gender')}
                title={columnDisplayNames[DonorColumns.GENDER]}
                options={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                  { label: "Others", value: "Others" },
                ]}
              />
            )}

            {table.getColumn("donor.bloodGroup.id") && (
              <DataTableFacetedFilter
                column={table.getColumn("donor.bloodGroup.id")}
                title="Blood Group"
                options={bloodGroups}
              />
            )}

          </div>
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUpload(!showUpload)}
            className="ml-2 h-8 lg:flex"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={generateSampleData}
            disabled={isGenerating}
            className="ml-2 h-8 lg:flex"
          >
            {isGenerating ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Generating...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Generate Sample
              </>
            )}
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => printPDF(table.getFilteredRowModel().rows, "Donors")}
              className="h-8"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCsv(table.getFilteredRowModel().rows, "Donors")}
              className="h-8"
            >
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
            {/* <DataTableViewOptions table={table} /> */}
          </div>
        </div>
      </div>

      {showUpload && (
        <div className="rounded-md border p-4">
          <BulkFileUpload />
        </div>
      )}
    </div>
  );
}
