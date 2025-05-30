import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, Filter, MapPin, Plus, Search, Users, Droplet } from "lucide-react"
import { Link } from "react-router-dom"

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blood Donation Events</h1>
          <p className="text-muted-foreground">Organize and manage your blood donation drives</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All Events</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Blood donation drives scheduled for the future</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input placeholder="Search events..." className="pl-8" />
                  </div>
                  <div className="flex gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="community-center">Community Center</SelectItem>
                        <SelectItem value="university">University Campus</SelectItem>
                        <SelectItem value="corporate">Corporate Offices</SelectItem>
                        <SelectItem value="hospital">Hospitals</SelectItem>
                        <SelectItem value="mobile">Mobile Drives</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="newest">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Date (Newest First)</SelectItem>
                        <SelectItem value="oldest">Date (Oldest First)</SelectItem>
                        <SelectItem value="goal-high">Goal (Highest First)</SelectItem>
                        <SelectItem value="goal-low">Goal (Lowest First)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      id: "CAMP-001",
                      name: "World Blood Donor Day",
                      startDate: "June 14, 2025",
                      endDate: "June 14, 2025",
                      location: "City Community Center",
                      address: "123 Main St, Anytown",
                      goal: 50,
                      registered: 12,
                      status: "upcoming",
                      image: "/placeholder.svg?height=100&width=200&text=World+Blood+Donor+Day",
                    },
                    {
                      id: "CAMP-002",
                      name: "University Campus Drive",
                      startDate: "July 2, 2025",
                      endDate: "July 3, 2025",
                      location: "State University",
                      address: "456 University Ave, College Town",
                      goal: 35,
                      registered: 8,
                      status: "upcoming",
                      image: "/placeholder.svg?height=100&width=200&text=University+Drive",
                    },
                    {
                      id: "CAMP-003",
                      name: "Corporate Wellness Day",
                      startDate: "July 15, 2025",
                      endDate: "July 15, 2025",
                      location: "Tech Park",
                      address: "789 Innovation Blvd, Tech City",
                      goal: 25,
                      registered: 5,
                      status: "upcoming",
                      image: "/placeholder.svg?height=100&width=200&text=Corporate+Wellness",
                    },
                    {
                      id: "CAMP-004",
                      name: "Hospital Staff Drive",
                      startDate: "August 5, 2025",
                      endDate: "August 6, 2025",
                      location: "General Hospital",
                      address: "321 Medical Center Blvd, Healthville",
                      goal: 40,
                      registered: 15,
                      status: "upcoming",
                      image: "/placeholder.svg?height=100&width=200&text=Hospital+Staff+Drive",
                    },
                    {
                      id: "CAMP-005",
                      name: "Community Health Fair",
                      startDate: "August 20, 2025",
                      endDate: "August 21, 2025",
                      location: "Downtown Plaza",
                      address: "555 Central Ave, Metro City",
                      goal: 60,
                      registered: 0,
                      status: "upcoming",
                      image: "/placeholder.svg?height=100&width=200&text=Health+Fair",
                    },
                    {
                      id: "CAMP-006",
                      name: "Back to School Blood Drive",
                      startDate: "September 3, 2025",
                      endDate: "September 4, 2025",
                      location: "High School Gymnasium",
                      address: "888 Education Rd, Schoolville",
                      goal: 30,
                      registered: 0,
                      status: "upcoming",
                      image: "/placeholder.svg?height=100&width=200&text=Back+to+School",
                    },
                  ].map((event) => (
                    <Card key={event.id} className="overflow-hidden">
                      <div className="h-[140px] overflow-hidden">
                        <img
                          src={event.image || "/placeholder.svg"}
                          alt={event.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{event.name}</CardTitle>
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Upcoming</Badge>
                        </div>
                        <CardDescription>{event.location}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="space-y-3">
                          <div className="flex items-center text-sm">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>
                              {event.startDate}
                              {event.startDate !== event.endDate && ` - ${event.endDate}`}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{event.address}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>
                              {event.registered} registered of {event.goal} goal
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-red-600 h-2 rounded-full"
                              style={{ width: `${(event.registered / event.goal) * 100}%` }}
                            ></div>
                          </div>
                          <div className="pt-2 flex justify-end">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/community/events/${event.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing <strong>1-6</strong> of <strong>6</strong> upcoming events
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Events</CardTitle>
              <CardDescription>Currently running blood donation drives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    id: "CAMP-007",
                    name: "Summer Blood Drive",
                    startDate: "May 20, 2025",
                    endDate: "May 25, 2025",
                    location: "Central Park",
                    address: "100 Park Ave, Greenville",
                    goal: 75,
                    collected: 32,
                    status: "active",
                    image: "/placeholder.svg?height=100&width=200&text=Summer+Blood+Drive",
                  },
                  {
                    id: "CAMP-008",
                    name: "Emergency Services Week",
                    startDate: "May 22, 2025",
                    endDate: "May 28, 2025",
                    location: "Fire Department HQ",
                    address: "456 Rescue Blvd, Safetown",
                    goal: 45,
                    collected: 18,
                    status: "active",
                    image: "/placeholder.svg?height=100&width=200&text=Emergency+Services",
                  },
                ].map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="h-[140px] overflow-hidden">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{event.name}</CardTitle>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                      </div>
                      <CardDescription>{event.location}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>
                            {event.startDate} - {event.endDate}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{event.address}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Droplet className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>
                            {event.collected} units of {event.goal} goal
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-red-600 h-2 rounded-full"
                            style={{ width: `${(event.collected / event.goal) * 100}%` }}
                          ></div>
                        </div>
                        <div className="pt-2 flex justify-end">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/community/events/${event.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Events</CardTitle>
              <CardDescription>Past blood donation drives and their results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    id: "CAMP-009",
                    name: "Spring Health Initiative",
                    startDate: "April 10, 2025",
                    endDate: "April 15, 2025",
                    location: "Community College",
                    address: "200 Education Blvd, Learnville",
                    goal: 50,
                    collected: 62,
                    status: "completed",
                    image: "/placeholder.svg?height=100&width=200&text=Spring+Health",
                  },
                  {
                    id: "CAMP-010",
                    name: "Valentine's Day Drive",
                    startDate: "February 14, 2025",
                    endDate: "February 14, 2025",
                    location: "Shopping Mall",
                    address: "789 Retail Way, Shopville",
                    goal: 30,
                    collected: 35,
                    status: "completed",
                    image: "/placeholder.svg?height=100&width=200&text=Valentine+Drive",
                  },
                  {
                    id: "CAMP-011",
                    name: "New Year Blood Drive",
                    startDate: "January 5, 2025",
                    endDate: "January 10, 2025",
                    location: "City Hall",
                    address: "123 Government St, Civictown",
                    goal: 40,
                    collected: 38,
                    status: "completed",
                    image: "/placeholder.svg?height=100&width=200&text=New+Year+Drive",
                  },
                ].map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="h-[140px] overflow-hidden">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{event.name}</CardTitle>
                        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Completed</Badge>
                      </div>
                      <CardDescription>{event.location}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>
                            {event.startDate}
                            {event.startDate !== event.endDate && ` - ${event.endDate}`}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{event.address}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Droplet className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>
                            {event.collected} units collected ({event.goal} goal)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className={`h-2 rounded-full ${event.collected >= event.goal ? "bg-green-600" : "bg-red-600"
                              }`}
                            style={{ width: `${Math.min((event.collected / event.goal) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <div className="pt-2 flex justify-end">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/community/events/${event.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Showing all events regardless of status.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
