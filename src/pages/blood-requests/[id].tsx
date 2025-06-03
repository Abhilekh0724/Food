import DashboardBreadcrumb from "@/components/common/breadcrumb";
import Loader from "@/components/common/loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BloodRequest } from "@/lib/types";
import { fetchSingleBloodRequests } from "@/store/features/blood-request-slice";
import { dispatch, useSelector } from "@/store/store";
import { devLog } from "@/util/logger";
import {
  ChevronLeft,
  HelpingHand,
  Hospital,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { NotifyDonorsModal } from "./components/notify-donors-modal";

export default function BloodRequestDetail() {
  const { id } = useParams();
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);

  const requestData = useSelector(
    (state) => state.bloodRequest.singleData
  ) as BloodRequest;
  const fetchLoading = useSelector((state) => state.bloodRequest.fetchLoading);

  useEffect(() => {
    dispatch(
      fetchSingleBloodRequests({
        id,
        params: {
          populate:
            "requestedBy,acceptors.acceptor,requestedBloodGroup,attachments",
        },
      })
    );
  }, [id]);

  if (!requestData) {
    return <div>Loading...</div>;
  }

  // Format short date (without time)
  const formatShortDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate days remaining
  const calculateDaysRemaining = () => {
    const today = new Date();
    const requiredBy = new Date(requestData?.attributes?.needBefore || today);
    const diffTime = requiredBy.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get status badge
  const getStatusBadge = () => {
    const fulfilledUnits =
      requestData?.attributes?.acceptors?.data?.reduce(
        (total, acceptor) =>
          total +
          (acceptor?.attributes?.status === "Donated"
            ? acceptor?.attributes?.donatedUnits
            : 0),
        0
      ) || 0;
    const totalUnits = requestData?.attributes?.noOfUnits || 0;
    const isFulfilled = fulfilledUnits >= totalUnits;

    if (isFulfilled) {
      return <Badge className="bg-green-500">Fulfilled</Badge>;
    } else if (fulfilledUnits > 0) {
      return <Badge className="bg-amber-500">Partially Fulfilled</Badge>;
    }
    return <Badge className="bg-blue-500">Active</Badge>;
  };

  // Get urgency badge
  const getUrgencyBadge = (urgency?: string) => {
    switch (urgency?.toLowerCase()) {
      case "critical":
        return <Badge className="bg-red-500">Critical</Badge>;
      case "urgent":
        return <Badge className="bg-orange-500">Urgent</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case "low":
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return <Badge>{urgency || "Unknown"}</Badge>;
    }
  };

  // Get acceptor status badge
  const getAcceptorStatusBadge = (status?: string) => {
    devLog(status, "stattus");
    switch (status?.toLowerCase()) {
      case "donated":
        return <Badge className="bg-green-500">Donated</Badge>;
      case "accepted":
        return <Badge className="bg-blue-500">Accepted</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge>{status || "Unknown"}</Badge>;
    }
  };

  // Calculate fulfillment
  const fulfilledUnits =
    requestData?.attributes?.acceptors?.data?.reduce(
      (total, acceptor) =>
        total +
        (acceptor?.attributes?.status === "Donated"
          ? acceptor?.attributes?.donatedUnits
          : 0),
      0
    ) || 0;
  const totalUnits = requestData?.attributes?.noOfUnits || 1;
  const fulfillmentPercentage = (fulfilledUnits / totalUnits) * 100;

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Blood Requests", href: "/blood-requests" },
    { label: "Request Details", href: `/blood-requests/${requestData?.id}` },
  ];

  // Get requester name
  const requester = requestData?.attributes?.requestedBy?.data;
  const requesterName = `${requester?.attributes?.firstName || ""} ${requester?.attributes?.lastName || ""
    }`.trim();

  return (
    <>
      {fetchLoading ? (
        <Loader />
      ) : (
        <div className="mx-auto py-6 px-4">
          <div className="mb-6">
            <DashboardBreadcrumb items={breadcrumbItems} homeHref="/" />
          </div>

          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" asChild>
                  <Link to="/blood-requests">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                  </Link>
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">
                    Blood Request {requestData?.attributes?.bloodRequestId}
                  </h1>
                  <p className="text-muted-foreground">
                    Created on{" "}
                    {formatShortDate(requestData?.attributes?.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {
                  totalUnits - fulfilledUnits > 0 && (
                    <>
                      <Button size="sm" onClick={() => setNotifyModalOpen(true)}>
                        <HelpingHand className="h-4 w-4 mr-2" />
                        Notify Donors
                      </Button>

                      <NotifyDonorsModal
                        open={notifyModalOpen}
                        onOpenChange={setNotifyModalOpen}
                        request={requestData}
                      />
                    </>
                  )
                }

              </div>
            </div>

            {/* Status Card */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="text-sm text-muted-foreground">Status</div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge()}
                      <span className="font-medium">
                        {fulfilledUnits} of {totalUnits} units fulfilled
                      </span>
                    </div>
                    <Progress
                      value={fulfillmentPercentage}
                      className="h-2 mt-1"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="text-sm text-muted-foreground">
                      Blood Type Needed
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 font-bold">
                        {
                          requestData?.attributes?.requestedBloodGroup?.data
                            ?.attributes?.name
                        }
                      </div>
                      <div>
                        <div className="font-medium">
                          {
                            requestData?.attributes?.requestedBloodGroup?.data
                              ?.attributes?.name
                          }{" "}
                          Blood
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {totalUnits} units needed
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="text-sm text-muted-foreground">Urgency</div>
                    <div className="flex items-center gap-2">
                      {getUrgencyBadge(requestData?.attributes?.urgency)}
                      <span className="font-medium">
                        {calculateDaysRemaining()} days remaining
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Required by{" "}
                      {formatShortDate(requestData?.attributes?.needBefore)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left column - Patient and Requester Info */}
              <div className="md:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">
                          {requestData?.attributes?.patientName || "N/A"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {requestData?.attributes?.patientAge || "N/A"} years •{" "}
                          {requestData?.attributes?.patientGender
                            ? requestData.attributes.patientGender
                              .charAt(0)
                              .toUpperCase() +
                            requestData.attributes.patientGender.slice(1)
                            : "N/A"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Hospital className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">
                          {requestData?.attributes?.hospital || "N/A"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div className="text-sm">
                        {requestData?.attributes?.streetAddress || "N/A"},{" "}
                        {requestData?.attributes?.municipality || "N/A"},{" "}
                        {requestData?.attributes?.district || "N/A"}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div className="text-sm">
                        {requestData?.attributes?.patientPhone || "N/A"}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Requester Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={requester?.attributes?.avatarUrl || undefined}
                          alt={requesterName}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {requesterName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {requesterName || "N/A"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {requestData?.attributes?.relationToPatient || "N/A"}{" "}
                          of patient
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div className="text-sm">
                        {requester?.attributes?.phone || "N/A"}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div className="text-sm">
                        {requester?.attributes?.email || "N/A"}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {requestData?.attributes?.caseDescription && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Case Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm">
                        {requestData.attributes.caseDescription}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Request Attachments</CardTitle>
                    <CardDescription>
                      Documents and images related to this blood request
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {requestData?.attributes?.attachments?.data?.length ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {requestData.attributes.attachments.data.map(
                          (attachment) => (
                            <a
                              key={attachment.id}
                              href={attachment.attributes?.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block aspect-square rounded-md overflow-hidden border hover:border-primary transition-all hover:shadow-md"
                            >
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <img
                                  src={attachment?.attributes?.url}
                                  alt={attachment?.attributes?.name}
                                />
                              </div>
                            </a>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        No attachments available for this request
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right column - Tabs with Acceptors and Timeline */}
              <div className="md:col-span-2">

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Blood Donors</CardTitle>
                      <Badge
                        variant={
                          fulfilledUnits >= totalUnits
                            ? "default"
                            : "outline"
                        }
                        className={
                          fulfilledUnits >= totalUnits ? "bg-green-500" : ""
                        }
                      >
                        {fulfilledUnits} of {totalUnits} units
                      </Badge>
                    </div>
                    <CardDescription>
                      People who have donated or scheduled to donate for
                      this request
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Donor</TableHead>
                          <TableHead>Units</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requestData?.attributes?.acceptors?.data
                          ?.length ? (
                          requestData.attributes.acceptors.data.map(
                            (acceptor, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage
                                        src={
                                          acceptor?.attributes?.acceptor
                                            ?.data?.attributes?.avatarUrl ||
                                          undefined
                                        }
                                        alt={
                                          acceptor?.attributes?.acceptor
                                            ?.data?.attributes?.username
                                        }
                                      />
                                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                        {acceptor?.attributes?.acceptor?.data?.attributes?.username
                                          ?.split(" ")
                                          ?.map((n) => n[0])
                                          ?.join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="font-medium">
                                        {acceptor?.attributes?.acceptor
                                          ?.data?.attributes?.username ||
                                          `Donor ${acceptor?.attributes?.acceptor
                                            ?.data?.attributes
                                            ?.username || index
                                          }`}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        ID:{" "}
                                        {acceptor?.attributes?.acceptor
                                          ?.data?.id || index}
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {acceptor?.attributes?.donatedUnits || 0}
                                </TableCell>
                                <TableCell>
                                  {formatShortDate(
                                    acceptor?.attributes?.acceptedAt
                                  )}
                                </TableCell>
                                <TableCell>
                                  {getAcceptorStatusBadge(
                                    acceptor?.attributes?.status
                                  )}
                                </TableCell>
                              </TableRow>
                            )
                          )
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              className="text-center text-muted-foreground py-8"
                            >
                              No donors have accepted this request yet
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      {totalUnits - fulfilledUnits > 0
                        ? `${totalUnits - fulfilledUnits} more units needed`
                        : "All units fulfilled"}
                    </div>
                    {/* {totalUnits - fulfilledUnits > 0 && (
                      <Button size="sm">
                        <HelpingHand className="h-4 w-4 mr-2" />
                        Find More Donors
                      </Button>
                    )} */}
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
