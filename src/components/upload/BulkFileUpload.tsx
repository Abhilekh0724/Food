import api from "@/api";
import { useAuth } from "@/context/auth-context";
import {
  columnDisplayNames,
  DonorColumns,
} from "@/pages/donors/components/data-table-toolbar";
import { fetchDonors } from "@/store/features/donor-slice";
import { dispatch, useSelector } from "@/store/store";
import { devLog } from "@/util/logger";
import { PaginationState } from "@tanstack/react-table";
import { Download, Loader2, RefreshCw, Upload, X } from "lucide-react";
import Papa from "papaparse";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";

interface UploadProgress {
  total: number;
  completed: number;
  successes: number;
  errors: number;
}

interface FailedRow {
  row: any; // Combined userProfile and donorProfile
  errorMessage: string;
}

export const BulkFileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [failedRows, setFailedRows] = useState<FailedRow[]>([]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const bloodGroups = useSelector((state) => state.common.bloodGroups);
  const roles = useSelector((state) => state.common.roles).roles;
  const role = roles.find((r: any) => r.type === "authenticated");

  const { user: me } = useAuth();

  function generateRandomPassword() {
    const characters =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let password = "";

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }

    return password;
  }

  // Reverse mapping from human-readable names to backend keys
  const displayToBackendKey = Object.entries(columnDisplayNames).reduce(
    (acc, [backendKey, displayName]) => {
      acc[displayName] = backendKey as DonorColumns;
      return acc;
    },
    {} as Record<string, DonorColumns>
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (
      ![
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ].includes(file.type)
    ) {
      toast.error("Invalid file type");
      return;
    }

    setFile(file);
    setProgress(null);
    setFailedRows([]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    maxFiles: 1,
  });

  const handleRefresh = () => {
    dispatch(
      fetchDonors({
        params: {
          pagination: {
            page: pagination.pageIndex + 1,
            pageSize: pagination.pageSize,
          },
          filters: {
            organizer: {
              id: me?.organizerProfile?.id,
            },
          },
          populate: "donor.donorProfile",
        },
      })
    );
    toast.info("Donor list refreshed");
  };

  const downloadErrorExcel = () => {
    if (failedRows.length === 0) return;

    // Map failed rows to include all fields and reverse-map bloodGroup and role
    const errorData = failedRows.map(({ row, errorMessage }) => {
      const mappedRow = Object.keys(row).reduce((acc, backendKey) => {
        const displayKey =
          Object.entries(columnDisplayNames).find(
            ([key, value]) => key === backendKey
          )?.[1] || backendKey;
        let value = row[backendKey];

        // Reverse-map bloodGroup to label
        if (backendKey === "bloodGroup" && bloodGroups) {
          const matchingBloodGroup = bloodGroups.find(
            (group: any) => group.value === value
          );
          value = matchingBloodGroup ? matchingBloodGroup.label : value;
        }

        // Reverse-map role to label
        if (backendKey === "role" && roles) {
          const matchingRole = roles.find((r: any) => r.id === value);
          value = matchingRole ? matchingRole.type : value;
        }

        acc[displayKey] = value;
        return acc;
      }, {} as Record<string, any>);
      return { ...mappedRow, "Error Message": errorMessage };
    });

    // Create a new workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(errorData);
    const workbook = XLSX.utils.book_new();

    // Apply light red background to the "Error Message" column
    const errorColumnKey = Object.keys(errorData[0]).find(
      (key) => key === "Error Message"
    );
    if (errorColumnKey) {
      const colIndex = Object.keys(errorData[0]).indexOf(errorColumnKey);
      const colLetter = String.fromCharCode(65 + colIndex); // Convert index to letter (e.g., 0 -> A, 1 -> B)

      // Iterate through all rows (including header) to apply styling
      const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
      for (let row = range.s.r; row <= range.e.r; row++) {
        const cellAddress = `${colLetter}${row + 1}`; // +1 because rows are 1-indexed
        if (!worksheet[cellAddress]) continue;
        worksheet[cellAddress].s = {
          fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: { rgb: "FFCCCB" }, // Light red background
          },
        };
      }
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, "Errors");

    // Generate and download the Excel file
    XLSX.writeFile(workbook, `upload_errors_${new Date().toISOString()}.xlsx`);
  };

  const processFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress({
      total: 0,
      completed: 0,
      successes: 0,
      errors: 0,
    });
    setFailedRows([]);

    try {
      let rows: any[] = [];

      if (file.type === "text/csv") {
        // Parse CSV
        const results = await new Promise<any[]>((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            complete: (results: any) => resolve(results.data),
            error: (error: any) =>
              reject(new Error(`CSV parsing error: ${error.message}`)),
          });
        });
        rows = results;
      } else {
        const time = Date.now().toString();
        // Parse Excel
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        rows = XLSX.utils.sheet_to_json(firstSheet);

        // Transform rows to use backend-compatible keys
        rows = rows.map((row: Record<string, any>) => {
          return Object.keys(row).reduce((acc, displayKey) => {
            const backendKey = displayToBackendKey[displayKey] || displayKey;
            let value = row[displayKey];

            if (backendKey === "bloodGroup" && bloodGroups) {
              const matchingBloodGroup = bloodGroups.find(
                (group: any) => group.label === value
              );
              value = matchingBloodGroup ? matchingBloodGroup.value : value;
            }

            acc[backendKey] = value;
            return acc;
          }, {} as Record<string, any>);
        });

        rows = rows.map((row: Record<string, any>, index: number) => {
          const userProfile = {
            firstName: row.firstName,
            lastName: row.lastName,
            username: `${row.firstName.toLowerCase()} ${row.lastName.toLowerCase()}`,
            password: generateRandomPassword(),
            role: role?.id,
            email: row.email,
            phone: row.phone.toString(),
            gender: row.gender,
            dob: row.dob,
            bloodGroup: row.bloodGroup,
            currentAddress: {
              country: row.currCountry,
              district: row.currDistrict,
              municipality: row.currMunicipality,
              zipCode: row.currZipcode,
              streetAddress: row.currStreetAddress,
              wardNo: row.currWardNo,
              city: row.currCity,
            },
            permanentAddress: {
              country: row.permCountry,
              district: row.permDistrict,
              municipality: row.permMunicipality,
              zipCode: row.permZipcode,
              streetAddress: row.permStreetAddress,
              wardNo: row.permWardNo,
              city: row.permCity,
            },
          };

          const donorProfile = {
            bloodGroup: row.bloodGroup,
            height: row.height,
            weight: row.weight,
            lastDonatedDate: row.lastDonatedDate,
            everReceivedBlood: row.everReceivedBlood === "Yes",
            donatedBloodBefore: row.donatedBloodBefore === "Yes",
            hadVaccinationLast3Month: row.hadVaccinationLast3Month === "Yes",
            victimOfAnyDisease: row.victimOfAnyDisease === "Yes",
            donorId: `DP-${time.slice(-4)}${index}`,
          };

          return {
            userProfile,
            donorProfile,
          };
        });
      }

      if (rows.length === 0) {
        throw new Error("No data found in the file");
      }

      setProgress({
        total: rows.length,
        completed: 0,
        successes: 0,
        errors: 0,
      });

      // Process rows one by one with live updates
      for (const data of rows) {
        try {
          const user = await api.post("users", { ...data.userProfile });
          await api.post("donor-profiles", {
            data: {
              ...data.donorProfile,
              user: user.data.id,
            },
          });
          await api.post("organizer-donors", {
            data: {
              donor: user.data.id,
              organizer: me?.organizerProfile.id,
            },
          });

          await api.post("email", {
            to: data.userProfile.email,
            subject: "Complete Your Profile and Change Your Password",
            html: `
              <p>Dear ${data.userProfile.firstName} ${data.userProfile.lastName},</p>
              <p>Welcome to our platform! To complete your profile and change your password, please download our app using the links below:</p>
              <p>
                <a href="https://play.google.com/store/apps/details?id=com.hamrobloodbank&pcampaignid=web_share" target="_blank">Download on Play Store</a> or
                <a href="https://apps.apple.com/np/app/hamro-blood-bank-find-donors/id6504245843" target="_blank">Download on App Store</a>
              </p>
              <p>Once you log in, you can update your profile and set a new password for your account.</p>
              <p>Your temporary login credentials are:</p>
              <ul>
                <li><strong>Username:</strong> ${data.userProfile.username}</li>
                <li><strong>Password:</strong> ${data.userProfile.password}</li>
              </ul>
              <p>We recommend changing your password immediately after logging in.</p>
              <p>Thank you for joining us!</p>
              <p>Best regards,</p>
              <p>The Team</p>
              `,
          });

          // Update progress with success
          setProgress((prev) => ({
            ...prev!,
            completed: prev!.completed + 1,
            successes: prev!.successes + 1,
            errors: prev!.errors,
          }));
        } catch (error: any) {
          // Update progress with error and store failed row (both userProfile and donorProfile)
          setProgress((prev) => ({
            ...prev!,
            completed: prev!.completed + 1,
            successes: prev!.successes,
            errors: prev!.errors + 1,
          }));
          setFailedRows((prev) => [
            ...prev,
            {
              row: {
                // Spread all userProfile properties except currentAddress/permanentAddress
                ...(({ currentAddress, permanentAddress, ...rest }) => rest)(
                  data.userProfile
                ),
                // Spread all donorProfile properties
                ...data.donorProfile,
                everReceivedBlood: data.donorProfile.everReceivedBlood
                  ? "Yes"
                  : "No",
                donatedBloodBefore: data.donorProfile.donatedBloodBefore
                  ? "Yes"
                  : "No",
                hadVaccinationLast3Month: data.donorProfile
                  .hadVaccinationLast3Month
                  ? "Yes"
                  : "No",
                victimOfAnyDisease: data.donorProfile.victimOfAnyDisease
                  ? "Yes"
                  : "No",
                // Manually include the address fields you want
                currCountry: data.userProfile.currentAddress.country,
                currZipcode: data.userProfile.currentAddress.zipCode,
                currDistrict: data.userProfile.currentAddress.district,
                currStreetAddress:
                  data.userProfile.currentAddress.streetAddress,
                currMunicipality: data.userProfile.currentAddress.municipality,
                currWardNo: data.userProfile.currentAddress.wardNo,
                currCity: data.userProfile.currentAddress.city,
                permCountry: data.userProfile.permanentAddress.country,
                permZipcode: data.userProfile.permanentAddress.zipCode,
                permDistrict: data.userProfile.permanentAddress.district,
                permStreetAddress:
                  data.userProfile.permanentAddress.streetAddress,
                permMunicipality:
                  data.userProfile.permanentAddress.municipality,
                permWardNo: data.userProfile.permanentAddress.wardNo,
                permCity: data.userProfile.permanentAddress.city,
              },
              errorMessage:
                error.response?.data?.error?.message ||
                "Unknown error occurred",
            },
          ]);
          devLog(`Error sending data ${JSON.stringify(data)}`, error);
        }
      }

      // // Show toast notifications only once after processing all rows
      // if (progress?.successes && progress.successes > 0) {
      //   toast.success(`Successfully uploaded ${progress.successes} records`);
      // }
      // if (progress?.errors && progress.errors > 0) {
      //   toast.error(`Failed to upload ${progress.errors} records`);
      // }
    } catch (error) {
      devLog("Error processing file:", error);
      toast.error("Upload failed");
    } finally {
      setIsProcessing(false);
    }
  };

  devLog(progress, "preooogse");

  return (
    <Card className="p-6 max-w-3xl mx-auto">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Blood Donor Bulk Registration</h2>
        </div>

        <Separator />

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${isDragActive ? "bg-accent" : "bg-background"
            }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            {isDragActive ? (
              <p className="font-medium">Drop the file here...</p>
            ) : (
              <>
                <p className="font-medium">Drag and drop a file here</p>
                <p className="text-sm text-muted-foreground">
                  .xlsx files only
                </p>
              </>
            )}
          </div>
        </div>

        {file && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{file.name}</span>
                <span className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFile(null)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {progress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Progress: {progress.completed}/{progress.total}
              </span>
              <div className="flex space-x-2">
                <span className="text-sm text-green-600">
                  Success: {progress.successes}
                </span>
                <span
                  className={`text-sm text-red-600 ${progress.errors > 0 ? "cursor-pointer underline" : ""
                    }`}
                  onClick={progress.errors > 0 ? downloadErrorExcel : undefined}
                >
                  <div className="flex items-center gap-2">
                    <span>Errors: {progress.errors}</span> <Download size={15} />
                  </div>
                </span>
              </div>
            </div>
            <Progress
              value={(progress.completed / progress.total) * 100}
              className="h-2"
            />
          </div>
        )}

        <div className="flex space-x-2">
          <Button
            onClick={processFile}
            disabled={!file || isProcessing}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Donor Records
              </>
            )}
          </Button>
          {progress?.completed === progress?.total && !isProcessing && (
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reload Donor Data
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
