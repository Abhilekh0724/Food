import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { devLog } from "@/util/logger";
import { BloodRequest } from "@/lib/types";
import { useForm } from "react-hook-form";
import { NotifyDonorsFormValues, notifyDonorsSchema } from "@/pages/donors/schema/notify-donors-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { dispatch, useSelector } from "@/store/store";
import { fetchDonors } from "@/store/features/donor-slice";
import { useAuth } from "@/context/auth-context";
import { createNotification } from "@/store/features/notification-slice";

interface SelectedDonor {
  id: string;
  fcmTokens: {
    token: string,
    enable: boolean
  }[];
}

interface NotifyDonorsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: BloodRequest;
}

export function NotifyDonorsModal({
  open,
  onOpenChange,
  request,
}: NotifyDonorsModalProps) {
  const { user } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const donors = useSelector((state) => state.donor.data);

  // Fetch donors based on blood group and organizer
  useEffect(() => {
    if (user?.organizerProfile?.id && request?.attributes?.requestedBloodGroup?.data?.id) {
      dispatch(
        fetchDonors({
          params: {
            filters: {
              donor: {
                bloodGroup: {
                  id: request?.attributes?.requestedBloodGroup?.data?.id,
                },
              },
              organizer: {
                id: user?.organizerProfile?.id,
              },
            },
            pagination: {
              page: 1,
              pageSize: 1000,
            },
            populate: ["donor.bloodGroup", "donor.avatar", "donor.donorProfile", "donor.fcmTokens"],
          },
        })
      );
    }
  }, [request?.attributes?.requestedBloodGroup?.data?.id, user?.organizerProfile?.id]);

  const form = useForm<NotifyDonorsFormValues>({
    resolver: zodResolver(notifyDonorsSchema),
    defaultValues: {
      title: "",
      message: "",
      selectedDonors: [],
    },
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = form;
  const selectedDonors = watch("selectedDonors") as SelectedDonor[];

  // Filter donors based on search term
  const filteredDonors = donors?.data?.filter((donor: any) =>
    donor.attributes.donor.data.attributes.username
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  ) || [];

  const handleSelectAll = () => {
    if (selectedDonors.length === filteredDonors.length) {
      setValue("selectedDonors", [], { shouldValidate: true });
    } else {
      const donorsWithTokens = filteredDonors.map((donor: any) => ({
        id: donor.id.toString(),
        fcmTokens: donor?.attributes?.donor?.data?.attributes?.fcmTokens || []
      }));
      setValue("selectedDonors", donorsWithTokens, { shouldValidate: true });
    }
  };

  const handleDonorSelect = (donorId: string, fcmTokens: { token: string, enable: boolean }[] = []) => {
    const currentSelected = selectedDonors.map(d => d.id);
    if (currentSelected.includes(donorId)) {
      setValue(
        "selectedDonors",
        selectedDonors.filter((donor) => donor.id !== donorId),
        { shouldValidate: true }
      );
    } else {
      setValue(
        "selectedDonors",
        [...selectedDonors, { id: donorId, fcmTokens }],
        { shouldValidate: true }
      );
    }
  };

  const isDonorSelected = (donorId: string) => {
    return selectedDonors.some(donor => donor.id === donorId);
  };

  const onSubmit = async (data: NotifyDonorsFormValues) => {
    setIsSending(true);
    try {
      // Flatten all FCM tokens from selected donors
      const allFcmTokens = (data.selectedDonors as SelectedDonor[])
        .flatMap(donor => donor.fcmTokens)
        .filter(token => token); // Remove any empty/null tokens

      if (allFcmTokens.length === 0) {
        console.warn("No FCM tokens available for selected donors");
        return;
      }

      devLog("Sending notification to tokens:", allFcmTokens);

      dispatch(createNotification({
        data: {
          title: data.title,
          body: data.message,
          targetType: "tokens",
          target: allFcmTokens?.map(token => token.token)?.join(','),
          payload: {
            requestId: request.id,
          }
        },
        onClose: () => onOpenChange(false),
        actionBy: user?.id,
      }));

      onOpenChange(false);
      reset();
      setSearchTerm("");
    } finally {
      setIsSending(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    reset();
    setSearchTerm("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <div className="flex h-[500px] gap-4">
          {/* Left Sidebar: Scrollable Donors List */}
          <div className="w-1/3 border-r pr-4 pl-2 overflow-y-auto">
            <DialogHeader className="sticky top-0 bg-background pb-4 z-10">
              <DialogTitle className="text-lg font-semibold">Select Donors</DialogTitle>
              <DialogDescription>
                Choose potential donors for request {request.attributes.bloodRequestId}
              </DialogDescription>
              <div className="relative mt-2">
                <Input
                  placeholder="Search donors by name..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                    onClick={clearSearch}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="flex items-center mt-2">
                <Checkbox
                  id="select-all"
                  checked={selectedDonors.length === filteredDonors.length && filteredDonors.length > 0}
                  onCheckedChange={handleSelectAll}
                  className="mr-2"
                />
                <label
                  htmlFor="select-all"
                  className="text-sm font-medium cursor-pointer hover:text-primary"
                >
                  Select All ({selectedDonors.length}/{filteredDonors.length})
                </label>
              </div>
              {errors.selectedDonors && (
                <p className="text-sm text-destructive mt-1">{errors.selectedDonors.message}</p>
              )}
            </DialogHeader>
            <div className="space-y-3">
              {filteredDonors.length > 0 ? (
                filteredDonors.map((donor: any) => {
                  const donorId = donor.id.toString();
                  const fcmTokens = donor.attributes.donor.data.attributes.fcmTokens || [];
                  return (
                    <div
                      key={donorId}
                      className="flex items-center p-3 rounded-lg hover:bg-muted cursor-pointer border border-border transition-colors"
                    >
                      <Checkbox
                        id={`donor-${donorId}`}
                        checked={isDonorSelected(donorId)}
                        onCheckedChange={() => handleDonorSelect(donorId, fcmTokens)}
                        className="mr-3"
                      />
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage
                          src={donor.attributes.donor.data.attributes.avatar?.data?.attributes?.url}
                          alt={donor.attributes.donor.data.attributes.username}
                        />
                        <AvatarFallback>
                          {donor.attributes.donor.data.attributes.username?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <label
                          htmlFor={`donor-${donorId}`}
                          className="font-medium text-sm cursor-pointer hover:text-primary"
                        >
                          {donor.attributes.donor.data.attributes.username || "Unknown User"}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Blood Group:{" "}
                          <span className="font-semibold">
                            {donor?.attributes.donor.data.attributes.bloodGroup?.data?.attributes?.name || "N/A"}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          donorID:{" "}
                          <span className="font-semibold">
                            {donor?.attributes.donor.data.attributes.donorProfile?.data?.attributes?.donorId || "N/A"}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Tokens:{" "}
                          <span className="font-semibold">
                            {fcmTokens.length || "0"}
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {searchTerm ? "No donors found" : "No donors available"}
                </p>
              )}
            </div>
          </div>

          {/* Right Content: Enhanced Message and Request Info */}
          <div className="w-2/3">
            <Card className="h-full flex flex-col !border-0 !shadow-none !p-0">
              <CardHeader>
                <CardTitle>Notify Potential Donors</CardTitle>
                <DialogDescription>
                  Compose a notification for request {request.attributes.bloodRequestId}
                </DialogDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="title"
                      className="w-full"
                      placeholder="Enter notification title..."
                      {...register("title")}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="message" className="text-right">
                    Message
                  </Label>
                  <div className="col-span-3">
                    <Textarea
                      id="message"
                      className="w-full"
                      placeholder="Write a message to potential donors about this blood request..."
                      rows={5}
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right">Request Info</Label>
                  <div className="col-span-3 text-sm space-y-2">
                    <p>
                      <strong>Blood Type:</strong>{" "}
                      {request.attributes.requestedBloodGroup?.data?.attributes?.name ?? "N/A"}
                    </p>
                    <p>
                      <strong>Units Needed:</strong>{" "}
                      {request.attributes.noOfUnits ?? "N/A"}
                    </p>
                    <p>
                      <strong>Hospital:</strong>{" "}
                      {request.attributes.hospital ?? "N/A"}
                    </p>
                    <p>
                      <strong>Urgency:</strong>{" "}
                      {request.attributes.urgency ?? "N/A"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right">Selected Donors</Label>
                  <div className="col-span-3 text-sm space-y-1">
                    {selectedDonors.length > 0 ? (
                      <>
                        <p>
                          <strong>Total Selected:</strong> {selectedDonors.length}
                        </p>
                        <p>
                          <strong>Total FCM Tokens:</strong>{" "}
                          {selectedDonors.reduce((sum, donor) => sum + donor.fcmTokens.length, 0)}
                        </p>
                      </>
                    ) : (
                      <p className="text-muted-foreground">No donors selected</p>
                    )}
                  </div>
                </div>
              </CardContent>
              <DialogFooter className="mt-auto px-6 pb-6">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSending || selectedDonors.length === 0}
                >
                  {isSending ? "Sending..." : "Send Notification"}
                </Button>
              </DialogFooter>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
