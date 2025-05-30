import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector } from "@/store/store";
import moment from "moment";
import { Badge } from "@/components/ui/badge";

export default function TimelineInformation() {
  const singleTransfer = useSelector(state => state.bloodTransfer.singleData);

  // Status configuration
  const statusConfig = {
    pending: {
      color: "bg-yellow-500",
      label: "Pending",
      description: "Request created and waiting for approval"
    },
    approve: {
      color: "bg-green-500",
      label: "Approved",
      description: "Request has been approved"
    },
    reject: {
      color: "bg-red-500",
      label: "Rejected",
      description: "Request has been rejected"
    },
    cancel: {
      color: "bg-gray-500",
      label: "Cancelled",
      description: "Request has been cancelled"
    },
    transfer: {
      color: "bg-purple-500",
      label: "Transferred",
      description: "Blood units have been transferred"
    }
  };

  // Get current status in lowercase
  const currentStatus = singleTransfer?.attributes?.status?.toLowerCase() || 'pending';

  // Determine which timeline items to show based on status
  const showApproved = ['approve', 'transfer'].includes(currentStatus);
  const showRejected = currentStatus === 'reject';
  const showCancelled = currentStatus === 'cancel';
  const showTransferred = currentStatus === 'transfer';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Always show created */}
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <div className={`h-4 w-4 rounded-full ${statusConfig.pending.color} mt-1`} />
            <div className="w-px h-full bg-border" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">Request Created</p>
              {currentStatus === 'pending' && (
                <Badge variant="secondary">Current</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {moment(singleTransfer?.attributes?.createdAt).format("DD MMM, YYYY hh:mm A")}
            </p>
            <p className="text-sm mt-1 text-muted-foreground">
              {statusConfig.pending.description}
            </p>
          </div>
        </div>

        {/* Approved status */}
        {showApproved && (
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className={`h-4 w-4 rounded-full ${statusConfig.approve.color} mt-1`} />
              {!showTransferred && <div className="w-px h-full bg-border" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">Request Approved</p>
                {currentStatus === 'approve' && (
                  <Badge variant="secondary">Current</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {moment(singleTransfer?.attributes?.approvedAt).format("DD MMM, YYYY hh:mm A")}
              </p>
              {singleTransfer?.attributes?.statusMessage && (
                <p className="text-sm mt-1">
                  {singleTransfer?.attributes?.statusMessage}
                </p>
              )}
              <p className="text-sm mt-1 text-muted-foreground">
                {statusConfig.approve.description}
              </p>
            </div>
          </div>
        )}

        {/* Rejected status */}
        {showRejected && (
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className={`h-4 w-4 rounded-full ${statusConfig.reject.color} mt-1`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">Request Rejected</p>
                <Badge variant="secondary">Current</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {moment(singleTransfer?.attributes?.rejectedAt).format("DD MMM, YYYY hh:mm A")}
              </p>

              <p className="text-sm mt-1 text-muted-foreground">
                {statusConfig.reject.description}
              </p>
            </div>
          </div>
        )}

        {/* Cancelled status */}
        {showCancelled && (
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className={`h-4 w-4 rounded-full ${statusConfig.cancel.color} mt-1`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">Request Cancelled</p>
                <Badge variant="secondary">Current</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {moment(singleTransfer?.attributes?.cancelledAt).format("DD MMM, YYYY hh:mm A")}
              </p>

              <p className="text-sm mt-1 text-muted-foreground">
                {statusConfig.cancel.description}
              </p>
            </div>
          </div>
        )}

        {/* Transferred status */}
        {showTransferred && (
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className={`h-4 w-4 rounded-full ${statusConfig.transfer.color} mt-1`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">Transfer Completed</p>
                <Badge variant="secondary">Current</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {moment(singleTransfer?.attributes?.transferAt).format("DD MMM, YYYY hh:mm A")}
              </p>

              <p className="text-sm mt-1 text-muted-foreground">
                {statusConfig.transfer.description}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
