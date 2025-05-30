import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams } from "react-router-dom"
import DashboardBreadcrumb from "@/components/common/breadcrumb"
import { useEffect, useState } from "react"
import { dispatch, useSelector } from "@/store/store"
import Loader from "@/components/common/loader"
import moment from "moment"
import { Badge } from "@/components/ui/badge"
import { fetchSingleBloodTransfers, updateBloodTransferRequest } from "@/store/features/blood-transfer-slice"
import OrganizerDetail from "./components/detail/organizers-information"
import PouchesInformation from "./components/detail/pouches-information"
import TimelineInformation from "./components/detail/timeline-information"
import { fetchBloodPouches } from "@/store/features/blood-pouch-slice"
import { useAuth } from "@/context/auth-context"
import { Dialog } from "@/components/ui/dialog"
import { ConfirmDialog } from "@/components/dialog/confirmation"
import { MultiSelect } from "@/components/ui/multi-select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"

export default function BloodTransferDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [actionType, setActionType] = useState<'Approve' | 'Reject' | 'Cancel' | 'Complete' | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedPouches, setSelectedPouches] = useState<string[]>([]);
  const [transferDate, setTransferDate] = useState<Date | undefined>(new Date());



  const singleTransfer = useSelector(state => state.bloodTransfer.singleData)
  const fetchLoading = useSelector(state => state.bloodTransfer.fetchLoading)
  const loading = useSelector((state) => state.bloodTransfer.isLoading);
  const pouches = useSelector((state) => state.bloodPouch.data);

  useEffect(() => {
    dispatch(fetchSingleBloodTransfers({
      params: {
        populate: 'fromOrganizer,toOrganizer,requestedBloodPouches.bloodGroup,bloodGroup'
      },
      id
    }))
  }, [id])

  const breadcrumbItems = [
    { label: "Blood Transfers", href: "/blood-transfers" },
    { label: "Transfer Request Details", href: `/blood-transfers/${id}` }
  ]

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'approve':
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>
      case 'transfer':
        return <Badge className="bg-purple-500 hover:bg-purple-600">Transferred</Badge>
      case 'cancel':
        return <Badge variant="destructive">Cancelled</Badge>
      case 'reject':
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleApproveRequest = () => {

    dispatch(fetchBloodPouches({
      params: {
        filters: {
          isUsed: false,
          isWasted: false,
          organizer: {
            id: user?.organizerProfile?.id
          },
          $and: [
            { bloodGroup: { name: singleTransfer?.attributes?.bloodGroup?.data?.attributes?.name } },
            { bloodType: singleTransfer?.attributes?.bloodType },
            {
              $or: [
                { bloodPouchRequests: { id: { $null: true } } }, // No request exists
                {
                  bloodPouchRequests: {
                    status: { $eq: "Reject" } // If request exists, status must be "Reject"
                  }
                }
              ]
            }
          ]
        },
        pagination: {
          pageSize: 1000,
          page: 1,
        },
      }
    }))

    setActionType('Approve');
    setDialogOpen(true);

  }

  const handleAction = () => {
    if (!actionType) return;

    const data = {
      status: actionType,
      statusMessage: actionType === 'Approve'
        ? selectedOptions.join(', ')
        : statusMessage,
      ...(actionType === 'Approve' && { approvedAt: new Date(), requestedBloodPouches: selectedPouches }),
      ...(actionType === 'Reject' && { rejectedAt: new Date() }),
      ...(actionType === 'Cancel' && { cancelledAt: new Date() }),
      ...(actionType === 'Complete' && { transferAt: transferDate, status: 'Transfer' }),
    }


    dispatch(updateBloodTransferRequest({
      data, id: singleTransfer?.id, status: actionType, // 'APPROVE' or 'REJECT'
      actionBy: user?.id,
      onClose: () => {
        setDialogOpen(false);
        setStatusMessage('');
        setSelectedOptions([]);
        setActionType(null);
      },
      fromDetailPage: true
    }));
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <DashboardBreadcrumb items={breadcrumbItems} homeHref="/" />
      </div>

      {fetchLoading ? <Loader /> : singleTransfer && (
        <>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transfer Request Details</h1>
            <p className="text-muted-foreground">
              Request ID: {singleTransfer?.id} • {getStatusBadge(singleTransfer?.attributes?.status)}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transfer Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Request Type</p>
                    <p className="font-medium">{singleTransfer?.attributes?.requestType || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Blood Type</p>
                    <p className="font-medium">{singleTransfer?.attributes?.bloodType || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Blood Group</p>
                    <p className="font-medium">
                      {singleTransfer?.attributes?.bloodGroup?.data?.attributes?.name || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Units Requested</p>
                    <p className="font-medium">{singleTransfer?.attributes?.noOfUnits || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Purpose</p>
                    <p className="font-medium">{singleTransfer?.attributes?.purpose || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Requested Date</p>
                    <p className="font-medium">
                      {moment(singleTransfer?.attributes?.createdAt).format("DD MMM, YYYY hh:mm A")}
                    </p>
                  </div>
                  {singleTransfer?.attributes?.approvedAt && (
                    <div>
                      <p className="text-sm text-muted-foreground">Approved Date</p>
                      <p className="font-medium">
                        {moment(singleTransfer?.attributes?.approvedAt).format("DD MMM, YYYY hh:mm A")}
                      </p>
                    </div>
                  )}
                  {singleTransfer?.attributes?.transferAt && (
                    <div>
                      <p className="text-sm text-muted-foreground">Transferred Date</p>
                      <p className="font-medium">
                        {moment(singleTransfer?.attributes?.transferAt).format("DD MMM, YYYY hh:mm A")}
                      </p>
                    </div>
                  )}
                  {singleTransfer?.attributes?.statusMessage && (
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Message</p>
                      <p className="font-medium">{singleTransfer?.attributes?.statusMessage}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Tabs defaultValue="organizers" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="organizers">Organizers</TabsTrigger>
                  <TabsTrigger value="pouches">Blood Pouches</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>

                <TabsContent value="organizers">
                  <OrganizerDetail />
                </TabsContent>

                <TabsContent value="pouches">
                  <PouchesInformation />
                </TabsContent>

                <TabsContent value="timeline">
                  <TimelineInformation />
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              {!(singleTransfer?.attributes?.status === 'Cancel' || singleTransfer?.attributes?.status === 'Transfer') && <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {singleTransfer?.attributes?.status === 'Pending' && (
                    <>
                      <Button onClick={handleApproveRequest} className="w-full">Approve Request</Button>
                      <Button
                        onClick={() => {
                          setActionType('Reject');
                          setDialogOpen(true);
                        }} className="w-full" variant="outline">
                        Reject Request
                      </Button>
                    </>
                  )}
                  {singleTransfer?.attributes?.status === 'Approve' && (
                    <Button onClick={() => {
                      setActionType('Complete');
                      setDialogOpen(true);
                    }} className="w-full">Complete Transfer</Button>
                  )}
                  {/* <Button className="w-full" variant="outline">
                    Print Details
                  </Button>
                  <Button className="w-full" variant="outline">
                    Download Report
                  </Button> */}
                </CardContent>
              </Card>}

              <Card>
                <CardHeader>
                  <CardTitle>Request Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span>{getStatusBadge(singleTransfer?.attributes?.status)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">From</span>
                    <span className="text-right">
                      {singleTransfer?.attributes?.fromOrganizer?.data?.attributes?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">To</span>
                    <span className="text-right">
                      {singleTransfer?.attributes?.toOrganizer?.data?.attributes?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Blood Group</span>
                    <span>
                      {singleTransfer?.attributes?.bloodGroup?.data?.attributes?.name || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Units</span>
                    <span>{singleTransfer?.attributes?.noOfUnits || '-'}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <ConfirmDialog
          loading={loading}
          title={`${actionType?.toUpperCase()} Blood Transfer Request?`}
          description={
            actionType === 'Approve' ? (
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select blood pouches
                  </label>
                  <MultiSelect
                    showSelectAll={false}
                    options={pouches?.data?.map(p => ({
                      label: p?.attributes?.pouchId,
                      value: p?.id,
                    })) || []}
                    onValueChange={setSelectedPouches}
                    placeholder="Select pouches"
                    variant="inverted"
                    animation={2}
                  />
                </div>
                {selectedOptions.includes("Other (specify in message)") && (
                  <div>
                    <label htmlFor="approvalMessage" className="block text-sm font-medium text-gray-700">
                      Additional Message
                    </label>
                    <Textarea
                      id="approvalMessage"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      placeholder="Enter additional comments..."
                      value={statusMessage}
                      onChange={(e) => setStatusMessage(e.target.value)}
                    />
                  </div>
                )}
              </div>
            ) : actionType === 'Complete' ? (
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Transfer Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {transferDate ? format(transferDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={transferDate}
                        onSelect={setTransferDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label htmlFor="transferMessage" className="block text-sm font-medium text-gray-700">
                    Transfer Notes (Optional)
                  </label>
                  <Textarea
                    id="transferMessage"
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    placeholder="Enter any notes about the transfer..."
                    value={statusMessage}
                    onChange={(e) => setStatusMessage(e.target.value)}
                  />
                </div>
              </div>
            ) : (actionType === 'Reject' || actionType === 'Cancel') ? (
              <div className="mt-4">
                <label htmlFor="statusMessage" className="block text-sm font-medium text-gray-700">
                  {actionType} Reason
                </label>
                <Textarea
                  id="statusMessage"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  placeholder="Enter reason for rejection..."
                  value={statusMessage}
                  onChange={(e) => setStatusMessage(e.target.value)}
                  required
                />
              </div>
            ) : (
              "Are you sure you want to cancel this transfer request?"
            )
          }
          onOk={handleAction}
          onClose={() => {
            setDialogOpen(false);
            setStatusMessage('');
            setSelectedOptions([]);
            setActionType(null);
          }}
        />
      </Dialog>
    </div>
  )
}
