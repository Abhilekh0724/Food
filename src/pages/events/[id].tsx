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
} from "lucide-react"
import { Link } from "react-router-dom"

// This would normally come from a database
const getEventData = (id: string) => {
  return {
    id,
    name: "World Blood Donor Day",
    startDate: "June 14, 2025",
    endDate: "June 14, 2025",
    time: "9:00 AM - 5:00 PM",
    location: "City Community Center",
    address: "123 Main St, Anytown, CA 12345",
    coordinates: { lat: 34.0522, lng: -118.2437 },
    goal: 50,
    registered: 12,
    status: "upcoming",
    description:
      "Join us for World Blood Donor Day! This campaign aims to raise awareness about the need for safe blood and to thank blood donors for their life-saving gifts of blood. Your donation can save up to three lives. We welcome all eligible donors to participate in this important event.",
    organizers: [
      {
        id: "ORG-001",
        name: "Jane Smith",
        role: "Event Manager",
        phone: "+1 (555) 123-4567",
        email: "jane.smith@example.com",
      },
      {
        id: "ORG-002",
        name: "Michael Johnson",
        role: "Volunteer Coordinator",
        phone: "+1 (555) 987-6543",
        email: "michael.johnson@example.com",
      },
    ],
    volunteers: [
      {
        id: "VOL-001",
        name: "Sarah Williams",
        role: "Medical Staff",
        status: "confirmed",
      },
      {
        id: "VOL-002",
        name: "Robert Brown",
        role: "Registration",
        status: "confirmed",
      },
      {
        id: "VOL-003",
        name: "Emily Davis",
        role: "Refreshments",
        status: "pending",
      },
    ],
    donors: [
      {
        id: "DON-001",
        name: "John Smith",
        bloodType: "O+",
        appointmentTime: "10:00 AM",
        status: "scheduled",
      },
      {
        id: "DON-002",
        name: "Emily Johnson",
        bloodType: "A-",
        appointmentTime: "11:30 AM",
        status: "scheduled",
      },
      {
        id: "DON-003",
        name: "Michael Williams",
        bloodType: "B+",
        appointmentTime: "1:00 PM",
        status: "scheduled",
      },
      {
        id: "DON-004",
        name: "Jessica Brown",
        bloodType: "AB+",
        appointmentTime: "2:30 PM",
        status: "scheduled",
      },
      {
        id: "DON-005",
        name: "David Miller",
        bloodType: "O-",
        appointmentTime: "3:45 PM",
        status: "scheduled",
      },
    ],
    bloodTypeNeeds: [
      { type: "A+", goal: 10, registered: 2 },
      { type: "A-", goal: 5, registered: 1 },
      { type: "B+", goal: 8, registered: 1 },
      { type: "B-", goal: 4, registered: 0 },
      { type: "AB+", goal: 3, registered: 1 },
      { type: "AB-", goal: 2, registered: 0 },
      { type: "O+", goal: 12, registered: 5 },
      { type: "O-", goal: 6, registered: 2 },
    ],
    documents: [
      {
        id: "DOC-001",
        name: "Event Flyer.pdf",
        type: "application/pdf",
        size: "1.2 MB",
        uploadedAt: "May 15, 2025",
        url: "/placeholder.svg?height=400&width=300&text=Event+Flyer",
      },
      {
        id: "DOC-002",
        name: "Donor Eligibility Guidelines.pdf",
        type: "application/pdf",
        size: "850 KB",
        uploadedAt: "May 15, 2025",
        url: "/placeholder.svg?height=400&width=300&text=Eligibility+Guidelines",
      },
    ],
    updates: [
      {
        id: "UPD-001",
        date: "May 15, 2025",
        title: "Event Announced",
        content: "World Blood Donor Day campaign has been officially announced. Registration is now open!",
      },
      {
        id: "UPD-002",
        date: "May 20, 2025",
        title: "Volunteer Positions",
        content: "We're looking for additional volunteers to help with registration and refreshments.",
      },
    ],
  }
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const campaign = getEventData(params.id)

  // Calculate total registration percentage
  const totalRegistrationPercentage = (campaign.registered / campaign.goal) * 100

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/community/campaigns">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Event Details</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="bg-red-600 hover:bg-red-700">
            <Edit className="mr-2 h-4 w-4" />
            Edit Event
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{campaign.name}</CardTitle>
              <CardDescription>Event ID: {campaign.id}</CardDescription>
            </div>
            {getStatusBadge(campaign.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>
                  {campaign.startDate}
                  {campaign.startDate !== campaign.endDate && ` - ${campaign.endDate}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>{campaign.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>
                  {campaign.location} - {campaign.address}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>
                  {campaign.registered} registered of {campaign.goal} goal
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
              <div className="flex flex-wrap gap-2 mt-4">
                {campaign.bloodTypeNeeds.map((need) => (
                  <div key={need.type} className="border rounded-md p-2 text-center min-w-[80px]">
                    <div className="text-lg font-bold text-red-600">{need.type}</div>
                    <div className="text-xs text-muted-foreground">
                      {need.registered} / {need.goal}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Event Description</h3>
            <p className="text-muted-foreground">{campaign.description}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="donors">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="donors">Donors</TabsTrigger>
          <TabsTrigger value="organizers">Organizers & Volunteers</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
        </TabsList>

        <TabsContent value="donors" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Registered Donors</CardTitle>
                  <CardDescription>People who have signed up to donate blood</CardDescription>
                </div>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Users className="mr-2 h-4 w-4" />
                  Add Donor
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor</TableHead>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Appointment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaign.donors.map((donor) => (
                      <TableRow key={donor.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-red-100 text-red-700">
                                {donor.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{donor.name}</p>
                              <p className="text-xs text-muted-foreground">{donor.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-medium text-red-700">
                            {donor.bloodType}
                          </div>
                        </TableCell>
                        <TableCell>{donor.appointmentTime}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              donor.status === "scheduled"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                : donor.status === "completed"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : donor.status === "cancelled"
                                    ? "bg-red-100 text-red-800 hover:bg-red-100"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                            }
                          >
                            {donor.status.charAt(0).toUpperCase() + donor.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" asChild>
                              <Link to={`/community/donors/${donor.id}`}>View Profile</Link>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                              Reschedule
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              Cancel
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organizers" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Organizers</CardTitle>
              <CardDescription>Staff responsible for managing this campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {campaign.organizers.map((organizer) => (
                  <div key={organizer.id} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-red-100 text-red-700">
                        {organizer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium">{organizer.name}</h3>
                      <p className="text-sm text-muted-foreground">{organizer.role}</p>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2">
                        <div className="flex items-center text-sm">
                          <Phone className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span>{organizer.phone}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span>{organizer.email}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Contact
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Volunteers</CardTitle>
                  <CardDescription>People helping with the campaign</CardDescription>
                </div>
                <Button>
                  <Users className="mr-2 h-4 w-4" />
                  Add Volunteer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaign.volunteers.map((volunteer) => (
                      <TableRow key={volunteer.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-blue-100 text-blue-700">
                                {volunteer.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{volunteer.name}</p>
                              <p className="text-xs text-muted-foreground">{volunteer.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{volunteer.role}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              volunteer.status === "confirmed"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            }
                          >
                            {volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                              Contact
                            </Button>
                            {volunteer.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2 text-xs text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  Confirm
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <XCircle className="mr-1 h-3 w-3" />
                                  Reject
                                </Button>
                              </>
                            )}
                            {volunteer.status === "confirmed" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Event Documents</CardTitle>
                  <CardDescription>Flyers, guidelines, and other materials</CardDescription>
                </div>
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaign.documents.map((document) => (
                  <div key={document.id} className="flex items-center justify-between border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                        <FileText className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium">{document.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {document.type} • {document.size} • Uploaded on {document.uploadedAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="updates" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Event Updates</CardTitle>
                  <CardDescription>Announcements and news about this campaign</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Post Update
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {campaign.updates.map((update) => (
                  <div key={update.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{update.title}</h3>
                      <p className="text-sm text-muted-foreground">{update.date}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{update.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Event Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button className="bg-red-600 hover:bg-red-700">
              <Users className="mr-2 h-4 w-4" />
              Manage Donors
            </Button>
            <Button variant="outline">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Send Notification
            </Button>
            <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Event
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
