import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  Edit,
  MapPin,
  Share,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  FileText,
  Plus,
  Delete,
  Trash,
  Loader2,
} from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { dispatch, useSelector } from "@/store/store"
import { useEffect, useState } from "react"
import { deleteEvent, fetchSingleEvents } from "@/store/features/event-slice"
import moment from "moment"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { ConfirmDialog } from "@/components/dialog/confirmation"
import { useAuth } from "@/context/auth-context"

export default function EventDetailPage() {

  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [open, setOpen] = useState<boolean>(false);

  const eventDetail = useSelector(state => state.event.singleEvent)
  const loading = useSelector(state => state.event.isLoading)

  useEffect(() => {
    dispatch(fetchSingleEvents({
      id, params: {
        populate: 'address,featureImage,eventJoiners.user.bloodGroup'
      }
    }))
  }, [id])
  // Calculate total registration percentage
  const totalRegistrationPercentage = (eventDetail?.attributes?.eventJoiners?.data?.length / eventDetail?.attributes?.noOfParticipants) * 100

  // Determine status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Upcoming</Badge>
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const handleDeleteEvent = () => {
    dispatch(deleteEvent({ id: eventDetail?.id, actionBy: user?.id, onClose: () => navigate(-1) }))
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/community/events">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Event Details</h1>
        </div>
        <div className="flex gap-2">
          {/* <Button variant="outline" size="sm">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button> */}
          <Button disabled={loading} onClick={() => navigate(`/community/events/edit/${eventDetail?.id}`)} size="sm" className="bg-red-600 hover:bg-red-700">
            <Edit className="mr-2 h-4 w-4" />
            Edit Event
          </Button>

          <Button
            disabled={loading}
            onClick={() => setOpen(true)} size="sm" className="hover:bg-red-700">
            <Trash className="mr-2 h-4 w-4" />
            {loading ? <Loader2 className="animate-spin" /> : "Delete Event"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{eventDetail?.attributes?.name}</CardTitle>
              <CardDescription>Event ID: {eventDetail?.id}</CardDescription>
            </div>
            {getStatusBadge(eventDetail?.attributes?.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>
                  {moment(eventDetail?.attributes?.eventDateTime)?.format("DD MMM, YYYY | HH:mm A")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>
                  {eventDetail?.attributes?.noOfParticipants} participants
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Registration Progress</p>
                <Progress value={totalRegistrationPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {totalRegistrationPercentage.toFixed(0)}% of goal reached
                </p>
              </div>

            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Event Description</h3>
            <p className="text-muted-foreground">{eventDetail?.attributes?.description}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="donors">
        {/* <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="donors">Donors</TabsTrigger>
          <TabsTrigger value="organizers">Organizers & Volunteers</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
        </TabsList> */}

        {/* <TabsContent value="donors" className="space-y-4 mt-4"> */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Registered Donors</CardTitle>
                <CardDescription>People who have signed up to donate blood</CardDescription>
              </div>

            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donor</TableHead>
                    <TableHead>Blood Group</TableHead>
                  </TableRow>
                </TableHeader>
                {eventDetail?.attributes?.eventJoiners?.data?.length ?
                  <TableBody>

                    {eventDetail?.attributes?.eventJoiners?.data?.map((donor: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-red-100 text-red-700">
                                {donor?.attributes?.user?.data?.attributes?.username
                                  .split(" ")
                                  .map((n: any) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{donor?.attributes?.user?.data?.attributes?.firstName} {donor?.attributes?.user?.data?.attributes?.lastName}</p>
                              <p className="text-xs text-muted-foreground">{donor?.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-medium text-red-700">
                            {donor?.attributes?.user?.data?.attributes?.bloodGroup?.data?.attributes?.name}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  : <div className="flex justify-center m-10">No Data</div>}
              </Table>
            </div>
          </CardContent>
        </Card>
        {/* </TabsContent> */}




      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Event Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* <Button className="bg-red-600 hover:bg-red-700">
              <Users className="mr-2 h-4 w-4" />
              Manage Donors
            </Button> */}
            <Button variant="outline">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Send Notification
            </Button>
            {/* <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Event
            </Button> */}
          </div>
        </CardContent>
      </Card>

      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger asChild></DialogTrigger>
        <ConfirmDialog
          loading={loading}
          title={`Delete Event: ${eventDetail?.attributes?.name}?`}
          onOk={() => handleDeleteEvent()}
          onClose={() => setOpen(false)}
        />
      </Dialog>

    </div>
  )
}
